export interface CardInsideCarouselProps {
    title: string;
    description: string;
    image: string;
    rating: number; // Supondo que você passará um número para as estrelas
    tags: string[];
}

export interface SubCardProps {
    title: string;
    rating: number;
    description: string;
    tags: string[];
    price: number;
    imageSrc: string;
  }

export interface OfferDetailsProps {
    name: string;
    description: string;
    street: string;
    city: string;
    postal_code: string;
    price: number;
    max_review_score: number;
    n_reviews: number;
    discount: number;
    tags: string[];
    max_quantity: number;
    modules: any[];
    id: number;
    userid: string;
}

export interface Review {
    id: number;
    offerId: number;
    userid: string;            
    score: number;
    comment: string;
}

export interface UserResponse {
    l_name: string;
    uid: string;
    roles: string[];
    tags: string[];
    email: string;
    f_name: string;
    phone_number: string;
    verified: boolean;
    image: string;
}

export interface Payment{
    userid: string;
    offer_id: number;
    quantity: number;
    amount: number;
    status: string;
    nationality: string;
    id: number;
    timestamp: string;
}