import { Button } from '@/components/ui/button'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import Autoplay from 'embla-carousel-autoplay'
import { useEffect, useRef, useState } from 'react'
import OfferCard from '@/components/OfferCard/OfferCard'
import OfferCardSkeleton from '@/components/OfferCard/OfferCardSkeleton'
import { OfferDetailsProps } from '@/lib/types'
import background_image from '@/assets/City_of_Aveiro_twitter_b.jpg'
import { RecommenderService } from '@/services/Client/RecommenderService'
import { useQuery } from '@tanstack/react-query'
import { OfferService } from '@/services/Client/OfferService'
export default function LandingPage() {
    const scrollToRef = useRef<HTMLDivElement | null>(null)
    const [isCardLoading, setisCardLoading] = useState<boolean>(true)

    const [isSticky, setIsSticky] = useState(false)

    const fetchMostRelevant = async () => {
        return (await RecommenderService.getMostRelevant({size: 5})).data
    }

    const fetchOffers = async (mostRelevantData: number[]) => {
        let ids = mostRelevantData.queryKey[1].data
        console.log(ids)
        return (await OfferService.getOffersByID({ids: ids})).data
    }

    const { data: mostRelevantData, isLoading: isLoadingRelevantLoading } = useQuery({
        queryKey: ['most_relevant'],
        queryFn: fetchMostRelevant,
    })

    const { data: offerData, isLoading: isLoadingOfferData } = useQuery({
        queryKey: ['offer', mostRelevantData],
        queryFn: fetchOffers,
    })

    const handleScroll = () => {
        const offset = window.scrollY
        if (offset > 200) {
            setIsSticky(true)
        } else {
            setIsSticky(false)
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    // Simular carregamento de dados com um efeito e um timeout
    useEffect(() => {
        const timer = setTimeout(() => {
            setisCardLoading(false)
        }, 3000) // Simula o tempo de carregamento dos dados

        return () => clearTimeout(timer)
    }, [])

    const scrollToElement = () => {
        if (scrollToRef.current) {
            // A altura do seu header ou nav, se houver algum fixado
            const headerOffset = -100 // Ajuste este valor conforme necessário
            // A posição do elemento a partir do topo do documento
            const elementPosition = scrollToRef.current.offsetTop
            // O ajuste do translate, se houver algum
            const translateOffset = isSticky ? 200 : 0 // Substitua 200 pelo valor de translação real
            // A posição final de rolagem
            const offsetPosition = elementPosition - headerOffset - translateOffset

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            })
        }
    }

    
    return (
		<div className='flex flex-col items-center h-screen -mt-16'>
			<div className="relative w-full h-full"> {/* Carousel contofferCardsDataainer com posição relativa */}
                <Carousel className="w-full" plugins={[Autoplay({
					delay: 5000, 
					stopOnInteraction: false,
					stopOnMouseEnter: true,
					}),
				]}
				opts={{
					loop:true,
				}}
				> {/* Ajuste a altura aqui */}
                    <CarouselContent className="h-screen">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <CarouselItem key={index} className="relative h-full">
                                {/* Adicionando a imagem de fundo para cada slide usando Tailwind CSS */}
                                <div
                                    className="absolute inset-0 blur-sm bg-cover bg-center z-0"
                                    style={{
                                        backgroundImage: `url(${background_image})`,
                                    }}
                                >
                                    {/* Você também pode adicionar uma cor de overlay aqui se precisar */}
                                </div>
                                {/* O conteúdo do seu Card */}
                                <div className="p-1 h-full w-full flex items-center justify-center">
                                    <Card className="h-full border-transparent">
                                        <CardContent className="flex items-center h-full justify-center p-6 m-6">
                                            <div className="z-10 flex w-10/12 justify-center">
                                                {isCardLoading ? (
                                                    <OfferCardSkeleton />
                                                ) : (
                                                    offerData && offerData.length > 0
                                                        ? <OfferCard {...offerData[index % offerData.length]}/>
                                                        : <div></div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {/* Posicionamento absoluto das setas */}
                    <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
                    <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
                </Carousel>
            </div>
            <div className="absolute w-full bottom-0 mb-16 text-center">
                <Button
                    variant={'link'}
                    onClick={scrollToElement}
                    className="text-white rounded-full"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-8 h-8"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={5}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
                </Button>
            </div>
            <div
                className={`w-full text-center pt-5 bottom-0 absolute transition-transform pb-6 duration-300 ${
                    isSticky ? 'translate-y-20' : 'translate-y-0'
                }`}
                ref={scrollToRef}
            >
                <p className="text-2xl font-semibold">
                    <span className={isSticky ? 'bg-transparent' : 'text-white'}>
                        More to explore
                    </span>
                </p>
            </div>
            <div className="w-1/2 mt-20 flex items-center flex-col gap-4">
                {isLoadingOfferData 
                    ? Array(3)
                          .fill(0)
                          .map((_, index) => <OfferCardSkeleton key={index} />)
                    : (offerData 
                    ? offerData.map((offer, index) => (
                        <div className='w-full'>
                          <OfferCard key={index} {...offer} />
                        </div>
                      ))
                    : <div>No data available</div>
                  )}
            </div>
        </div>
    )
}
