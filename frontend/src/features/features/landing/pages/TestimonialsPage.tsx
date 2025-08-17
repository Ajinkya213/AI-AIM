import Navbar from '../components/Navbar';
import TestimonialsSection from '../components/TestimonialsSection';

const TestimonialsPage = () => {
    return (
        <div className={`min-h-screen bg-background text-foreground transition-colors duration-300`}>
            <Navbar />
            <TestimonialsSection />
        </div>
    );
};

export default TestimonialsPage; 