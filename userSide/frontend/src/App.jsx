import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import PopularDishes from "./components/PopularDishes";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";

function App() {
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = () => {
    setCartCount((count) => count + 1);
  };

  return (
    <div className="min-h-screen bg-cream font-sans text-dark">
      <Navbar cartCount={cartCount} />
      <main>
        <Hero />
        <Features />
        <PopularDishes onAddToCart={handleAddToCart} />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}

export default App;
