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
import { Card, CardContent} from '@/components/ui/card';
import SimilarOffersCard from "./components/SimilarOffersCard";
import CommentsSection from "./components/CommentSection/CommentsSection";
import { OfferService } from '@/services/Client/OfferService';
import { useParams } from 'react-router-dom';
import { decodeId } from "@/lib/utils";
import { useQuery } from '@tanstack/react-query';



export default function OfferDetailsPage() {
    const [mainCarouselApi, setMainCarouselApi] = useState<CarouselApi | null>(null);
    const [thumbnailCarouselApi, setThumbnailCarouselApi] = useState<CarouselApi | null>(null); // Para controle do carrossel de thumbnails
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const { id: encodedId } = useParams();
    const id = parseInt(decodeId(encodedId));

    console.log(id);
    
    const getOffer = async (id: number) => {
        return (await OfferService.getOffer(id)).data;
    }

      const { data: offer, isLoading, isError, isSuccess } = useQuery<OfferDetailsProps>({
          queryKey: ['offer', id],
          queryFn: () => getOffer(id),
      })

      useEffect(() => {
            if(isSuccess) {
                console.log(offer);
            if (isError) {
                console.log('Error');
            } 

        }
    }, [offer, isSuccess, isError])


    const similarOffers = [
        // Supondo que você tenha um array de objetos similares ao `offer`
        { ...offer, name: "Offer 1"},
        { ...offer, name: "Offer 2"},
        { ...offer, name: "Offer 3"},
      ];
      

    //funcao para saber a média do score (esta para 100 quero que fique para 5)
    const averageScore = offer ? ((offer.max_review_score / offer.n_reviews) * 5) / 100 : 0;

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

    if (isLoading) return <div>Loading...</div>;
    if (isError || !offer) return <div>Error or no data available.</div>;

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
                        <CommentsSection offerId={offer.id} />
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
                        <div className="flex flex-col space-y-4">
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