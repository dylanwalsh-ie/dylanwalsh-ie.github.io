
/**
 * @file Reveals text with a binary scramble animation.
 * @author Dylan Walsh <dylanwalsh23ie@gmail.com>
 * @description Takes a string and progressively reveals it,
 * animating the unrevealed characters with random binary digits.
 */
import React, { useState, useEffect, useRef } from 'react';

interface BinaryScrambleTextProps {
  // Holds final text displayed after animation
  text: string;
  start: boolean;
  // Optional css to apply to component's root element
  className?: string;
  as?: React.ElementType;
  // Speed of character reveal in milliseconds per character, default to 30ms
  speed?: number;
}

const binaryChars = '01';

// Renders text with binary animation
export const BinaryScrambleText: React.FC<BinaryScrambleTextProps> = ({
  text,
  start,
  className,
  as: Component = 'p',
  speed = 30,
}) => {
  const [currentText, setCurrentText] = useState('');
  const revealedCount = useRef(0);
  const animationFrameId = useRef<number | null>(null); // Store animation frame ID for cleanup
  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null);
  const textRef = useRef(text); // Stores target text to avoid stale closures
  const isMounted = useRef(false);

  // Track component's mounted status
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // Reset animation whenever target text changes
  useEffect(() => {
    textRef.current = text;
    // Initialise display with non-breaking spaces to maintain layout
    const placeholder = text.split('').map(c => c === ' ' ? ' ' : '\u00A0').join('');
    setCurrentText(placeholder);
    revealedCount.current = 0;
    // Clean up previous text animation
    if (intervalId.current) clearInterval(intervalId.current);
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
  }, [text]);

  // Main effect that controls the animation loop
  useEffect(() => {
    if (!start) return;

    // Called on every animation frame to update text
    const scramble = () => {
      if (!isMounted.current) return;
      // Stop animation if all characters revealed
      if (revealedCount.current >= textRef.current.length) {
        if (isMounted.current) setCurrentText(textRef.current);
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
        if (intervalId.current) clearInterval(intervalId.current);
        intervalId.current = null;
        return;
      }
      
      // Generated scrambled text for current frame
      const scrambled = textRef.current
        .split('')
        .map((char, index) => {
          if (index < revealedCount.current) {
            return textRef.current[index];
          }
          if (char === ' ') return ' ';
          return binaryChars[Math.floor(Math.random() * 2)];
        })
        .join('');
      
      if (isMounted.current) setCurrentText(scrambled);
      // Call next animation frame
      animationFrameId.current = requestAnimationFrame(scramble);
    };

    // Interval to control revealed character speed
    intervalId.current = setInterval(() => {
        revealedCount.current++;
    }, speed);

    // Start animation loop
    scramble();

    // Cleanup to stop animations when component unmounts or dependencies change
    return () => {
      if (intervalId.current) clearInterval(intervalId.current);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [start, speed, text]);
  
  // Render text using specified component type e.g. 'span'
  return <Component className={className}>{currentText}</Component>;
};
