import { useState } from 'react';
import { Card, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { OfferDetailsProps } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { encodeId } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { OfferService } from '@/services/Client/OfferService';
import { Trash2, Pencil } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton'
import DeleteOffer from './DeleteOffer';
import config from '@/config';

type OfferCardProps = Partial<OfferDetailsProps> & { showDelete?: boolean; onDelete?: () => void; isPending?: boolean; seeMoreDisabled?: boolean};
  
  const OfferCard: React.FC<OfferCardProps> = ({
    name,
    description,
    max_review_score,
    n_reviews,
    price,
    tags,
    id,
    showDelete = false, // Adicionado nova prop para controlar a exibição do botão de exclusão
    onDelete, // Adicionado novo prop para a função de exclusão
    isPending,
    seeMoreDisabled,
  }: Partial<OfferDetailsProps> & { showDelete?: boolean; onDelete?: () => void; isPending?: boolean; seeMoreDisabled?: boolean }) => {

    const[isOpen, setIsOpen] = useState(false);

    const fetchImages = async (id: number) => {
      return (await OfferService.getImages(id)).data;
    };
  
    const { data: imageData, isLoading } = useQuery({
      queryKey: ['images', id],
      queryFn: () => fetchImages(id),
    });
    
    let rating = 0;
    if (max_review_score !== undefined && n_reviews !== undefined && n_reviews !== 0 && max_review_score !== 0) {
      rating = Math.round(((max_review_score / n_reviews) * 5) / 100);
    }

    return (
      <Card className={`shadow-xl rounded-lg overflow-hidden relative md:flex md:flex-row ${seeMoreDisabled ? 'hover:opacity-60 hover:shadow-2xl cursor-pointer' : ''}`}>
      {showDelete && onDelete && (
        <div>
          <Button
            onClick={() => setIsOpen(true)}
            className="absolute rounded-full top-0 right-0 mt-4 mr-4 px-2"
            title="Delete Offer"
            variant="destructive"
          >
            <Trash2/>
          </Button>
          <Link to={id !== undefined ? `/offer/${encodeId(id)}` : '#'}>
            <Button
              className="absolute rounded-full top-0 right-0 mt-4 mr-16 px-2"
              title="Edit Offer"
            >
              <Pencil/>
            </Button>
          </Link>
          {isOpen && (
            <DeleteOffer isOpen={isOpen} setIsOpen={setIsOpen} onDelete={onDelete} isPending={isPending} />
          )}
        </div>
      )}
      <CardContent className="flex flex-col justify-between p-4 md:w-2/3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">{name}</CardTitle>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`h-5 w-5 drop-shadow-[0px.0px_1.10px_rgba(0,0,0,1)] ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
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
          {tags && tags.length === 0 && (
            <div className="flex flex-wrap gap-2">
              { Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-6 bg-primary rounded-full w-16"/>
              ))}
            </div>
          )}
          {tags && tags.length > 0 && tags.map((tag, index) => (
            <Badge key={index} className="px-2 py-1 text-sm">
              {tag}
            </Badge>
          ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold">{`+/- $${price}`}</span>
            {/* TODO */}
            <Link to={id !== undefined ? `/offer/${encodeId(id)}` : '#'} className={seeMoreDisabled ? 'pointer-events-none' : ''}>
              <Button>See More</Button> 
            </Link>
          </div>
        </CardFooter>
      </CardContent>
      <div className="md:w-1/3">
        {isLoading ? (
          <div className="w-full h-48 bg-gray-200 animate-pulse" />
        ) : ( 
          imageData && imageData.length > 0 ? (
            <img
              src={config.STATIC_URL + imageData[0].image}
              alt={name}
              className="object-cover aspect-square w-full h-48 md:h-full"
            />
          ) : (
            <img
              src={'https://random.imagecdn.app/v1/image?width=500&height=500&category=buildings'}
              alt={name}
              className="object-cover aspect-square w-full h-48 md:h-full"
            />
          )
        )}
      </div>
    </Card>
  );
};

export default OfferCard;
