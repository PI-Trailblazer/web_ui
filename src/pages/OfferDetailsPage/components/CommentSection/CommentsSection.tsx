import React, { useState, useEffect } from 'react';
import { Review } from "@/lib/types";
import { useQuery } from '@tanstack/react-query';

import Comment from './Comment';
import { Input } from '@/components/Input';
import { Avatar } from '@/components/ui/avatar';
import { OfferService } from '@/services/Client/OfferService';

const CommentsSection = ({ offerId } : { offerId: number }) => {

    const fetchReviews = async (offerId: number) => {
        return (await OfferService.getReviews(offerId)).data; // Assumindo que você tem um método adequado
    };

    const { data: reviews, isLoading, isError, isSuccess } = useQuery<Review[]>({
        queryKey: ['reviews', offerId],
        queryFn: () => fetchReviews(offerId),
    });

    useEffect(() => {
        if (isSuccess) {
            console.log('Reviews loaded successfully:', reviews);
        }
    }, [isSuccess, reviews]);

    if (isLoading) return <div>Loading reviews...</div>;
    if (isError || !reviews) return <div>Error loading reviews or no reviews found.</div>;

    return (
        <div className="border p-4 rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold">Reviews <span>({reviews.length})</span></h2>
            {reviews.length > 0 && isSuccess ? (
                <div className="mt-4 space-y-4">
                    {reviews.map((review: Review) => (
                        <Comment key={review.id} review={review} offerId={offerId} userId={review.userid} />
                    ))}
                </div>
            ) : (
                <p>No reviews yet.</p>
            )}
        </div>
    );
};

export default CommentsSection;
