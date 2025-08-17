import { CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PricingSection = () => {
    return (
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
    );
};

export default PricingSection; 