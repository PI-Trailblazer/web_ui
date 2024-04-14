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
import EstadioBenfica from '@/assets/estadioDaLuz.jpg'

export default function LandingPage() {
    const scrollToRef = useRef<HTMLDivElement | null>(null)
    const [isCardLoading, setisCardLoading] = useState<boolean>(true)

    const [isSticky, setIsSticky] = useState(false)

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

    const offerCardsData: OfferDetailsProps[] = [
        {
            id: 50,
            name: 'Fim de Semana Benfiquista - Retiro Histórico',
            description: 'Viva a emoção de ser um Benfiquista com um retiro de fim de semana em Lisboa. Explore o Estádio da Luz, jante onde lendas do clube se reuniram, e fique em um hotel temático dedicado aos maiores momentos do Benfica.',
            street: "Rua dos Campeões Europeus",
            city: "Lisboa",
            postal_code: "1500-524",
            price: 500,
            max_review_score: 800,
            n_reviews: 8,
            discount: 5,
            tags: ["História", "Futebol", "Benfica", "Lendas"],
            max_quantity: 10,
            modules: [1, 2],
        },
        {
            id: 51,
            name: "Workshop de Futebol com Heróis do Benfica",
            description: "Aprimore suas habilidades futebolísticas em um workshop exclusivo liderado por heróis históricos do Benfica. Perfeito para jovens e adultos, este dia inclui treinamento em campo, sessões teóricas sobre a filosofia do futebol do Benfica, e uma refeição compartilhada com os treinadores. Cada participante receberá um kit de treino oficial do Benfica.",
            street: "Avenida dos Treinadores",
            city: "Seixal",
            postal_code: "2840-166",
            price: 300,
            max_review_score: 1200,
            n_reviews: 12,
            discount: 0,
            tags: ["Futebol", "Workshop", "Treino", "Benfica"],
            max_quantity: 20,
            modules: [1, 3],
        },
        {
            id: 52,
            name: "Gala Benfiquista - Noite de Gala com Estrelas",
            description: "Participe de uma noite de gala exclusiva, celebrando as conquistas e a história do Benfica. Desfrute de um jantar de luxo no centro de Lisboa, com a presença de jogadores atuais e lendas do clube. A noite inclui leilão de memorabilia autêntica do Benfica, com todos os rendimentos revertidos para a fundação do clube.",
            street: "Praça dos Heróis",
            city: "Lisboa",
            postal_code: "1100-365",
            price: 1000,
            max_review_score: 500,
            n_reviews: 5,
            discount: 5,
            tags: ["Gala", "Luxo", "Benfica", "Jogadores"],
            max_quantity: 50,
            modules: [2, 4],
        },
    ]
    

    return (
		<div className='flex flex-col items-center h-screen -mt-16'>
			<div className="relative w-full h-full"> {/* Carousel container com posição relativa */}
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
                                        backgroundImage: `url(${EstadioBenfica})`,
                                    }}
                                >
                                    {/* Você também pode adicionar uma cor de overlay aqui se precisar */}
                                </div>
                                {/* O conteúdo do seu Card */}
                                <div className="p-1 h-full w-full flex items-center justify-end">
                                    <Card className="h-full border-transparent">
                                        <CardContent className="flex items-center h-full justify-center p-6">
                                            <div className="z-10 flex w-7/12 justify-center">
                                                <OfferCard {...offerCardsData[index % offerCardsData.length]}
                                                />
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
                {isCardLoading
                    ? Array(3)
                          .fill(0)
                          .map((_, index) => <OfferCardSkeleton key={index} />)
                    : offerCardsData.map((offer, index) => (
                          <OfferCard key={index}{...offer}
                          />
                      ))}
            </div>
        </div>
    )
}
