import { OfferDetailsProps} from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel"
import { useState, useEffect } from 'react';
import { type CarouselApi } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import { Card, CardContent} from '@/components/ui/card';
import CommentsSection from "./components/CommentSection/CommentsSection";
import { OfferService } from '@/services/Client/OfferService';
import { useParams } from 'react-router-dom';
import { decodeId } from "@/lib/utils";
import { useQuery } from '@tanstack/react-query';
import CommentInput from "./components/CommentSection/CommentInput";
import { Input } from '@/components/ui/input';
import {Form, FormControl, FormField, FormItem, FormMessage} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from "@/stores/useUserStore";
import { EditOfferForm } from "./components/EditOfferForm";
import { Dialog, DialogContent} from '@/components/ui/dialog';
import { SimilarOffersList } from "./components/SimilarOffersList";
import { useToast } from "@/components/ui/use-toast";
import { BuyOfferDialog } from "./components/BuyOfferDialog";

import config from "@/config";

const addImageSchema = z.object({
    file: z.any(),
    // .refine(files => {return Array.from(files).every(file => file instanceof File)}, { message: "Expected a file" })
});

export default function OfferDetailsPage() {
    const [mainCarouselApi, setMainCarouselApi] = useState<CarouselApi | null>(null);
    const [thumbnailCarouselApi, setThumbnailCarouselApi] = useState<CarouselApi | null>(null); // Para controle do carrossel de thumbnails
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const { id: encodedId } = useParams();
    const id = parseInt(decodeId(encodedId));
    const [editMode, setEditMode] = useState(false); 
    const [editImages, setEditImages] = useState(false);
    const [editDetails, setEditDetails] = useState(false);
    const [averageScore, setAverageScore] = useState<number>(0);
    const [isBuyOfferOpen, setIsBuyOfferOpen] = useState(false);
    const [quantitySelected, setQuantitySelected] = useState<number>(1);
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { sub } = useUserStore();

    const handleBuyOffer = () => {
        setIsBuyOfferOpen(!isBuyOfferOpen);
    }
    
    const getOffer = async (id: number) => {
        return (await OfferService.getOffer(id)).data;
    }

    const { data: offer, isLoading, isError, isSuccess } = useQuery<OfferDetailsProps>({
        queryKey: ['offer', id],
        queryFn: () => getOffer(id),
    })

    const form = useForm<z.infer<typeof addImageSchema>>({
        resolver: zodResolver(addImageSchema),
    });

    const fileRef = form.register('file')

    const addImage = async (data: z.infer<typeof addImageSchema>) => {
        
        const formData = new FormData();
        formData.append('file', data.file[0] as File);
        console.log('Data:', data);
        console.log('Form Data:', formData);
        const response = await OfferService.addImage(formData, id);
        return response.data;
    }

    const addImageMutation = useMutation({
        mutationFn: addImage,
        onSuccess: (data: any) => {
            form.reset();
            console.log('Image added successfully:', data);
            toast({
                variant: 'success',
                title: 'Image added',
                description: 'Your image has been added successfully',
            });
            queryClient.invalidateQueries({ queryKey: ['images'] });
        },
        onError: (error) => {
            toast({
                variant: 'destructive',
                title: 'Image not added',
                description: 'Error adding image',
            });
            console.error('Error adding image:', error);
        }
    });

    const handleAddImage = async (data: { file?: File }) => {
        if (data.file) {
            await addImageMutation.mutateAsync({ file: data.file });
        } else {
            console.error("No file provided");
        }
    }

    const handleGetImages = async () => {
        return (await OfferService.getImages(id)).data;
    }

    const { data: imagesData } = useQuery({
        queryKey: ['images', id],
        queryFn: handleGetImages,
    });

    console.log('Images:', imagesData);
    
    useEffect(() => {
         setAverageScore(offer && offer.n_reviews !== 0 ? ((offer.max_review_score / offer.n_reviews) * 5) / 100 : 0);
    }, [offer]);

    // Função para gerar as opções de quantidade

    const generateQuantityOptions = (maxQuantity: number) => {
        return Array.from({ length: maxQuantity }, (_, i) => i + 1);
    };

    // Efeito para mudar o slide do carrossel principal quando o selectedIndex muda

    const onThumbnailClick = (index: number) => {
        if (mainCarouselApi) {
          mainCarouselApi.scrollTo(index);
        }
        setSelectedIndex(index);
      };

    
    useEffect(() => {
        if (thumbnailCarouselApi && mainCarouselApi) {
          thumbnailCarouselApi.scrollTo(selectedIndex);
        }
      }, [selectedIndex, thumbnailCarouselApi, mainCarouselApi]);

    // Paginas de carregamento e erro

    if (isLoading) return <div>Loading...</div>;
    if (isError || !offer) return <div>Error or no data available.</div>;

    //Switches para controle de edição de imagens e detalhes

    const toggleEditImages = () => {
        setEditImages(!editImages);
        setEditMode(!editMode);
    }

    const toggleEditDetails = () => {
        setEditDetails(!editDetails);
        setEditMode(!editMode);
    }

    const toggleEdit = () => {
        setEditMode(!editMode);
    };

    return (
        <div className="container pt-24">
            <div className="flex flex-col lg:flex-row">
                {/* Parte Esquerda - Título, Tags, Carousel, Descrição e Reviews */}
                <div className="lg:w-3/5 space-y-6 m-1">
                    <div className="flex justify-between items-center">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold">{offer.name}</h1>
                            <div className="flex space-x-2">
                                {offer.tags.map((tag, index) => (
                                    <Badge key={index} className="px-3 py-1 border text-sm">{tag}</Badge>
                                ))}
                            </div>
                        </div>
                        {sub === offer.userid && (
                            <div>
                                {!editMode && !editImages && !editDetails && (
                                    <Button className="text-md" onClick={toggleEdit}>
                                        <span className="pr-1"><Pencil></Pencil></span>
                                        Edit Offer
                                    </Button>
                                )}
                                {editMode && (
                                    <div className="flex space-x-4">
                                        <Button onClick={toggleEditDetails}>Edit Details</Button>
                                        <Button onClick={toggleEditImages}>Edit Images</Button>
                                        <Button variant={'outline'} onClick={() => setEditMode(false)}>Back</Button>
                                    </div>
                                )}
                                {editImages && (
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(handleAddImage)} className="flex items-center space-x-3">
                                            <FormField
                                                control={form.control}
                                                name="file"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input type="file" accept="image/*" {...fileRef} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="submit">
                                                Submit
                                            </Button>
                                            <Button variant={"outline"} type="button" onClick={toggleEditImages}>
                                                Back
                                            </Button>
                                        </form>
                                    </Form>
                                )}
                                {editDetails && (
                                    <Dialog open={editDetails} onOpenChange={toggleEditDetails}>
                                        <DialogContent>
                                            <EditOfferForm toggleEditDetails={toggleEditDetails} offer={offer} />
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <Carousel setApi={setMainCarouselApi} className="w-full">
                            <CarouselContent>
                                { (imagesData && imagesData.length > 0) ? (
                                    Array.from({ length: imagesData.length }).map((_, index) => (
                                        <CarouselItem key={index} className="w-full">
                                            <Card className="h-[29rem] overflow-hidden">
                                                <img className="object-fits h-full w-full" src={config.STATIC_URL+imagesData[index].image} alt="offer" />
                                            </Card>
                                        </CarouselItem>
                                    ))
                                ) : (
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <CarouselItem key={index} className="w-full">
                                            <Card className="h-full">
                                                <CardContent className="flex aspect-video items-center justify-center">
                                                    <span className="text-4xl font-semibold">{index + 1}</span>
                                                </CardContent>
                                            </Card>
                                        </CarouselItem>
                                    ))

                                )}
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
                                { (imagesData && imagesData.length > 0) ? (
                                    Array.from({ length: imagesData.length }).map((_, index) => (
                                        <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4 cursor-pointer" onClick={() => onThumbnailClick(index)}>
                                            <Card className="h-28 overflow-hidden">
                                                <img className="object-fits h-full w-full" src={config.STATIC_URL + imagesData[index].image} alt="offer" />
                                            </Card>
                                        </CarouselItem>
                                    ))
                                ) : (
                                 Array.from({ length: 5 }).map((_, index) => (
                                    <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4 cursor-pointer" onClick={() => onThumbnailClick(index)}>
                                        <Card className="h-full">
                                            <CardContent className="flex aspect-video items-center justify-center p-6">
                                                <span className="text-4xl font-semibold">{index + 1}</span>
                                            </CardContent>
                                        </Card>
                                    </CarouselItem>
                                ))  
                                )
                            }
                            </CarouselContent>
                            <CarouselPrevious className="absolute left-3 z-10" /> {/* Posicionamento absoluto do botão anterior */}
                            <CarouselNext className="absolute right-3 z-10" /> {/* Posicionamento absoluto do botão seguinte */}
                        </Carousel>
                    </div>
                    <div className="border p-4 bg-card rounded-lg shadow-xl">
                        {/* Description */}
                        <h2 className="text-2xl font-semibold">Description</h2>
                        <p className="mt-2 text-lg">{offer.description}</p>
                    </div>
                    <div className="border p-4 bg-card rounded-lg shadow-xl">
                        {/* Reviews */}
                        <CommentInput offerId={offer.id} />
                        <CommentsSection offerId={offer.id} />
                    </div>
                </div>
                {/* Parte Direita - Preço, Opções de Quantidade e Botão de Compra */}
                <div className="lg:w-2/5 lg:pl-10 pt-2 space-y-6">
                    <div className="space-y-3 border bg-card rounded-lg p-4">
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
                                    <p className="ml-2">{averageScore}/5</p>
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
                                <Select onValueChange={(value) => setQuantitySelected(parseInt(value))}>
                                <SelectTrigger className="border rounded w-2/3 p-2 text-gray-700">
                                    <SelectValue placeholder="Select Quantity" />
                                </SelectTrigger>
                                <SelectContent className="mt-1">
                                    {generateQuantityOptions(offer.max_quantity).map((quantity) => (
                                    <SelectItem key={quantity} value={quantity.toString()}>
                                        {quantity}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                                <Button className="rounded px-6 py-2 transition duration-300 ease-in-out" onClick={handleBuyOffer}>
                                PURCHASE
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="similar-offers bg-card p-4 border rounded-lg space-y-4">
                        <h2 className="text-2xl font-semibold">Similar Offers</h2>
                        <SimilarOffersList offerTags={offer.tags} offerId={offer.id} />
                    </div>
                </div>
            </div>
            <BuyOfferDialog toggleOpenBuyOfferDialog={handleBuyOffer} isOpenBuyOfferDialog={isBuyOfferOpen} offerId={offer.id} quantitySelected={quantitySelected} />
        </div>
    );
}