import { TECarousel, TECarouselItem } from "tw-elements-react";
import { SliderImages } from "../../data/data";

export default function CarouselDynamicVariant(): JSX.Element {
  return (
    <div className="relative mx-auto mt-1 max-w-full rounded-lg bg-white shadow-lg sm:w-full md:w-[90%] lg:w-[80%] xl:w-[1340px]">
      <TECarousel
        showControls={true}
        showIndicators={true}
        ride="carousel"
        prevBtnIcon={
          <span className="inline-block text-black h-8 w-8 [&>svg]:h-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </span>
        }
        nextBtnIcon={
          <span className="inline-block text-black h-8 w-8 [&>svg]:h-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </span>
        }
      >
        <div className="relative w-full overflow-hidden rounded-lg h-[200px] sm:h-[300px] md:h-[400px] after:clear-both after:block after:content-['']">
          {SliderImages.map((slide) => (
            <TECarouselItem
              key={slide.id}
              itemID={slide.id}
              className="relative float-left hidden -mr-[100%] w-full transition-transform duration-[600ms] ease-in-out motion-reduce:transition-none"
            >
              <img
                src={slide.image}
                className="block w-full h-full object-cover rounded-lg"
                alt={slide.label}
              />
              <div className="absolute inset-x-[15%] bottom-5 hidden py-5 text-center text-black md:block">
                <h5 className="text-sm sm:text-base md:text-xl">
                  {slide.label}
                </h5>
                <p className="text-xs sm:text-sm md:text-base">
                  {slide.description}
                </p>
              </div>
            </TECarouselItem>
          ))}
        </div>
      </TECarousel>
    </div>
  );
}
