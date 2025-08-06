import React, { useState, useEffect } from 'react';
import { ChevronRight, Brain, FileText, Zap, CheckCircle, Menu, X, ArrowRight, Star, Users, Clock, Shield, Sun, Moon } from 'lucide-react';

// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode for initial render consistency

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
    alert('Redirecting to login page...');
    // In a real app, you'd use react-router-dom's useNavigate hook:
    // const navigate = useNavigate();
    // navigate('/login');
  };

  return (
    <div className={`min-h-screen bg-background text-foreground transition-colors duration-300`}>
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className={`w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center`}>
                <Brain className="w-6 h-6" /> {/* Icon color is primary-foreground */}
              </div>
              <span className={`text-2xl font-bold text-foreground`}>
                AIM
              </span>
            </div>

            {/* Desktop Menu */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="space-x-8">
                <NavigationMenuItem>
                  <NavigationMenuLink href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button
                    onClick={toggleTheme}
                    variant="outline"
                    size="icon"
                    className="border-border hover:bg-accent hover:text-accent-foreground"
                  >
                    {isDarkMode ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5 text-primary" />}
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button
                    onClick={navigateToLogin}
                    className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-80 transition-all font-semibold"
                  >
                    Login
                  </Button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Mobile Menu Button */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  {isMenuOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
                  <span className="sr-only">Toggle mobile menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background flex flex-col pt-8">
                <div className="flex flex-col space-y-4 px-4">
                  <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors text-lg">Features</a>
                  <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors text-lg">Pricing</a>
                  <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors text-lg">About</a>
                  <Button
                    onClick={toggleTheme}
                    variant="outline"
                    className="flex items-center justify-center p-2 rounded-lg border-border hover:bg-accent hover:text-accent-foreground"
                  >
                    {isDarkMode ? <Sun className="w-5 h-5 text-primary mr-2" /> : <Moon className="w-5 h-5 text-primary mr-2" />}
                    Toggle Theme
                  </Button>
                  <Button
                    onClick={navigateToLogin}
                    className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-80 w-full font-semibold"
                  >
                    Login
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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
            <Button variant="outline" className={`border-border text-foreground px-8 py-4 text-lg font-semibold transition-all hover:bg-accent hover:text-accent-foreground`}>
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

      {/* Features Section */}
      <section id="features" className={`py-20 px-4 sm:px-6 lg:px-8 bg-muted/20`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold text-foreground mb-4`}>Powerful AI Features</h2>
            <p className={`text-xl text-muted-foreground max-w-2xl mx-auto`}>
              Everything you need to simplify complex technical documentation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card border-border p-8 hover:border-primary transition-all duration-300 group">
              <CardHeader className="p-0 mb-6">
                <div className={`w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <FileText className="w-6 h-6" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <CardTitle className={`text-2xl font-semibold text-foreground mb-4`}>Smart Document Analysis</CardTitle>
                <CardDescription className={`text-muted-foreground leading-relaxed`}>
                  Our AI analyzes complex technical manuals and extracts key information,
                  breaking down jargon into plain language explanations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border p-8 hover:border-primary transition-all duration-300 group">
              <CardHeader className="p-0 mb-6">
                <div className={`w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Brain className="w-6 h-6" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <CardTitle className={`text-2xl font-semibold text-foreground mb-4`}>Diagram Interpretation</CardTitle>
                <CardDescription className={`text-muted-foreground leading-relaxed`}>
                  Advanced computer vision technology interprets technical diagrams and
                  converts them into step-by-step visual guides.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border p-8 hover:border-primary transition-all duration-300 group">
              <CardHeader className="p-0 mb-6">
                <div className={`w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Zap className="w-6 h-6" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <CardTitle className={`text-2xl font-semibold text-foreground mb-4`}>Instant Simplification</CardTitle>
                <CardDescription className={`text-muted-foreground leading-relaxed`}>
                  Get simplified explanations in seconds. No more spending hours trying
                  to understand complex technical documentation.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold text-foreground mb-4`}>Simple Pricing</h2>
            <p className={`text-xl text-muted-foreground max-w-2xl mx-auto`}>
              Choose the plan that fits your needs. No hidden fees, cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <Card className="bg-card border-border rounded-2xl p-8">
              <CardHeader className="text-center mb-8">
                <CardTitle className={`text-2xl font-semibold text-foreground mb-2`}>Starter</CardTitle>
                <div className={`text-4xl font-bold text-foreground mb-2`}>$9<span className={`text-lg text-muted-foreground`}>/month</span></div>
                <CardDescription className={`text-muted-foreground`}>Perfect for individuals</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="space-y-4 mb-8">
                  <li className={`flex items-center text-muted-foreground`}>
                    <CheckCircle className={`w-5 h-5 text-primary mr-3`} />
                    50 documents per month
                  </li>
                  <li className={`flex items-center text-muted-foreground`}>
                    <CheckCircle className={`w-5 h-5 text-primary mr-3`} />
                    Basic AI simplification
                  </li>
                  <li className={`flex items-center text-muted-foreground`}>
                    <CheckCircle className={`w-5 h-5 text-primary mr-3`} />
                    Email support
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="p-0">
                <Button variant="secondary" className={`w-full py-3 rounded-lg border border-border`}>
                  Get Started
                </Button>
              </CardFooter>
            </Card>

            {/* Pro Plan */}
            <Card className={`border-2 border-primary rounded-2xl p-8 relative`}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className={`bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-semibold`}>
                  Most Popular
                </span>
              </div>
              <CardHeader className="text-center mb-8">
                <CardTitle className={`text-2xl font-semibold text-foreground mb-2`}>Pro</CardTitle>
                <div className={`text-4xl font-bold text-foreground mb-2`}>$29<span className={`text-lg text-muted-foreground`}>/month</span></div>
                <CardDescription className={`text-muted-foreground`}>For growing teams</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="space-y-4 mb-8">
                  <li className={`flex items-center text-muted-foreground`}>
                    <CheckCircle className={`w-5 h-5 text-primary mr-3`} />
                    500 documents per month
                  </li>
                  <li className={`flex items-center text-muted-foreground`}>
                    <CheckCircle className={`w-5 h-5 text-primary mr-3`} />
                    Advanced AI features
                  </li>
                  <li className={`flex items-center text-muted-foreground`}>
                    <CheckCircle className={`w-5 h-5 text-primary mr-3`} />
                    Diagram interpretation
                  </li>
                  <li className={`flex items-center text-muted-foreground`}>
                    <CheckCircle className={`w-5 h-5 text-primary mr-3`} />
                    Priority support
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="p-0">
                <Button className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-80 transition-all font-semibold">
                  Get Started
                </Button>
              </CardFooter>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-card border-border rounded-2xl p-8">
              <CardHeader className="text-center mb-8">
                <CardTitle className={`text-2xl font-semibold text-foreground mb-2`}>Enterprise</CardTitle>
                <div className={`text-4xl font-bold text-foreground mb-2`}>$99<span className={`text-lg text-muted-foreground`}>/month</span></div>
                <CardDescription className={`text-muted-foreground`}>For large organizations</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="space-y-4 mb-8">
                  <li className={`flex items-center text-muted-foreground`}>
                    <CheckCircle className={`w-5 h-5 text-primary mr-3`} />
                    Unlimited documents
                  </li>
                  <li className={`flex items-center text-muted-foreground`}>
                    <CheckCircle className={`w-5 h-5 text-primary mr-3`} />
                    Custom AI training
                  </li>
                  <li className={`flex items-center text-muted-foreground`}>
                    <CheckCircle className={`w-5 h-5 text-primary mr-3`} />
                    API access
                  </li>
                  <li className={`flex items-center text-muted-foreground`}>
                    <CheckCircle className={`w-5 h-5 text-primary mr-3`} />
                    24/7 dedicated support
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="p-0">
                <Button variant="secondary" className={`w-full py-3 rounded-lg border border-border`}>
                  Contact Sales
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 bg-muted/20`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold text-foreground mb-4`}>What Our Users Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-card border-border rounded-2xl p-6">
              <CardHeader className="flex flex-row items-center p-0 mb-4">
                <div className={`bg-primary text-primary-foreground w-10 h-10 rounded-full mr-3 flex items-center justify-center`}>
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-foreground font-semibold`}>Sarah Chen</h4>
                  <CardDescription className={`text-muted-foreground text-sm`}>Technical Writer</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground">
                  "AIM has revolutionized how I work with technical documentation. What used to take hours now takes minutes!"
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border rounded-2xl p-6">
              <CardHeader className="flex flex-row items-center p-0 mb-4">
                <div className={`bg-primary text-primary-foreground w-10 h-10 rounded-full mr-3 flex items-center justify-center`}>
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-foreground font-semibold`}>Mike Rodriguez</h4>
                  <CardDescription className={`text-muted-foreground text-sm`}>Engineering Manager</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground">
                  "The diagram interpretation feature is incredible. Our team can finally understand complex schematics instantly."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border rounded-2xl p-6">
              <CardHeader className="flex flex-row items-center p-0 mb-4">
                <div className={`bg-primary text-primary-foreground w-10 h-10 rounded-full mr-3 flex items-center justify-center`}>
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-foreground font-semibold`}>Emma Thompson</h4>
                  <CardDescription className={`text-muted-foreground text-sm`}>Product Manager</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground">
                  "AIM has significantly improved our product documentation process. Highly recommend it!"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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

      {/* Footer */}
      <footer id="about" className={`bg-muted/30 py-12 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className={`w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center`}>
                  <Brain className="w-5 h-5" />
                </div>
                <span className={`text-xl font-bold text-foreground`}>
                  AIM
                </span>
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
                <li><a href="#features" className={`text-muted-foreground hover:text-foreground transition-colors`}>Features</a></li>
                <li><a href="#pricing" className={`text-muted-foreground hover:text-foreground transition-colors`}>Pricing</a></li>
                <li><a href="#" className={`text-muted-foreground hover:text-foreground transition-colors`}>API</a></li>
                <li><a href="#" className={`text-muted-foreground hover:text-foreground transition-colors`}>Documentation</a></li>
              </ul>
            </div>

            <div>
              <h3 className={`text-foreground font-semibold mb-4`}>Company</h3>
              <ul className="space-y-2">
                <li><a href="#about" className={`text-muted-foreground hover:text-foreground transition-colors`}>About</a></li>
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
    </div>
  );
};

export default Landing;