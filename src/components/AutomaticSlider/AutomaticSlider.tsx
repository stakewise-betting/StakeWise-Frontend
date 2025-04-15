import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface SlideProps {
  src: string;
  alt: string;
}

interface AutoSliderProps {
  slides?: SlideProps[];
  interval?: number;
  height?: number;
}

// Default slides if none are provided via props
const defaultSlides = [
    { src: "/sliderImages/slider-img (1).jpg", alt: "Slider Image 1" },
    { src: "/sliderImages/slider-img (2).jpg", alt: "Slider Image 2" },
    { src: "/sliderImages/slider-img (3).jpg", alt: "Slider Image 3" },
    { src: "/sliderImages/slider-img (4).jpg", alt: "Slider Image 4" },
];

const AutoSlider = ({ slides = defaultSlides, interval = 5000, height = 400 }: AutoSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      if (!isHovering) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }
    }, interval);
  };

  useEffect(() => {
    startTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isHovering, interval, slides.length]);

  // const goToPrevious = () => {
  //   setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  //   startTimer();
  // };

  // const goToNext = () => {
  //   setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  //   startTimer();
  // };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    startTimer();
  };

  if (isMobile) {
    return null;
  }

  return (
    <div
      className="relative max-w-[1536px] w-full mx-auto overflow-hidden"
      style={{ height: `${height}px` }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full h-full flex-shrink-0">
            <img
              src={slide.src}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-all duration-200"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-all duration-200"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button> */}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-200",
              currentIndex === index ? "bg-white scale-110" : "bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default AutoSlider;