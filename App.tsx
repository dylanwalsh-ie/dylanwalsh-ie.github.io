
import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Knowledge } from './components/Knowledge';
import { Projects } from './components/Projects';
import { Education } from './components/Education';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Modal } from './components/Modal';
import { Article } from './types';
import { useDarkMode } from './hooks/useDarkMode';

function App() {
    const [isDarkMode, toggleDarkMode] = useDarkMode();
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    const handleOpenArticle = (article: Article) => {
        setSelectedArticle(article);
    };

    const handleCloseArticle = () => {
        setSelectedArticle(null);
    };

    return (
        <div className="antialiased">
            <div className="transition-colors duration-300">
                <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                <main>
                    <Hero />
                    <About />
                    <Knowledge onReadMore={handleOpenArticle} />
                    <Projects />
                    <Education />
                    <Contact />
                </main>
                <Footer />

                {selectedArticle && (
                    <Modal
                        isOpen={!!selectedArticle}
                        onClose={handleCloseArticle}
                        title={selectedArticle.title}
                        pdfUrl={selectedArticle.pdfUrl}
                    />
                )}
            </div>
        </div>
    );
}

export default App;