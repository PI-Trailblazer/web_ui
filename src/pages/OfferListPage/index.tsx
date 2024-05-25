import OfferCard from '@/components/OfferCard/OfferCard';
import OfferCardSkeleton from '@/components/OfferCard/OfferCardSkeleton';
import { OfferDetailsProps } from "@/lib/types";
import { useEffect, useState, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CheckedState } from '@radix-ui/react-checkbox';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from '@/components/ui/button';
import { OfferService } from '@/services/Client/OfferService';
import { useInfiniteQuery } from '@tanstack/react-query';

export default function OfferListPage() {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<number[]>([0, 500]);
    const [maxPrice, setMaxPrice] = useState<number>(500);
    const [selectedRating, setSelectedRating] = useState<number>(0);
    const [checkedTags, setCheckedTags] = useState<{ [key: string]: boolean }>({});
    const [checkedRating, setCheckedRating] = useState<{ [key: string]: boolean }>({
        "1": false,
        "2": false,
        "3": false,
        "4": false,
        "5": false,
    });
    const [isSticky, setIsSticky] = useState(false);
    const observerElem = useRef(null);
    const stickyOffsetTop = 100;
    const [visibleOffers, setVisibleOffers] = useState<OfferDetailsProps[]>([]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsSticky(currentScrollY > stickyOffsetTop);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const categories: string[] = ["Accommodation", "Sports", "Adventure", "Food", "Wellness", "Transportation", "Culture", "Drinks", "Café", "Games"]

    const getOffers = async ({ pageParam = 1 }) => {
        const response = await OfferService.getOffers(pageParam);
        return {
            data: response.data,
            nextPage: response.data.length === 10 ? pageParam + 1 : undefined, // Ajuste conforme a estrutura da sua API
        };
    }

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, isSuccess, isError, isLoading } = useInfiniteQuery({
        queryKey: ['offers'],
        queryFn: getOffers,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPage,
    });

    useEffect(() => {
        if (isSuccess && data) {
            const offerData = data.pages.flatMap(page => page.data);
            const maxOfferPrice = Math.max(...offerData.map(offer => offer.price));
            setMaxPrice(maxOfferPrice);
            setPriceRange([0, maxOfferPrice]);
        }
        if (isError) {
            console.log('Error');
        }
    }, [data, isSuccess, isError]);

    const clearFilters = () => {
        setSelectedTags([]);
        setPriceRange([0, maxPrice]);
        setSelectedRating(0);
        setCheckedTags({});
        setCheckedRating({
            "1": false,
            "2": false,
            "3": false,
            "4": false,
            "5": false,
        });
    };

    const handleRatingChange = (value: string) => {
        const ratingValue = parseInt(value);
        setSelectedRating(ratingValue);
        setCheckedRating({
            "1": false,
            "2": false,
            "3": false,
            "4": false,
            "5": false,
            [value]: true,
        });
    };

    const handlePriceChange = (value: number[]) => {
        setPriceRange(value);
    };

    const handleCategoryChange = (category: string) => (checkedState: CheckedState) => {
        if (typeof checkedState === 'boolean') {
            setSelectedTags((prevSelectedTags) => {
                const newSelectedTags = checkedState
                    ? [...prevSelectedTags, category]
                    : prevSelectedTags.filter(tag => tag !== category);
                setCheckedTags((prev) => ({
                    ...prev,
                    [category]: checkedState,
                }));
                return newSelectedTags;
            });
        }
    };

    useEffect(() => {
        if (data) {
            const filteredOffers = data.pages.flatMap(page => page.data).filter((offer) => {
                const rating = offer.n_reviews ? Math.floor(((offer.max_review_score / offer.n_reviews) * 5) / 100) : 0;
                return (selectedTags.length === 0 || offer.tags.some(tag => selectedTags.includes(tag))) &&
                    offer.price >= priceRange[0] && offer.price <= priceRange[1] &&
                    rating >= selectedRating;
            });
            setVisibleOffers(filteredOffers);
        }
    }, [selectedTags, priceRange, selectedRating, data]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage();
                }
            },
            {
                threshold: 1.0,
            }
        );

        if (observerElem.current) {
            observer.observe(observerElem.current);
        }

        return () => {
            if (observerElem.current) {
                observer.unobserve(observerElem.current);
            }
        };
    }, [hasNextPage, fetchNextPage]);

    return (
        <div className="pt-44 -mt-16 p-10 flex">
            <div className="p-4 w-4/12">
                <div className={`p-6 border bg-card shadow-lg rounded-lg z-10 ${isSticky ? 'sticky top-20' : ''}`} >
                    <h1 className="text-2xl text-center font-bold mb-4">Filters</h1>
                    <div className="space-y-2 flex flex-col p-6 pl-24">
                        <h3 className='text-xl pb-1 font-medium'>Categories</h3>
                        <div className='grid grid-cols-2 gap-4 pl-4'>
                            {categories.map((category, i) => (
                                <div key={i} className='space-x-2 flex items-center'>
                                    <Checkbox
                                        id={`checkbox-${category}`}
                                        defaultChecked={selectedTags.includes(category)}
                                        onCheckedChange={handleCategoryChange(category)}
                                        value={category}
                                        checked={checkedTags[category] || false}
                                    />
                                    <Label htmlFor={`checkbox-${category}`} className='text-md cursor-pointer'>{category}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='space-y-2 flex pb-6 flex-col px-24'>
                        <h3 className='text-xl pb-1 font-medium'>Price</h3>
                        <div className='space-y-2 px-4'>
                            <div className='flex justify-between'>
                                <Label className='text-md'>{`€${priceRange[0]}`}</Label>
                                <Label className='text-md'>{`€${priceRange[1]}`}</Label>
                            </div>
                            <Slider
                                min={0}
                                max={maxPrice}
                                value={priceRange}
                                onValueChange={handlePriceChange}
                                className='p-2'
                            />
                        </div>
                    </div>
                    <div className='space-y-2 pb-6 flex flex-col px-24'>
                        <h3 className='text-xl pb-1 font-medium'>Rating Above:</h3>
                        <RadioGroup onValueChange={handleRatingChange}>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div className="flex items-center pl-4 space-x-2 mb-2" key={index}>
                                    <RadioGroupItem id={(index + 1).toString()} value={(index + 1).toString()} checked={checkedRating[(index + 1).toString()] || false} />
                                    <Label className='text-md cursor-pointer flex space-x-1 items-center' htmlFor={(index + 1).toString()}>
                                        {(index + 1).toString()}
                                        {Array.from({ length: index + 1 }).map((_, i) => (
                                            <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 3L12 6.196l3.951.574-2.856 2.787.674 3.943-3.769-1.981-3.769 1.981.674-3.943L5.049 6.77 9 6.196z" />
                                            </svg>
                                        ))}
                                        {Array.from({ length: 5 - index - 1 }).map((_, i) => (
                                            <svg key={i} className="h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 3L12 6.196l3.951.574-2.856 2.787.674 3.943-3.769-1.981-3.769 1.981.674-3.943L5.049 6.77 9 6.196z" />
                                            </svg>
                                        ))}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                    <div className='flex justify-center'>
                        <Button variant={'destructive'} onClick={clearFilters} className='w-1/2 p-2 rounded'>
                            Clear Filters
                        </Button>
                    </div>
                </div>
            </div>
            <div className={`w-8/12 flex flex-col items-center p-4`}>
                <div className='space-y-4 w-10/12'>
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, index) => <OfferCardSkeleton key={index} />)
                    ) : isSuccess && visibleOffers ? (
                        visibleOffers.map((offer: OfferDetailsProps, index: any) => (
                            <OfferCard key={index} {...offer} />
                        ))
                    ) : null}
                    {isFetchingNextPage && <OfferCardSkeleton />}
                    <div ref={observerElem} className='flex justify-center mt-4'>
                        {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load More' : 'No more offers to load'}
                    </div>
                </div>
            </div>
        </div>
    );
}
