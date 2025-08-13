export function renderSection(id, content, extraClasses = '') {
    return `
        <section id="${id}" class="fade-in-section w-full max-w-5xl mx-auto px-6 py-16 md:py-24 ${extraClasses}">
            ${content}
        </section>
    `;
}
