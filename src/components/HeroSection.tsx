import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// Import images from src/assets/
import heroImage1 from "../assets/hero-image.jpg";
import heroImage2 from "../assets/hero-image2.jpg";
import heroImage3 from "../assets/hero-image3.jpg";
import heroImage4 from "../assets/hero-image4.jpg";

// Hero background images - people wearing hoodies and t-shirts
const heroBackgrounds = [
  heroImage1,
  heroImage2,
  heroImage3,
  heroImage4,
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Pagination function with animation lock
  const paginate = useCallback((newDirection: number) => {
    // Prevent double clicks during animation
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection(newDirection);
    setCurrentSlide((prev) => {
      const next = prev + newDirection;
      if (next < 0) return heroBackgrounds.length - 1;
      if (next >= heroBackgrounds.length) return 0;
      return next;
    });

    // Allow new animations after transition completes
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, 800); // Match with transition duration
  }, [isAnimating]);

  // Jump to specific slide
  const jumpToSlide = useCallback((index: number) => {
    if (isAnimating || index === currentSlide) return;
    
    setIsAnimating(true);
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  }, [currentSlide, isAnimating]);

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setDirection(1);
        setCurrentSlide((prev) => (prev + 1) % heroBackgrounds.length);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0"
          >
            <img
              src={heroBackgrounds[currentSlide]}
              alt={`Hero slide ${currentSlide + 1}`}
              className="w-full h-full object-cover object-center"
              loading="lazy"
              onError={(e) => {
                console.error("Failed to load image:", heroBackgrounds[currentSlide]);
              }}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/50 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent z-10 pointer-events-none" />
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => paginate(-1)}
        disabled={isAnimating}
        className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/20 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground hover:bg-background/40 hover:border-primary/50 transition-all duration-300 group ${
          isAnimating ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 group-hover:text-primary transition-colors" />
      </button>

      <button
        onClick={() => paginate(1)}
        disabled={isAnimating}
        className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/20 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground hover:bg-background/40 hover:border-primary/50 transition-all duration-300 group ${
          isAnimating ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 group-hover:text-primary transition-colors" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroBackgrounds.map((_, index) => (
          <button
            key={index}
            onClick={() => jumpToSlide(index)}
            disabled={isAnimating}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? "w-8 bg-primary"
                : "bg-muted-foreground/50 hover:bg-muted-foreground"
            } ${isAnimating ? 'cursor-not-allowed' : ''}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-2 bg-primary/20 border border-primary/50 rounded-full text-primary text-sm font-medium mb-6">
              New Collection 2026
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-display text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-6"
          >
            Wear Your
            <br />
            <span className="text-gradient">Story</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg text-muted-foreground mb-8 max-w-md"
          >
            Bold streetwear inspired by anime culture, movie quotes, and aesthetic typography. Express yourself differently.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/collections" className="btn-neon inline-flex items-center justify-center gap-2">
              Shop Collection
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/about"
              className="btn-neon-outline inline-flex items-center justify-center gap-2"
            >
              Our Story
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-10 right-10 hidden lg:block z-20"
      >
        <div className="flex items-center gap-3 glass px-4 py-3 rounded-xl border border-border">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          <span className="text-sm text-muted-foreground">2.5K+ Happy Customers</span>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;