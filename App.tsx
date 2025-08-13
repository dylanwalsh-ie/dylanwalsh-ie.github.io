
import React, { useState } from 'react';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { About } from './components/About.tsx';
import { Knowledge } from './components/Knowledge.tsx';
import { Projects } from './components/Projects.tsx';
import { Education } from './components/Education.tsx';
import { Contact } from './components/Contact.tsx';
import { Footer } from './components/Footer.tsx';
import { Modal } from './components/Modal.tsx';
import { Article } from './types.ts';
import { useDarkMode } from './hooks/useDarkMode.ts';

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