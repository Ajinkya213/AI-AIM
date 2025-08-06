import Navbar from '../components/Navbar';
import PricingSection from '../components/PricingSection';

const PricingPage = () => {
    return (
        <div className={`min-h-screen bg-background text-foreground transition-colors duration-300`}>
            <Navbar />
            <PricingSection />
        </div>
    );
};

export default PricingPage; 