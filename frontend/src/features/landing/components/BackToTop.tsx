import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronUp } from 'lucide-react';

export const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            {isVisible && (
                <Button
                    onClick={scrollToTop}
                    size="icon"
                    className="fixed bottom-8 right-8 z-50 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg rounded-full w-12 h-12"
                    aria-label="Back to top"
                >
                    <ChevronUp className="w-6 h-6" />
                </Button>
            )}
        </>
    );
}; 