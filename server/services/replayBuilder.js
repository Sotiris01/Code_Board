/**
 * replayBuilder — Phase 9.5
 * Builds a self-contained HTML file that replays a recorded session.
 * Embeds: baseline code, event log, and a tiny vanilla-JS player.
 * No external dependencies — works fully offline.
 */
'use strict';

function escapeHtml(s) {
    return String(s ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function buildReplayHTML(key, snapshot, events) {
    const lang = snapshot?.language || 'glossa';
    // We embed events + final snapshot. The player reconstructs intermediate
    // states by replaying patches from the first baseline event (if any) or
    // from an empty string.
    const payload = {
        key,
        language: lang,
        finalCode: snapshot?.code || '',
        events: events || []
    };
    const json = JSON.stringify(payload)
        .replace(/</g, '\\u003c'); // safe for embedding inside <script>

    return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<title>Code Board replay — ${escapeHtml(key)}</title>
<style>
    :root { color-scheme: dark; }
    html, body { margin: 0; height: 100%; background: #1e1e1e; color: #ddd; font-family: 'Segoe UI', Roboto, sans-serif; }
    header { padding: 8px 14px; background: #252526; border-bottom: 1px solid #333; display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
    header h1 { margin: 0; font-size: 14px; font-weight: 600; }
    header .meta { font-size: 12px; color: #999; }
    .controls { display: flex; gap: 8px; align-items: center; padding: 8px 14px; background: #252526; border-bottom: 1px solid #333; }
    .controls button { background: #3a3a3a; color: #ddd; border: 1px solid #555; padding: 4px 10px; border-radius: 3px; cursor: pointer; font-size: 13px; }
    .controls button:hover { background: #4a4a4a; }
    .controls input[type="range"] { flex: 1; }
    .controls .time { font-variant-numeric: tabular-nums; font-size: 12px; color: #aaa; min-width: 130px; }
    pre { margin: 0; padding: 14px; height: calc(100vh - 110px); overflow: auto; background: #1e1e1e; color: #d4d4d4; font-family: 'Cascadia Code', Consolas, monospace; font-size: 13px; white-space: pre; tab-size: 4; }
</style>
</head><body>
<header>
    <h1>Code Board — replay</h1>
    <span class="meta">Session ${escapeHtml(key)} · language ${escapeHtml(lang)} · <span id="evcount"></span> events</span>
</header>
<div class="controls">
    <button id="play">▶ Play</button>
    <button id="step">Step</button>
    <button id="reset">⟲ Reset</button>
    <input type="range" id="slider" min="0" value="0" />
    <span class="time" id="time"></span>
</div>
<pre id="view"></pre>
<script>
const DATA = ${json};
// Tiny fast-diff patch applier (inverse op: take old text + patch -> new text).
// fast-diff produces tuples [op, text] where op is -1 (delete), 0 (equal), 1 (insert).
function applyPatch(oldStr, patch) {
    if (!Array.isArray(patch)) return oldStr;
    let result = '';
    let i = 0;
    for (const [op, text] of patch) {
        const t = String(text || '');
        if (op === 0)      { result += oldStr.substr(i, t.length); i += t.length; }
        else if (op === -1){ i += t.length; }
        else if (op === 1) { result += t; }
    }
    return result;
}
// Build cumulative states by walking events from the baseline.
let baseline = '';
const baselineEv = DATA.events.find(e => e && e.type === 'baseline');
if (baselineEv && typeof baselineEv.code === 'string') baseline = baselineEv.code;
const frames = [{ t: baselineEv?.t || (DATA.events[0]?.t ?? Date.now()), code: baseline, label: 'baseline' }];
let cur = baseline;
for (const ev of DATA.events) {
    if (!ev || ev.type === 'baseline') continue;
    if (ev.type === 'code_update' && ev.patch) {
        cur = applyPatch(cur, ev.patch);
        frames.push({ t: ev.t, code: cur, label: ev.by || 'code_update' });
    }
}
// If we have a finalCode and our last frame doesn't match, append it as a safety frame.
if (DATA.finalCode && (frames.length === 0 || frames[frames.length - 1].code !== DATA.finalCode)) {
    frames.push({ t: Date.now(), code: DATA.finalCode, label: 'snapshot' });
}
const view   = document.getElementById('view');
const slider = document.getElementById('slider');
const timeEl = document.getElementById('time');
document.getElementById('evcount').textContent = frames.length;
slider.max = Math.max(0, frames.length - 1);
let idx = 0, playing = false, timer = null;
function fmt(ms) {
    const d = new Date(ms);
    return d.toLocaleTimeString();
}
function render() {
    const f = frames[idx];
    view.textContent = f ? f.code : '';
    slider.value = idx;
    timeEl.textContent = f ? (fmt(f.t) + '  (' + (idx + 1) + '/' + frames.length + ')') : '';
}
slider.addEventListener('input', () => { idx = Number(slider.value); render(); });
document.getElementById('step').addEventListener('click', () => {
    if (idx < frames.length - 1) { idx++; render(); }
});
document.getElementById('reset').addEventListener('click', () => { idx = 0; render(); });
document.getElementById('play').addEventListener('click', (e) => {
    playing = !playing;
    e.target.textContent = playing ? '⏸ Pause' : '▶ Play';
    if (timer) { clearInterval(timer); timer = null; }
    if (playing) {
        timer = setInterval(() => {
            if (idx >= frames.length - 1) {
                playing = false;
                e.target.textContent = '▶ Play';
                clearInterval(timer); timer = null;
                return;
            }
            idx++; render();
        }, 350);
    }
});
render();
</script>
</body></html>`;
}

module.exports = { buildReplayHTML };
