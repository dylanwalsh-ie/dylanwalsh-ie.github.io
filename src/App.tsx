/**
 * @file Main root component of the portfolio
 * @author Dylan Walsh <dylanwalsh23ie@gmail.com>
 * @description This file assembles all the sections of the page
 * and handles the loading screen and animations
 */
import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Experience } from './components/Experience';
import { Education } from './components/Education';
import { Projects } from './components/Projects';
import { Interests } from './components/Interests';
import { Footer } from './components/Footer';
import { CyberpunkBackground } from './components/CyberpunkBackground';
import { LoadingScreen } from './components/LoadingScreen';
import { SectionTitle } from './components/SectionTitle';
import { Contact } from './components/Contact';
import { useOnScreen } from './components/useOnScreen';
import { BinaryScrambleText } from './components/BinaryScrambleText';


const App: React.FC = () => {
  // State for the booting screen animation
  const [isBooting, setIsBooting] = useState(true);

  // State to trigger header's typing animation
  // Only loads in once loading screen has successfully finished
  const [startHeaderTyping, setStartHeaderTyping] = useState(false);

  // State for handling animations for the rest of the portfolio
  const [startAboutAnimation, setStartAboutAnimation] = useState(false);

  // Detects if the 'about me' section is visible on the user's screen
  const aboutSectionRef = useRef<HTMLDivElement>(null);
  const aboutVisible = useOnScreen(aboutSectionRef, { threshold: 0.5 });

  // Handles transition from loading screen to main content
  useEffect(() => {
    if (!isBooting) {
      // Delay starting animations to allow the loading screen to fade out
      const timer = setTimeout(() => {
        setStartHeaderTyping(true);
        setStartAboutAnimation(true);
      }, 500); // Should match loading screen's fade-out time, may differ on low-end devices
      return () => clearTimeout(timer);
    }
  }, [isBooting]);

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <CyberpunkBackground />
      <LoadingScreen isActive={isBooting} onFinished={() => setIsBooting(false)} />
      
      <div className={`relative z-10 transition-opacity duration-1000 ${!isBooting ? 'opacity-100' : 'opacity-0'}`}>
        <Header startTyping={startHeaderTyping} />
        <About startAnimation={startAboutAnimation} />
        <main className="container mx-auto px-4 md:px-8 lg:px-16 py-12">
          <div className="flex flex-col gap-16 max-w-4xl mx-auto">
            <section id="about" ref={aboutSectionRef}>
              <SectionTitle>About Me</SectionTitle>
              <div className="cyber-card p-6 space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  <BinaryScrambleText
                    start={aboutVisible}
                    text="I’m an aspiring IT Support specialist, having just got CompTIA A+ certified and recently graduated from an I.T. Support bootcamp. Experienced in database management and academic administration, I focus on clear communication, fast triage, and follow-up so users leave confident. I enjoy troubleshooting, documenting fixes, and using simple automations to save time for both users and teams."
                    as="span"
                    speed={5}
                  />
                </p>
              </div>
            </section>
            <Skills />
            <Experience />
            <Education />
            <Projects />
            <Interests />
            <Contact />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

// FIX: Add default export for the App component.
export default App;