// components/OfferCard.jsx

import React from 'react';
import { OfferDetailsProps } from "@/lib/types";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";

interface OfferCardProps {
  offer: OfferDetailsProps;
}

export function SimilarOffersCard({offer}: OfferCardProps) {

  let rating = 0;
  if (offer.max_review_score !== undefined && offer.n_reviews !== undefined && offer.n_reviews !== 0 && offer.max_review_score !== 0) {
    rating = Math.round(((offer.max_review_score / offer.n_reviews) * 5) / 100);
  }

  return (
    <div className="border rounded-lg bg-card shadow-lg overflow-hidden">
      <img src={'https://via.placeholder.com/400'} alt={offer.name} className="w-full aspect-video object-cover" />
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
        <Button className="w-full mt-2">See More</Button>
      </div>
    </div>
  );
};

