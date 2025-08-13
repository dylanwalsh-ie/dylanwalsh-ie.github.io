import { renderSection } from './Section.js';
import { articles } from '../data/portfolioData.js';
import { showModal } from './Modal.js';

const ArticleCard = (article) => `
    <div class="bg-white dark:bg-[var(--bg-card-dark)] p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
        <h3 class="text-xl font-bold mb-2">${article.title}</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4 flex-grow">${article.summary}</p>
        <button
            data-article-id="${article.id}"
            class="read-more-btn mt-auto self-start text-[#007BFF] font-semibold hover:underline"
        >
            Read More &rarr;
        </button>
    </div>
`;

export function renderKnowledge() {
    const content = `
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">
            Knowledge Articles
        </h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${articles.map(ArticleCard).join('')}
        </div>
    `;
    return renderSection('knowledge', content);
}

export function attachKnowledgeListeners() {
    document.querySelectorAll('.read-more-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const articleId = e.currentTarget.dataset.articleId;
            const article = articles.find(a => a.id === articleId);
            if (article) {
                showModal(article.title, article.pdfUrl);
            }
        });
    });
}
