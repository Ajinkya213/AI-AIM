import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
    const navigate = useNavigate();

    const navigateToLogin = () => {
        navigate('/login');
    };

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
                <h2 className={`text-4xl font-bold text-foreground mb-6`}>
                    Ready to Simplify Your Technical Docs?
                </h2>
                <p className={`text-xl text-muted-foreground mb-8`}>
                    Join thousands of professionals who save hours every week with AIM's AI-powered simplification.
                </p>
                <Button
                    onClick={navigateToLogin}
                    className="bg-primary text-primary-foreground px-12 py-4 text-lg font-semibold hover:opacity-80 transition-all transform hover:scale-105 shadow-2xl"
                >
                    Start Your Free Trial
                </Button>
            </div>
        </section>
    );
};

export default CTASection; 