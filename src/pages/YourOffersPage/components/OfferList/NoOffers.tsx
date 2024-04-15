import React from 'react';

interface NoOffersProps {
}

const NoOffers: React.FC<NoOffersProps> = () => {
    return (
        <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
                You have no Offers
            </h3>
            <p className="text-sm text-muted-foreground">
                You can start selling as soon as you add a offer.
            </p>
        </div>
    );
}

export default NoOffers;