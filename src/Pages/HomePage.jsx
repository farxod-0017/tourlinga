import Advantages from "../components/Advantages";
import FeaturesSection from "../components/FeaturesSection";
import Hero from "../components/Hero";
import News from "../components/News";
import UsingWeb from "../components/UsingWeb";

export default function HomePage() {
    
    return (
        <div className="homePage">
            <Hero/>
            <FeaturesSection/>
            <Advantages/>
            <UsingWeb/>
            <News/>
        </div>
    )
}