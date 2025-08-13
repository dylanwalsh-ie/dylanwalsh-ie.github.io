export function renderModal() {
    return `
        <div id="modal-backdrop" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 hidden" aria-modal="true" role="dialog">
            <div id="modal-container" class="bg-white dark:bg-[var(--bg-card-dark)] rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all scale-95 opacity-0">
                <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <h2 id="modal-title" class="text-xl font-bold"></h2>
                    <button id="modal-close-btn" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" aria-label="Close modal">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div id="modal-content" class="flex-grow overflow-y-auto">
                    <!-- Content will be injected here -->
                </div>
            </div>
        </div>
    `;
}

function handleEsc(event) {
    if (event.key === 'Escape') {
        hideModal();
    }
}

export function showModal(title, pdfUrl) {
    const backdrop = document.getElementById('modal-backdrop');
    const container = document.getElementById('modal-container');
    const titleEl = document.getElementById('modal-title');
    const contentEl = document.getElementById('modal-content');

    if (!backdrop || !container || !titleEl || !contentEl) return;
    
    titleEl.textContent = title;
    contentEl.innerHTML = `
        <iframe
            src="${pdfUrl}"
            title="${title}"
            class="w-full h-full"
            style="min-height: calc(90vh - 70px)"
            frameborder="0"
        ></iframe>`;

    document.body.style.overflow = 'hidden';
    backdrop.classList.remove('hidden');
    setTimeout(() => {
        container.classList.remove('scale-95', 'opacity-0');
    }, 10);

    backdrop.addEventListener('click', hideModal);
    container.addEventListener('click', e => e.stopPropagation());
    document.getElementById('modal-close-btn')?.addEventListener('click', hideModal);
    window.addEventListener('keydown', handleEsc);
}

export function hideModal() {
    const backdrop = document.getElementById('modal-backdrop');
    const container = document.getElementById('modal-container');
    
    if (!backdrop || !container) return;

    document.body.style.overflow = 'unset';
    container.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        backdrop.classList.add('hidden');
    }, 200);

    backdrop.removeEventListener('click', hideModal);
    window.removeEventListener('keydown', handleEsc);
}
