import { SetStateAction, useState } from 'react';

// Forms
import { FormValues, regiterSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// UI
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import OfferCard from '@/components/OfferCard/OfferCard'
import { Badge } from "@/components/ui/badge"

import offerCardsData from './FakeCardsData';

interface RegistrationFormProps {
    userType: 'Tourist' | 'Provider';
    handleRegister: (data: FormValues, tags: string[]) => void; // Atualizado para aceitar tags
    isLoading: boolean;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
    userType,
    handleRegister,
    isLoading,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showVerifyPassword, setShowVerifyPassword] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOffers, setSelectedOffers] = useState([false, false, false]);
    const [currentPage, setCurrentPage] = useState(1);
    const [tags, setTags] = useState([]);
    const [modalDone, setModalDone] = useState(false);
    const [formError, setFormError] = useState('');
    const [seeMoreDisabled, setSeeMoreDisabled] = useState(true);
    
    const handleCheckboxChange = (index: number) => {
        if (selectedOffers.filter(Boolean).length === 2 && !selectedOffers[index]) {
            return;
        }
        setSelectedOffers(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });
    };

    const handleSubmit = () => {
        getTags();
        setIsModalOpen(false);
        setModalDone(true);
    }

    const getTags = () => {
        const selectedTags = selectedOffers.map((selected, index) => {
            if (selected) {
                return offerCardsData[index + (3* (currentPage-1))].tags;
            }
        }).filter(tag => tag !== undefined).flat();
        // append the tags to the tags state
        let oldTags = tags;
        setTags([...oldTags, ...selectedTags]);

    }

    const handlePageChange = (page: SetStateAction<number>) => {
        // get tags from the selected offers
        getTags();
        // reset selected offers
        setSelectedOffers([false, false, false]);
        setCurrentPage(page);
    }
    const form = useForm<FormValues>({
        resolver: zodResolver(regiterSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phone: '',
            verifyPassword: '',
        },
    });

    const handleButtonClick = (event: { preventDefault: () => void; }) => {
        event.preventDefault(); // Prevent form submission
        setIsModalOpen(true); // Open the modal
    };

    const handleFormSubmit = () => {
        if (tags.length === 0) {
            setFormError('Please select at least one offer');
            return;
        }
        form.handleSubmit((data) => handleRegister(data, tags))();
    }

    return (
    <>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem className="mb-6">
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input placeholder="First Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem className="mb-6">
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Last Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="mb-6">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem className="mb-6">
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input placeholder="1234567890" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <div className="flex flex-col space-y-4">
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        {...field}
                                        />
                                    <div className="items-top flex space-x-2">
                                        <Checkbox
                                            id="showPassword"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {' '}
                                            Show Password
                                        </Checkbox>
                                        <label
                                            htmlFor="showPassword"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Show Password
                                        </label>
                                    </div>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="verifyPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Verify Password</FormLabel>
                            <FormControl>
                                <div className="flex flex-col space-y-4">
                                    <Input
                                        type={showVerifyPassword ? 'text' : 'password'}
                                        placeholder="Verify Password"
                                        {...field}
                                        />
                                    <div className="items-top flex space-x-2">
                                        <Checkbox
                                            id="showVerifyPassword"
                                            onClick={() =>
                                                setShowVerifyPassword(!showVerifyPassword)
                                            }
                                            >
                                            {' '}
                                            Show Password
                                        </Checkbox>
                                        <label
                                            htmlFor="showVerifyPassword"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Show Password
                                        </label>
                                    </div>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {userType === 'Provider' && (
                    <FormField
                        control={form.control}
                        name="additionalInfo"
                        render={({ field }) => (
                            <FormItem className="mb-6">
                                <FormLabel>Certification</FormLabel>
                                <FormControl>
                                    <Input id="picture" type="file" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    )}
                    <div className='flex flex-col justify-center items-center space-y-2'>
                        {/* if modal not done button to open else submit button */}
                        {!modalDone && (
                            <Button onClick={handleButtonClick}>
                                {isLoading ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : (
                                    'Submit'
                                )}
                            </Button>
                        )}
                        {modalDone && (
                            <Button onClick={handleFormSubmit}>
                                {isLoading ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : (
                                    'Register'
                                )}
                            </Button>
                        )}
                        
                    </div>
            </form>
        </Form>
        {isModalOpen && (
            <>
                <div className="fixed inset-0 z-100 bg-black bg-opacity-50 backdrop-blur-md"></div>
                <div className="fixed inset-0 z-100 flex items-center justify-center">                    
                    <div className='p-8'>
                        <div className="border border-accent p-8 rounded-lg shadow-lg bg-background max-w-full">
                            <div className='flex-col justify-center items-center space-y-8'>
                                <div className='flex flex-col justify-center items-center'>  
                                    <h2 className="text-xl font-semibold">Select the most appealing offers</h2>
                                    <p className="text-sm text-center text-gray-500">
                                        Select 1 or 2 offers that you would like to see more about. 
                                        <br />
                                        <span className="underline">
                                            This will help us to provide you with the tags that best suit your interests.
                                        </span>
                                    </p>
                                </div>
                                <div className='flex-col space-y-4'>
                                    {currentPage === 1 && (
                                        <div className='flex space-x-4'>
                                            {/* Render the first page of offers */}
                                            {/* Replace 0, 1, 2 with the indices of the offers you want to display on the first page */}
                                            <div className={`w-5/12 relative ${selectedOffers[0] ? 'border-4 rounded-xl' : ''}`}>
                                                {selectedOffers[0] && <Badge className="z-20 absolute -top-2 -left-1">Selected</Badge>}
                                                <label>
                                                    <input 
                                                        type='checkbox' 
                                                        className='hidden' 
                                                        checked={selectedOffers[0]}
                                                        onChange={() => handleCheckboxChange(0)}
                                                    />
                                                    <OfferCard {...offerCardsData[0]} seeMoreDisabled={seeMoreDisabled}/>
                                                </label>
                                            </div>
                                            <div className={`w-5/12 relative ${selectedOffers[1] ? 'border-4 rounded-xl' : ''}`}>
                                            {selectedOffers[1] && <Badge className="z-20 absolute -top-2 -left-1">Selected</Badge>}
                                                <label>
                                                    <input 
                                                        type='checkbox' 
                                                        className='hidden' 
                                                        checked={selectedOffers[1]}
                                                        onChange={() => handleCheckboxChange(1)}
                                                    />
                                                    <OfferCard {...offerCardsData[1]} seeMoreDisabled={seeMoreDisabled}/>
                                                </label>
                                            </div>
                                            <div className={`w-5/12 relative ${selectedOffers[2] ? 'border-4 rounded-xl' : ''}`}>
                                            {selectedOffers[2] && <Badge className="z-20 absolute -top-2 -left-1">Selected</Badge>}
                                                <label>
                                                    <input 
                                                        type='checkbox' 
                                                        className='hidden' 
                                                        checked={selectedOffers[2]}
                                                        onChange={() => handleCheckboxChange(2)}
                                                    />
                                                    <OfferCard {...offerCardsData[2]} seeMoreDisabled={seeMoreDisabled}/>
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                    {currentPage === 2 && (
                                        <div className='flex space-x-4'>
                                            {/* Render the second page of offers */}
                                            {/* Replace 3, 4, 5 with the indices of the offers you want to display on the second page */}
                                            <div className={`w-5/12 relative ${selectedOffers[0] ? 'border-4 rounded-xl' : ''}`}>
                                            {selectedOffers[0] && <Badge className="z-20 absolute -top-2 -left-1">Selected</Badge>}
                                                <label>
                                                    <input 
                                                        type='checkbox' 
                                                        className='hidden' 
                                                        checked={selectedOffers[0]}
                                                        onChange={() => handleCheckboxChange(0)}
                                                    />
                                                    <OfferCard {...offerCardsData[3]} seeMoreDisabled={seeMoreDisabled}/>
                                                </label>
                                            </div>
                                            <div className={`w-5/12 relative ${selectedOffers[1] ? 'border-4 rounded-xl' : ''}`}>
                                            {selectedOffers[1] && <Badge className="z-20 absolute -top-2 -left-1">Selected</Badge>}
                                                <label>
                                                    <input 
                                                        type='checkbox' 
                                                        className='hidden' 
                                                        checked={selectedOffers[1]}
                                                        onChange={() => handleCheckboxChange(1)}
                                                    />
                                                    <OfferCard {...offerCardsData[4]} seeMoreDisabled={seeMoreDisabled}/>
                                                </label>
                                            </div>
                                            <div className={`w-5/12 relative ${selectedOffers[2] ? 'border-4 rounded-xl' : ''}`}>
                                            {selectedOffers[2] && <Badge className="z-20 absolute -top-2 -left-1">Selected</Badge>}
                                                <label>
                                                    <input 
                                                        type='checkbox' 
                                                        className='hidden' 
                                                        checked={selectedOffers[2]}
                                                        onChange={() => handleCheckboxChange(2)}
                                                    />
                                                    <OfferCard {...offerCardsData[5]} seeMoreDisabled={seeMoreDisabled}/>
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                    <div className='flex justify-center items-center'>
                                        {currentPage == 1 && <Button onClick={() => handlePageChange(2)}>Next</Button>}
                                        {currentPage == 2 && <Button onClick={() => handleSubmit()}>Close</Button>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )}
    </>
    );
};
