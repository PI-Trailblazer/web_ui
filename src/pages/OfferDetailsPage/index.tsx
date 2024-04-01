import { OfferDetailsProps, Review } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from 'lucide-react';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
  } from "@/components/ui/carousel"
import { useState, useEffect } from 'react';
import { type CarouselApi } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Card, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import SimilarOffersCard from "./components/SimilarOffersCard";


export default function OfferDetailsPage() {
    const [mainCarouselApi, setMainCarouselApi] = useState<CarouselApi | null>(null);
    const [thumbnailCarouselApi, setThumbnailCarouselApi] = useState<CarouselApi | null>(null); // Para controle do carrossel de thumbnails
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    
    const offer: OfferDetailsProps = {
        name: "Nome da Oferta",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        street: "Rua da Oferta",
        city: "Cidade",
        postal_code: "Código Postal",
        price: "299",
        max_review_score: 432,
        nr_reviews: 5,
        discount: 0, // Supondo que seja uma porcentagem
        tags: ["Tag1", "Tag2", "Tag3"],
        max_quantity: 10,
        modules: [] // Supondo que sejam dados adicionais relacionados à oferta
    };

    const similarOffers = [
        // Supondo que você tenha um array de objetos similares ao `offer`
        { ...offer, name: "Offer 1"},
        { ...offer, name: "Offer 2"},
        { ...offer, name: "Offer 3"},
      ];
      

    //funcao para saber a média do score (esta para 100 quero que fique para 5)
    const averageScore = ((offer.max_review_score / offer.nr_reviews)*5)/100;


    const reviews: Review[] = [
        { id: 1, user: 'John Doe', score: 5, comment: 'Great offer!' },
        { id: 2, user: 'Jane Doe', score: 4, comment: 'Really enjoyed this.' },
        { id: 3, user: 'Alice', score: 3, comment: 'Good offer.' },
        { id: 4, user: 'Bob', score: 2, comment: 'Could be better.' },
    ];

    const generateQuantityOptions = (maxQuantity: number) => {
        return Array.from({ length: maxQuantity }, (_, i) => i + 1);
    };

    const onThumbnailClick = (index: number) => {
        if (mainCarouselApi) {
          mainCarouselApi.scrollTo(index);
        }
        setSelectedIndex(index);
      };

    // Efeito para mudar o slide do carrossel principal quando o selectedIndex muda
    useEffect(() => {
        if (thumbnailCarouselApi && mainCarouselApi) {
          thumbnailCarouselApi.scrollTo(selectedIndex);
        }
      }, [selectedIndex, thumbnailCarouselApi, mainCarouselApi]);

    return (
        <div className="container pt-24">
            <div className="flex flex-col lg:flex-row">
                {/* Parte Esquerda - Título, Tags, Carousel, Descrição e Reviews */}
                <div className="lg:w-3/5 space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold">{offer.name}</h1>
                            <div className="flex space-x-2">
                                {offer.tags.map((tag, index) => (
                                    <Badge key={index} className="px-3 py-1 border text-sm">{tag}</Badge>
                                ))}
                            </div>
                        </div>
                        <div>
                            <Button className="text-md">
                                <span className="pr-1"><Pencil></Pencil></span>    
                                Edit Page
                            </Button>
                        </div>
                    </div>
                    <div className="relative">
                        <Carousel setApi={setMainCarouselApi} className="w-full">
                            <CarouselContent>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <CarouselItem key={index} className="w-full">
                                        <Card className="h-full">
                                            <CardContent className="flex aspect-video items-center justify-center">
                                                <span className="text-4xl font-semibold">{index + 1}</span>
                                            </CardContent>
                                        </Card>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                    </div>

                    {/* Parte inferior com carrossel de thumbnails */}
                    <div className="flex justify-center">
                        <Carousel setApi={setThumbnailCarouselApi} className="w-full" plugins={[Autoplay({
                            delay: 5000, 
                            stopOnInteraction: false,
                            stopOnMouseEnter: true,
                            }),
                        ]}
                        opts={{
                            loop:true,
                        }}
                        > {/* Ajuste a altura aqui */}
                            <CarouselContent>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4 cursor-pointer" onClick={() => onThumbnailClick(index)}>
                                        <Card>
                                            <CardContent className="flex aspect-video items-center justify-center p-6">
                                                <span className="text-3xl font-semibold">{index + 1}</span>
                                            </CardContent>
                                        </Card>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="absolute left-3 z-10" /> {/* Posicionamento absoluto do botão anterior */}
                            <CarouselNext className="absolute right-3 z-10" /> {/* Posicionamento absoluto do botão seguinte */}
                        </Carousel>
                    </div>
                    <div className="border p-4 rounded-lg shadow-xl">
                        {/* Description */}
                        <h2 className="text-2xl font-semibold">Description</h2>
                        <p className="mt-2 text-lg">{offer.description}</p>
                    </div>
                    <div className="border p-4 rounded-lg shadow-xl">
                        {/* Reviews */}
                        <h2 className="text-2xl font-semibold">Reviews <span>({offer.nr_reviews})</span></h2>
                        {reviews.length > 0 ? (
                            <div className="mt-4 space-y-4">
                                {reviews.map((review) => (
                                    <div key={review.id} className="border rounded-lg p-4">                                        <div className="flex justify-between items-center">
                                            <div className="font-semibold text-primary">{review.user}</div>
                                            <div className="text-sm font-semibold text-secondary">Rating: 
                                                <span>
                                                    {Array.from({ length: review.score }).map((_, index) => (
                                                        <span key={index} className="text-yellow-400">★</span>
                                                    ))}                                                    
                                                </span>
                                            </div>
                                        </div>
                                        <p className="mt-2">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-4">No reviews yet.</p>
                        )}
                    </div>
                </div>
                {/* Parte Direita - Preço, Opções de Quantidade e Botão de Compra */}
                <div className="lg:w-2/5 lg:pl-10 pt-2 space-y-6">
                    <div className="space-y-3 border rounded-lg p-4">
                        <div className="space-y-2">
                            {/* Offer Details */}
                            <h2 className="text-2xl font-semibold">Offer Details</h2>
                            <div className="space-y-1">
                                <div className="flex items-center">
                                    <p className="font-semibold">City:</p>
                                    <p className="ml-2">{offer.city}</p>
                                </div>
                                <div className="flex items-center">
                                    <p className="font-semibold">Postal Code:</p>
                                    <p className="ml-2">{offer.postal_code}</p>
                                </div>
                                <div className="flex items-center">
                                    <p className="font-semibold">Street:</p>
                                    <p className="ml-2">{offer.street}</p>
                                </div>
                                <div className="flex items-center">
                                    <p className="font-semibold">Average Rating:</p>
                                    <p className="ml-2">{averageScore.toFixed(2)}/5</p>
                                    <div className="flex ml-2">
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <span key={i} className={`inline-block ${i < Math.round(averageScore) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-lg shadow-lg flex flex-col space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-semibold">Price</h2>
                                <span className="text-2xl font-semibold text-primary">{`$${offer.price}`}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <Select>
                                <SelectTrigger className="border rounded w-2/3 p-2 text-gray-700">
                                    <SelectValue placeholder="Select Quantity" />
                                </SelectTrigger>
                                <SelectContent className="mt-1">
                                    {generateQuantityOptions(offer.max_quantity).map((quantity) => (
                                    <SelectItem key={quantity} value={quantity.toString()} className="hover:bg-gray-100">
                                        {quantity}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                                <Button className="rounded px-6 py-2 transition duration-300 ease-in-out">
                                PURCHASE
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="similar-offers p-4 border rounded-lg space-y-4">
                        <h2 className="text-2xl font-semibold">Similar Offers</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {similarOffers.map((similarOffer, index) => (
                            <SimilarOffersCard key={index} offer={similarOffer} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}