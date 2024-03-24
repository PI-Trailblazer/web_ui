import { Button } from '@/components/ui/button';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
  } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import Autoplay from "embla-carousel-autoplay"
import { useEffect, useRef, useState } from 'react';
import OfferCard from '@/components/OfferCard';
import { SubCardProps } from '@/lib/types';


export default function LandingPage() {

	const scrollToRef = useRef<HTMLDivElement | null>(null);
	
	const [isSticky, setIsSticky] = useState(false);

	const handleScroll = () => {
	  const offset = window.scrollY;
	  if (offset > 200) { 
		setIsSticky(true);
	  } else {
		setIsSticky(false);
	  }
	};
  
	useEffect(() => {
	  window.addEventListener('scroll', handleScroll);
	  return () => {
		window.removeEventListener('scroll', handleScroll);
	  };
	}, []);
	
	const scrollToElement = () => {
		if (scrollToRef.current) {
		  // A altura do seu header ou nav, se houver algum fixado
		  const headerOffset = -100; // Ajuste este valor conforme necessário
		  // A posição do elemento a partir do topo do documento
		  const elementPosition = scrollToRef.current.offsetTop;
		  // O ajuste do translate, se houver algum
		  const translateOffset = isSticky ? 200 : 0; // Substitua 200 pelo valor de translação real
		  // A posição final de rolagem
		  const offsetPosition = elementPosition - headerOffset - translateOffset;
	  
		  window.scrollTo({
			top: offsetPosition,
			behavior: "smooth"
		  });
		}
	  };
	  

	const offerCardsData: SubCardProps[] = [
		{
		  title: "Offer 1",
		  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec eros ultricies tincidunt. Aenean nec nunc nec nisl ultrices ultricies. Nullam nec purus nec eros ultricies tincidunt. Aenean nec nunc nec nisl ultrices ultricies. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec eros ultricies tincidunt. Aenean nec nunc nec nisl ultrices ultricies.",
		  imageSrc: "https://via.placeholder.com/250",
		  rating: 4,
		  tags: ["Tag1", "Tag2", "Tag3"],
		  price: "$300",
		},
		{
		  title: "Offer 2",
		  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec eros ultricies tincidunt. Aenean nec nunc nec nisl ultrices ultricies. Nullam nec purus nec eros ultricies tincidunt. Aenean nec nunc nec nisl ultrices ultricies. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec eros ultricies tincidunt. Aenean nec nunc nec nisl ultrices ultricies.",
		  imageSrc: "https://via.placeholder.com/250",
		  rating: 5,
		  tags: ["Tag4", "Tag5", "Tag6"],
		  price: "$300",
		},
		{
		  title: "Offer 3",
		  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec eros ultricies tincidunt. Aenean nec nunc nec nisl ultrices ultricies. Nullam nec purus nec eros ultricies tincidunt. Aenean nec nunc nec nisl ultrices ultricies. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec eros ultricies tincidunt. Aenean nec nunc nec nisl ultrices ultricies.",
		  imageSrc: "https://via.placeholder.com/250",
		  rating: 3,
		  tags: ["Tag7", "Tag8", "Tag9"],
		  price: "$300",
		},
	  ];

	
    return (
		<div className='flex flex-col items-center h-screen'>
			<div className="relative w-full h-full"> {/* Carousel container com posição relativa */}
                <Carousel className="w-full" plugins={[Autoplay({
					delay: 5000, // Ajuste o delay aqui
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
							<div className="absolute inset-0 blur-sm bg-cover bg-center z-0" 
								style={{ backgroundImage: `url('https://random.imagecdn.app/v1/image?width=1650&height=1000&category=hotels')` }}>
							{/* Você também pode adicionar uma cor de overlay aqui se precisar */}
							</div>
							
							{/* O conteúdo do seu Card */}
							<div className="p-1 h-full w-full flex items-center justify-end">
							<Card className='h-full border-transparent'>
								<CardContent className="flex items-center h-full justify-center p-6">
									<div className='z-10 flex w-5/6 justify-center mt-80'>
										<OfferCard
											title="Offer 1"
											description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec eros ultricies tincidunt. Aenean nec nunc nec nisl ultrices ultricies. Nullam nec purus nec eros ultricies tincidunt. Aenean nec nunc nec nisl ultrices ultricies. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec eros ultricies tincidunt. Aenean nec nunc nec nisl ultrices ultricies."
											imageSrc="https://via.placeholder.com/250"
											rating={4}
											tags={["Tag1", "Tag2", "Tag3"]}
											price="$300"
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
				<Button variant={'link'} onClick={scrollToElement} className="text-white rounded-full">
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
					<span className={isSticky ? 'bg-transparent' : 'bg-accent rounded-xl px-2 py-1'}>
						More to explore
					</span>
				</p>
			</div>
			<div className="w-2/3 mt-20 flex items-center flex-col gap-4">
				{offerCardsData.map((offer, index) => (
				<OfferCard
					key={index}
					title={offer.title}
					price={offer.price}
					description={offer.description}
					imageSrc={offer.imageSrc}
					rating={offer.rating}
					tags={offer.tags}
				/>
				))}
			</div>
		</div>
	)
}

