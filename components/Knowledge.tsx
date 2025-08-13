import { Section } from './Section.tsx';
import { articles } from '../data/portfolioData.ts';
import { Article } from '../types.ts';

interface ArticleCardProps {
    article: Article;
    onReadMore: (article: Article) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onReadMore }) => {
    return (
        <div className="bg-white dark:bg-[var(--bg-card-dark)] p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <h3 className="text-xl font-bold mb-2">{article.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">{article.summary}</p>
            <button
                onClick={() => onReadMore(article)}
                className="mt-auto self-start text-[#007BFF] font-semibold hover:underline"
            >
                Read More &rarr;
            </button>
        </div>
    );
};


interface KnowledgeProps {
    onReadMore: (article: Article) => void;
}

export const Knowledge: React.FC<KnowledgeProps> = ({ onReadMore }) => {
    return (
        <Section id="knowledge">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Knowledge Articles
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                    <ArticleCard key={article.title} article={article} onReadMore={onReadMore} />
                ))}
            </div>
        </Section>
    );
};