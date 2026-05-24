/**
 * HandRaise UI (Phase 9.2)
 * - Student: button to raise/lower hand with an optional 1-2 line note.
 * - Teacher: small badge showing the number of raised hands; tooltip lists names + notes.
 */
const HandRaise = {
    init() {
        const btn = document.getElementById('hand-raise-btn');
        if (btn) {
            btn.addEventListener('click', () => this.toggle());
        }
    },

    toggle() {
        if (typeof Collaboration === 'undefined' || !Collaboration.connected) {
            if (typeof Toasts !== 'undefined') Toasts.show('Not connected', 'error');
            return;
        }
        const raised = !Collaboration.handRaised;
        let note = '';
        if (raised) {
            // Short prompt; allow empty.
            const input = window.prompt('Optional note for the teacher (1–2 lines, up to ~280 chars):', '');
            if (input === null) return; // cancelled
            note = String(input || '').trim();
        }
        Collaboration.sendHandRaise(raised, note);
        const btn = document.getElementById('hand-raise-btn');
        if (btn) {
            btn.classList.toggle('active', raised);
            btn.title = raised ? 'Lower hand' : 'Raise hand';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Wait a tick so Collaboration.init has run.
    setTimeout(() => HandRaise.init(), 100);
});

window.HandRaise = HandRaise;
