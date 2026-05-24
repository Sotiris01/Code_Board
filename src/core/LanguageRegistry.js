/**
 * LanguageRegistry — Phase 5.2
 *
 * Plugin-style discovery layer for installed languages. Reads
 * `src/languages/registry.json` once at boot and exposes:
 *
 *   LanguageRegistry.list()            → [{id,label,fileExtensions,…}, …]
 *   LanguageRegistry.get(id)           → plugin descriptor or undefined
 *   LanguageRegistry.extensions()      → ['.gls', '.glo', '.py', …]
 *   LanguageRegistry.register(plugin)  → runtime addition (used by
 *                                        `src/languages/<id>/plugin.js`)
 *   LanguageRegistry.ready             → Promise resolved after JSON load
 *
 * Coexists with the existing heavy `LanguageManager`, which keeps
 * doing dynamic script loading. The registry only owns metadata.
 */
const LanguageRegistry = (function () {
    'use strict';

    const byId = new Map();
    let _resolveReady;
    const ready = new Promise(res => { _resolveReady = res; });

    function register(plugin) {
        if (!plugin || !plugin.id) {
            console.warn('[LanguageRegistry] register(): missing id');
            return;
        }
        const existing = byId.get(plugin.id) || {};
        byId.set(plugin.id, Object.assign({}, existing, plugin));
    }

    async function loadRegistryJson() {
        try {
            const res = await fetch('src/languages/registry.json', { cache: 'no-cache' });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const data = await res.json();
            for (const lang of (data.languages || [])) register(lang);
        } catch (err) {
            console.warn('[LanguageRegistry] registry.json failed to load:', err);
        } finally {
            _resolveReady();
        }
    }

    if (typeof window !== 'undefined') loadRegistryJson();

    return {
        ready,
        register,
        get(id)        { return byId.get(id); },
        has(id)        { return byId.has(id); },
        list()         { return Array.from(byId.values()); },
        ids()          { return Array.from(byId.keys()); },
        extensions() {
            const set = new Set();
            for (const lang of byId.values()) {
                for (const ext of (lang.fileExtensions || [])) set.add(ext.toLowerCase());
            }
            return Array.from(set);
        },
        /** Find the plugin whose `fileExtensions` covers `.ext` (case-insensitive). */
        forExtension(ext) {
            const e = (ext || '').toLowerCase();
            for (const lang of byId.values()) {
                if ((lang.fileExtensions || []).map(s => s.toLowerCase()).includes(e)) return lang;
            }
            return undefined;
        }
    };
})();

if (typeof window !== 'undefined') window.LanguageRegistry = LanguageRegistry;
if (typeof module !== 'undefined' && module.exports) module.exports = LanguageRegistry;
