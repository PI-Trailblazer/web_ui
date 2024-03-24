import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button';
import { CardInsideCarouselProps } from '@/lib/types';

const CardInsideCarousel: React.FC<CardInsideCarouselProps> = ({
  title,
  description,
  image,
  rating,
  tags,
}) => {
  return (
    <div className="p-6">
      <Card className='flex border-transparent shadow-lg flex-col items-center'> 
        <CardHeader className="flex justify-center"> 
          <img src={image} alt="Card visual content" className="w-56 object-cover rounded-md" /> 
        </CardHeader>
        <CardContent className="text-center">
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-sm">{description}</p>
          <Button className="mt-4 mb-2 px-4 py-2 transition duration-300">
            See More
          </Button>
        </CardContent>
        <CardFooter className="w-full flex justify-between items-center pt-4">
          <div className="flex items-center">
            {/* Renderizando estrelas baseadas na classificação */}
            {[...Array(rating)].map((_, i) => (
              <svg key={i} className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 15l-5.93 3.1 1.13-6.58-4.8-4.68 6.6-.96L10 .25l2.95 6.01 6.6.96-4.8 4.68 1.13 6.58z" />
              </svg>
            ))}
          </div>
          <div className="flex space-x-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant={'secondary'} className="px-2 py-1 text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CardInsideCarousel;
