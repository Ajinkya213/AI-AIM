import { Brain, Users, Clock, Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Footer = () => {
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const navbarHeight = 80; // Approximate navbar height
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <footer id="about" className={`bg-muted/30 py-12 px-4 sm:px-6 lg:px-8`}>
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <Link to="/" className="flex items-center space-x-2">
                                <div className={`w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center`}>
                                    <Brain className="w-5 h-5" />
                                </div>
                                <span className={`text-xl font-bold text-foreground`}>
                                    AIM
                                </span>
                            </Link>
                        </div>
                        <p className={`text-muted-foreground mb-4 max-w-md`}>
                            Transforming complex technical documentation into clear, understandable content with the power of AI.
                        </p>
                        <div className="flex space-x-4">
                            <Button variant="ghost" size="icon" className="hover:bg-accent">
                                <Users className={`w-4 h-4 text-muted-foreground hover:text-foreground`} />
                                <span className="sr-only">Social link 1</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-accent">
                                <Clock className={`w-4 h-4 text-muted-foreground hover:text-foreground`} />
                                <span className="sr-only">Social link 2</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-accent">
                                <Shield className={`w-4 h-4 text-muted-foreground hover:text-foreground`} />
                                <span className="sr-only">Social link 3</span>
                            </Button>
                        </div>
                    </div>

                    <div>
                        <h3 className={`text-foreground font-semibold mb-4`}>Product</h3>
                        <ul className="space-y-2">
                            <li>
                                <button
                                    onClick={() => scrollToSection('features')}
                                    className={`text-muted-foreground hover:text-foreground transition-colors cursor-pointer`}
                                >
                                    Features
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => scrollToSection('pricing')}
                                    className={`text-muted-foreground hover:text-foreground transition-colors cursor-pointer`}
                                >
                                    Pricing
                                </button>
                            </li>
                            <li><a href="#" className={`text-muted-foreground hover:text-foreground transition-colors`}>API</a></li>
                            <li><a href="#" className={`text-muted-foreground hover:text-foreground transition-colors`}>Documentation</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className={`text-foreground font-semibold mb-4`}>Company</h3>
                        <ul className="space-y-2">
                            <li>
                                <button
                                    onClick={() => scrollToSection('about')}
                                    className={`text-muted-foreground hover:text-foreground transition-colors cursor-pointer`}
                                >
                                    About
                                </button>
                            </li>
                            <li><a href="#" className={`text-muted-foreground hover:text-foreground transition-colors`}>Blog</a></li>
                            <li><a href="#" className={`text-muted-foreground hover:text-foreground transition-colors`}>Careers</a></li>
                            <li><a href="#" className={`text-muted-foreground hover:text-foreground transition-colors`}>Contact</a></li>
                        </ul>
                    </div>
                </div>

                <div className={`border-t border-border mt-8 pt-8 text-center`}>
                    <p className="text-muted-foreground">
                        © 2025 AIM. All rights reserved. Built with ❤️ for technical professionals.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 