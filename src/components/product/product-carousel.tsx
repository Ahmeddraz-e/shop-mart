"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"

interface ProductCarouselProps {
    images: string[]
    title: string
}

export default function ProductCarousel({ images, title }: ProductCarouselProps) {
    return (
        <Carousel
            plugins={[
                Autoplay({
                    delay: 2000,
                }),
            ]}
            className="w-full max-w-xs md:max-w-full"
        >
            <CarouselContent>
                {images.map((img, index) => (
                    <CarouselItem key={index}>
                        <Image
                            width={1000}
                            height={1000}
                            src={img}
                            alt={title}
                            className='object-cover object-center h-[55vh] w-full'
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    )
}
