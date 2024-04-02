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
}

export interface Review {
    id: number;
    user: string;            //userId: number; mudar depois quando tiver a chamada da API
    score: number;
    comment: string;
}