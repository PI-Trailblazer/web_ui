// components/OfferCard.jsx

import { OfferDetailsProps } from "@/lib/types";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import { encodeId } from '@/lib/utils';
import { Link } from "react-router-dom";
import { OfferService } from '@/services/Client/OfferService';
import { useQuery } from '@tanstack/react-query';
import config from '@/config';
import NoImageAvailable from '@/assets/NoImageAvailable.jpg';



interface OfferCardProps {
  offer: OfferDetailsProps;
}

export function SimilarOffersCard({offer}: OfferCardProps) {

  const fetchImages = async (id: number) => {
    return (await OfferService.getImages(id)).data;
  };

  const { data: imageData, isLoading } = useQuery({
    queryKey: ['images', offer.id],
    queryFn: () => fetchImages(offer.id),
  });

  return (
    <div className="border rounded-lg bg-card shadow-lg overflow-hidden">
      {isLoading ? (
          <div className="w-full aspect-video object-cover" />
      ) : (
        imageData && imageData.length > 0 ? (
          <img
            src={imageData[0].image}
            alt={offer.name}
            className="w-full aspect-video object-cover"
          />
        ) : (
          <img
            src={NoImageAvailable}
            alt={offer.name}
            className="w-full aspect-video object-cover"
          />
        )
      )}
      <div className="p-4">
        <h3 className="text-xl font-bold">{offer.name}</h3>
        <p className="text-sm my-2">{offer.description}</p>
        <div className="flex justify-between items-center my-2">
          <div className="flex gap-2">
            {offer.tags.map((tag, index) => (
              <Badge key={index} className="px-2 py-1 text-sm">{tag}</Badge>
            ))}
          </div>
          <span className="text-lg font-semibold">{`$${offer.price}`}</span>
        </div>
        <Link key={offer.id} to={offer.id !== undefined ? `/offer/${encodeId(offer.id)}` : '#'}>
          <Button className="w-full mt-2">See More</Button>
        </Link>
      </div>
    </div>
  );
};

