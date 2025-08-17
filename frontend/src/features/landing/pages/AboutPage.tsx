import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutPage = () => {
    return (
        <div className={`min-h-screen bg-background text-foreground transition-colors duration-300`}>
            <Navbar />
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-foreground mb-8">About AIM</h1>
                    <div className="prose prose-lg text-muted-foreground">
                        <p className="mb-6">
                            AIM is a revolutionary AI-powered platform designed to transform complex technical documentation
                            into clear, understandable content. Our mission is to bridge the gap between complex technical
                            information and practical understanding.
                        </p>
                        <p className="mb-6">
                            Founded by a team of engineers and technical writers who experienced firsthand the challenges
                            of deciphering complex manuals and diagrams, AIM was born from the need to make technical
                            information accessible to everyone.
                        </p>
                        <p className="mb-6">
                            Our advanced AI technology combines natural language processing with computer vision to
                            analyze and simplify technical documents, diagrams, and schematics. Whether you're a
                            technical writer, engineer, or business professional, AIM helps you understand complex
                            information quickly and efficiently.
                        </p>
                        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Our Mission</h2>
                        <p className="mb-6">
                            To democratize access to technical knowledge by making complex documentation simple,
                            clear, and actionable for professionals across all industries.
                        </p>
                        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Our Vision</h2>
                        <p className="mb-6">
                            A world where no one struggles to understand technical documentation, where complex
                            information becomes accessible to everyone, and where productivity is enhanced through
                            AI-powered simplification.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AboutPage; 