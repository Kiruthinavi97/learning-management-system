import { useState } from "react";

import CarouselDiv from "../components/CarouselDiv";
import { celeb } from "../constants/celebData.js";


function Carousel() {
  const [slideNumber, setSlideNumber] = useState(0); // 0-based index

  const handlePrevClick = () => {
    setSlideNumber((curr) => (curr === 0 ? celeb.length - 1 : curr - 1));
  };

  const handleNextClick = () => {
    setSlideNumber((curr) => (curr === celeb.length - 1 ? 0 : curr + 1));
  };

  return (
    <div className="relative">
      <button
        onClick={handlePrevClick}
        className="btn btn-circle absolute z-30 flex justify-center items-center lg:left-5 left-1 top-1/2"
      >
        ❮
      </button>

      <div className="carousel w-full relative">
        {celeb.map((person) => (
          <CarouselDiv
            key={person.id} // ✅ Use unique id instead of index
            {...person}
            totalslide={celeb.length}
            isActive={person.id === slideNumber + 1} // Adjust based on slideNumber
          />
        ))}
      </div>

      <button
        onClick={handleNextClick}
        className="btn btn-circle absolute z-30 flex justify-center items-center lg:right-5 right-1 top-1/2"
      >
        ❯
      </button>
    </div>
  );
}

export default Carousel;
