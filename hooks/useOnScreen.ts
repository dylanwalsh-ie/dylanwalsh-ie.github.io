import React from 'react';

export const useOnScreen = <T extends Element>(ref: React.RefObject<T>, rootMargin: string = '0px'): boolean => {
    const [isIntersecting, setIntersecting] = React.useState(false);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIntersecting(true);
                    // Disconnect after it becomes visible to prevent re-triggering
                    if (ref.current) {
                      observer.unobserve(ref.current);
                    }
                }
            },
            {
                rootMargin,
            }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [ref, rootMargin]);

    return isIntersecting;
};