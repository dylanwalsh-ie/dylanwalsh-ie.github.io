/**
 * @file A custom React hook to detect when an element is visible on screen
 * @author Dylan Walsh <dylanwalsh23ie@gmail.com>
 * @description This hook uses the Intersection Observer API to efficiently track
 * the visibility of a DOM element, triggering animations or lazy-loading content
 */
import { useState, useEffect, RefObject, useMemo } from 'react';

interface UseOnScreenOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

// Custom hook that returns true if element is within the viewport
export const useOnScreen = (ref: RefObject<HTMLElement>, options?: UseOnScreenOptions): boolean => {
  const [isIntersecting, setIntersecting] = useState(false);

  // Performance optimisation to prevent objects from being recreated on every render
  const memoizedOptions = useMemo(() => {
    return {
      root: options?.root,
      rootMargin: options?.rootMargin,
      threshold: options?.threshold,
    };
  }, [options?.root, options?.rootMargin, options?.threshold]);
  
  // Check if observer should unobserve after first intersection
  const triggerOnce = options?.triggerOnce ?? true;

  // Sets up and cleans intersection observer
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // If element is visible
        if (entry.isIntersecting) {
          // update state to true
          setIntersecting(true);
          // When enabled stop observing element to save resources
          if (triggerOnce) {
            observer.unobserve(element);
          }
          // If element is not intersecting and not triggered once, set state to false
        } else if (!triggerOnce) {
            setIntersecting(false);
        }
      },
      memoizedOptions
    );

    // Start observing target
    observer.observe(element);

    // Acts as cleanup function
    // Stops observing when component  unmounts or dependencies change
    return () => {
      observer.unobserve(element);
    };
  }, [ref, memoizedOptions, triggerOnce]);

  return isIntersecting;
};
