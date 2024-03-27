import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const OfferCardSkeleton: React.FC = () => {
  return (
    <Card className="animate-pulse shadow-xl rounded-lg xl:w-2/3 lg:5/6 overflow-hidden md:flex md:flex-row">
      <CardContent className="flex flex-col justify-between p-4 md:w-2/3">
        <div className="flex justify-between items-center">
            <Skeleton className="h-6 mb-4 w-1/2" /> {/* Simula o título */}
            <div className="flex items-center gap-4">
                {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-4" /> // Simula as estrelas
                ))}
            </div>
        </div>
        <Skeleton className="h-4 my-4 w-full" /> {/* Simula a descrição */}
        <Skeleton className="h-4 my-4 w-full" /> {/* Simula a descrição adicional */}
        <Skeleton className="h-4 my-4 w-1/3" />
        <CardFooter className="flex md:flex-row justify-between items-center pt-4">
          <div className="flex flex-wrap gap-2">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="h-6 w-16" /> // Simula as tags
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-16" /> {/* Simula o preço */}
            <Skeleton className="h-10 w-24" /> {/* Simula o botão "See More" */}
          </div>
        </CardFooter>
      </CardContent>
      <div className="md:w-1/3">
        <Skeleton className="object-cover w-full h-48 md:h-full" />
      </div>
    </Card>
  );
};

export default OfferCardSkeleton;
