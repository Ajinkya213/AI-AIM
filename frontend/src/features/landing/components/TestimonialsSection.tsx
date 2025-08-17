import { Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const TestimonialsSection = () => {
    return (
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
    );
};

export default TestimonialsSection; 