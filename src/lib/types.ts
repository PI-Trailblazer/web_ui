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
    price: string;
    imageSrc: string;
  }