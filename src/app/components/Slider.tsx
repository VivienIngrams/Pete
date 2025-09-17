'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { urlForImage } from '~/sanity/lib/sanity.image';

interface SliderProps {
  images: any[];
}

export default function Slider({ images }: SliderProps): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const nextSlide = useCallback((): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const currentImage = images[currentIndex];
  const hotspot = currentImage?.hotspot || { x: 0.5, y: 0.5 }; // Default to center

  const objectPosition = `${hotspot.x * 100}% ${hotspot.y * 100}%`; 

  return (
    <div className="relative w-full h-full">
      <Image
        src={urlForImage(currentImage).url() || ''}
        alt={`Slider Image ${currentIndex + 1}`}
        fill
        className="object-cover transition-all duration-800 ease-in-out"
        style={{
          objectPosition, // Dynamically set based on hotspot
        }}
      />
    </div>
  );
}
