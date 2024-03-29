import React from 'react';
import { Card, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { SubCardProps } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const OfferCard: React.FC<SubCardProps> = ({ title, rating, description, tags, price, imageSrc }) => {


  return (
    <Card className="shadow-xl rounded-lg xl:w-2/3 lg:5/6 overflow-hidden md:flex md:flex-row">
      <CardContent className="flex flex-col justify-between p-4 md:w-2/3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 3L12 6.196l3.951.574-2.856 2.787.674 3.943-3.769-1.981-3.769 1.981.674-3.943L5.049 6.77 9 6.196z" />
              </svg>
            ))}
          </div>
        </div>
        <CardDescription className="text-sm my-4 overflow-hidden line-clamp-3">{description}</CardDescription>
        <CardFooter className="flex md:flex-row justify-between items-center pt-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge key={index} className="px-2 py-1 text-sm">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold">{`+/- ${price}`}</span>
            <Button>See More</Button> {/* Use o componente Button adequado */}
          </div>
        </CardFooter>
      </CardContent>
      <div className="md:w-1/3">
        <img src={imageSrc} alt={title} className="object-cover w-full h-48 md:h-full" />
      </div>
    </Card>
  );
};

export default OfferCard;
