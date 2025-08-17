import { Brain, FileText, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const FeaturesSection = () => {
    return (
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
    );
};

export default FeaturesSection; 