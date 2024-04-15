import React from 'react';
import { Card, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { OfferDetailsProps } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { encodeId } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { query } from 'firebase/firestore';
import { OfferService } from '@/services/Client/OfferService';


const OfferCard: React.FC<Partial<OfferDetailsProps>> = ({ name, description, max_review_score, n_reviews, price,tags, id}: Partial<OfferDetailsProps>) => {

  const fetchImages = async (id: number) => {
    return (await OfferService.getImages(id)).data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['images'],
    queryFn: () => fetchImages(id),
  });

  let rating = 0;
  if (max_review_score !== undefined && n_reviews !== undefined && n_reviews !== 0 && max_review_score !== 0) {
    rating = Math.floor(((max_review_score / n_reviews) * 5) / 100);
  }
  const imageSrc = data?.[0]?.url ?? 'https://random.imagecdn.app/v1/image?width=500&height=500&category=buildings';
  console.log(data);
  
  return (
    <Card className="shadow-xl rounded-lg overflow-hidden md:flex md:flex-row">
      <CardContent className="flex flex-col justify-between p-4 md:w-2/3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">{name}</CardTitle>
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
          {tags && tags.map((tag, index) => (
            <Badge key={index} className="px-2 py-1 text-sm">
              {tag}
            </Badge>
          ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold">{`+/- $${price}`}</span>
            {/* TODO */}
            <Link to={id !== undefined ? `/offer/${encodeId(id)}` : '#'}>
              <Button>See More</Button> 
            </Link>
          </div>
        </CardFooter>
      </CardContent>
      <div className="md:w-1/3">
        <img src={imageSrc} alt={name} className="object-cover aspect-square w-full h-48 md:h-full" />
      </div>
    </Card>
  );
};

export default OfferCard;
