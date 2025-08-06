import { useState, useEffect } from 'react';
import { Brain, Menu, X, ArrowRight, Sun, Moon, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        } else {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDarkMode(prefersDark);
            document.documentElement.classList.toggle('dark', prefersDark);
        }
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    const navigateToLogin = () => {
        navigate('/login');
    };

    const navigateToSignup = () => {
        navigate('/signup');
    };

    const navigateToUserboard = () => {
        navigate('/userboard');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const scrollToSection = (sectionId: string) => {
        setIsMenuOpen(false);
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

    const handleMenuClick = (path: string) => {
        setIsMenuOpen(false);
        navigate(path);
    };

    return (
        <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center space-x-2">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className={`w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center`}>
                                <Brain className="w-6 h-6" />
                            </div>
                            <span className={`text-2xl font-bold text-foreground`}>
                                AIM
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <NavigationMenu className="hidden md:flex">
                        <NavigationMenuList className="space-x-8">
                            <NavigationMenuItem>
                                <button
                                    onClick={() => scrollToSection('features')}
                                    className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                >
                                    Features
                                </button>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <button
                                    onClick={() => scrollToSection('pricing')}
                                    className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                >
                                    Pricing
                                </button>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <button
                                    onClick={() => scrollToSection('about')}
                                    className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                >
                                    About
                                </button>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Button
                                    onClick={toggleTheme}
                                    variant="ghost"
                                    size="icon"
                                    className="w-8 h-8"
                                >
                                    {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                    <span className="sr-only">Toggle Theme</span>
                                </Button>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                {isAuthenticated ? (
                                    <div className="flex items-center space-x-2">
                                        <Button onClick={navigateToUserboard}>Dashboard</Button>
                                        <Button onClick={handleLogout} variant="outline">Logout</Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <Button onClick={navigateToLogin} variant="outline">Login</Button>
                                        <Button onClick={navigateToSignup}>Signup</Button>
                                    </div>
                                )}
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* Mobile Menu */}
                    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                                <Menu className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-background flex flex-col pt-8">
                            <div className="flex flex-col space-y-4 px-4">
                                <button
                                    onClick={() => scrollToSection('features')}
                                    className="text-left text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                >
                                    Features
                                </button>
                                <button
                                    onClick={() => scrollToSection('pricing')}
                                    className="text-left text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                >
                                    Pricing
                                </button>
                                <button
                                    onClick={() => scrollToSection('about')}
                                    className="text-left text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                >
                                    About
                                </button>
                                <Button
                                    onClick={toggleTheme}
                                    variant="ghost"
                                    className="justify-start"
                                >
                                    {isDarkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                                    Toggle Theme
                                </Button>
                                {isAuthenticated ? (
                                    <>
                                        <Button onClick={navigateToUserboard} className="w-full">Dashboard</Button>
                                        <Button onClick={handleLogout} variant="outline" className="w-full">Logout</Button>
                                    </>
                                ) : (
                                    <div className="flex flex-col space-y-2">
                                        <Button onClick={navigateToLogin} variant="outline" className="w-full">Login</Button>
                                        <Button onClick={navigateToSignup} className="w-full">Signup</Button>
                                    </div>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 