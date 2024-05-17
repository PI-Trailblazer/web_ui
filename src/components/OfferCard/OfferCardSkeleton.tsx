import React from 'react';
import { Card, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';

const OfferCardSkeleton: React.FC = () => {


  return (
    <Card className="shadow-xl w-[1200px] animate-pulse rounded-lg md:flex md:flex-row">
      <CardContent className="flex flex-col justify-between p-4 md:w-2/3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 mt-2 mb-4 w-1/3" /> {/* Simula o título */}
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-5 w-5 mr-1" />
            ))}
          </div>
        </div>
        <CardDescription className="text-sm my-4 overflow-hidden">
          <br />
          <Skeleton className="h-4 mb-4 w-full" /> {/* Simula a descrição */}
          <Skeleton className="h-4 mb-4 w-full" /> {/* Simula a descrição */}
          <Skeleton className="h-4 mb-4 w-1/2" /> {/* Simula a descrição */}
        </CardDescription>
        <CardFooter className="flex md:flex-row justify-between items-center pt-4">
          <div className="flex flex-wrap gap-2">
            { Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-6 w-12"/>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-20" /> {/* Simula o preço */}
            <Skeleton className="h-10 w-20" /> {/* Simula o botão */}
          </div>
        </CardFooter>
      </CardContent>
      <div className="md:w-1/3">
        <img src='https://via.placeholder.com/250' className="object-cover w-full md:h-full" />
      </div>
    </Card>
  );
};

export default OfferCardSkeleton;
