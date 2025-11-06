import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import '../src/css/carousel.css'; // Import the custom CSS

interface Slide {
  id: number;
  content: JSX.Element;
}

const Carousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false); // To control auto-slide when user hovers
  const navigate = useNavigate();

  // Define your slides with custom components
  const slides: Slide[] = [
    {
      id: 1,
      content: (
        <div className="flex flex-col items-center justify-center w-full h-full gap-4 p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-2xl">🌤️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Weather Updates</h3>
            <p className="text-gray-600 mb-4">Get real-time weather information for better farming decisions</p>
          </div>
          <button 
            className="btn-primary flex items-center space-x-2" 
            onClick={() => navigate('/weather')}
          >
            <span>Check Weather</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      ),
    },
    {
      id: 2,
      content: (
        <div className="flex flex-col items-center justify-center w-full h-full p-6">
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            <img 
              src='https://static.pib.gov.in/WriteReadData/userfiles/image/image002CIE6.jpg' 
              className="max-h-40 md:max-h-48 w-full object-cover" 
              alt="Agricultural scheme" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="font-bold text-lg">Agricultural Innovation</h3>
              <p className="text-sm opacity-90">Supporting modern farming techniques</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      content: (
        <div className="flex flex-col items-center justify-center w-full h-full gap-4 p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-2xl">🏛️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Government Schemes</h3>
            <p className="text-gray-600 mb-4">Explore latest government initiatives and subsidies for farmers</p>
          </div>
          <button
            className="btn-primary flex items-center space-x-2"
            onClick={() => window.open('https://agriwelfare.gov.in/en/Major', '_blank', 'noopener,noreferrer')}
          >
            <span>View Schemes</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        handleNext();
      }
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [isHovered, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    trackMouse: true,
  });

  return (
    <div
      className="relative w-full h-64 md:h-72 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl flex flex-col justify-center items-center overflow-hidden transition-all duration-300 hover:shadow-2xl border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...handlers}
    >
      <div className="w-full h-full flex items-center justify-center transition-all duration-500 relative z-10">
        <div className="animate-fadeIn">
          {slides[currentIndex].content}
        </div>
      </div>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-white/80 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-300 ${index === currentIndex ? 'bg-green-500 scale-125 shadow-lg' : 'bg-gray-300 hover:bg-green-200'}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
        <div 
          className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / slides.length) * 100}%` }}
        />
      </div>
      {/* Navigation arrows (optional, uncomment if needed) */}
      {/*
      <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-green-100 rounded-full p-2 shadow transition-all duration-200">
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-green-100 rounded-full p-2 shadow transition-all duration-200">
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
      */}
    </div>
  );
};

export default Carousel;
