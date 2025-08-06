import { ArrowRight, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const navigate = useNavigate();

    const navigateToLogin = () => {
        navigate('/login');
    };

    const scrollToFeatures = () => {
        const element = document.getElementById('features');
        if (element) {
            const navbarHeight = 80;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className={`inline-flex items-center px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-primary text-sm mb-6`}>
                        <Star className="w-4 h-4 mr-2" />
                        AI-Powered Technical Simplification
                    </div>
                    <h1 className={`text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight`}>
                        Transform Complex
                        <span className="text-primary">
                            Technical Docs
                        </span>
                    </h1>
                    <p className={`text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed`}>
                        AIM uses advanced AI to convert complex technical manuals and diagrams into
                        clear, understandable content. Save hours of reading and boost productivity instantly.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                    <Button
                        onClick={navigateToLogin}
                        className="bg-primary text-primary-foreground px-8 py-4 text-lg font-semibold hover:opacity-80 transition-all transform hover:scale-105 shadow-2xl flex items-center group"
                    >
                        Get Started Free
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                        variant="outline"
                        className={`border-border text-foreground px-8 py-4 text-lg font-semibold transition-all hover:bg-accent hover:text-accent-foreground`}
                        onClick={scrollToFeatures}
                    >
                        Watch Demo
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                    <div className="text-center">
                        <div className={`text-3xl font-bold text-primary mb-2`}>10,000+</div>
                        <div className="text-muted-foreground">Documents Processed</div>
                    </div>
                    <div className="text-center">
                        <div className={`text-3xl font-bold text-primary mb-2`}>95%</div>
                        <div className="text-muted-foreground">Time Saved</div>
                    </div>
                    <div className="text-center">
                        <div className={`text-3xl font-bold text-primary mb-2`}>500+</div>
                        <div className="text-muted-foreground">Happy Users</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection; 