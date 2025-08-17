import Navbar from '../components/Navbar';
import FeaturesSection from '../components/FeaturesSection';

const FeaturesPage = () => {
    return (
        <div className={`min-h-screen bg-background text-foreground transition-colors duration-300`}>
            <Navbar />
            <FeaturesSection />
        </div>
    );
};

export default FeaturesPage; 