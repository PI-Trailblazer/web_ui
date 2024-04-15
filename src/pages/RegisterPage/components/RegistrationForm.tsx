import { useState } from 'react';

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

import offerCardsData from './FakeCardsData';
import { set } from 'zod';

interface RegistrationFormProps {
    userType: 'Tourist' | 'Provider';
    handleRegister: (data: FormValues) => void;
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
    const [tags, setTags] = useState(['']);

    const [formError, setFormError] = useState('');
    
    const handleCheckboxChange = (index) => {
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
        handleRegister({tags: tags});
    }

    const getTags = () => {
        const selectedTags = selectedOffers.map((selected, index) => {
            if (selected) {
                return offerCardsData[index].tags;
            }
        }).filter(tag => tag !== undefined);
        // append the tags to the tags state
        let oldTags = tags;
        setTags([...oldTags, ...selectedTags]);
    }

    const handlePageChange = (page) => {
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

    const handleButtonClick = (event) => {
        event.preventDefault(); // Prevent form submission
        if (!form.formState.isValid) {
            setFormError('Please fill in the fields');
            return;
        }
        setIsModalOpen(true); // Open the modal
    };

    return (
    <>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-6">
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
                        <Button onClick={handleButtonClick}>
                            Next Step
                        </Button>
                        {formError && <div className='text-destructive'>{formError}</div>}
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
                                <div className='flex justify-center items-center'>  
                                    <h2 className="text-xl font-semibold">Select the most appealing offers</h2>
                                </div>
                                <div className='flex-col space-y-4'>
                                    {currentPage === 1 && (
                                        <div className='flex space-x-4'>
                                            {/* Render the first page of offers */}
                                            {/* Replace 0, 1, 2 with the indices of the offers you want to display on the first page */}
                                            <div className={`w-5/12 ${selectedOffers[0] ? 'border-4 rounded-xl' : ''}`}>
                                                <label>
                                                    <input 
                                                        type='checkbox' 
                                                        className='hidden' 
                                                        checked={selectedOffers[0]}
                                                        onChange={() => handleCheckboxChange(0)}
                                                    />
                                                    <OfferCard {...offerCardsData[0]}/>
                                                </label>
                                            </div>
                                            <div className={`w-5/12 ${selectedOffers[1] ? 'border-4 rounded-xl' : ''}`}>
                                                <label>
                                                    <input 
                                                        type='checkbox' 
                                                        className='hidden' 
                                                        checked={selectedOffers[1]}
                                                        onChange={() => handleCheckboxChange(1)}
                                                    />
                                                    <OfferCard {...offerCardsData[1]}/>
                                                </label>
                                            </div>
                                            <div className={`w-5/12 ${selectedOffers[2] ? 'border-4 rounded-xl' : ''}`}>
                                                <label>
                                                    <input 
                                                        type='checkbox' 
                                                        className='hidden' 
                                                        checked={selectedOffers[2]}
                                                        onChange={() => handleCheckboxChange(2)}
                                                    />
                                                    <OfferCard {...offerCardsData[2]}/>
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                    {currentPage === 2 && (
                                        <div className='flex space-x-4'>
                                            {/* Render the second page of offers */}
                                            {/* Replace 3, 4, 5 with the indices of the offers you want to display on the second page */}
                                            <div className={`w-5/12 ${selectedOffers[0] ? 'border-4 rounded-xl' : ''}`}>
                                                <label>
                                                    <input 
                                                        type='checkbox' 
                                                        className='hidden' 
                                                        checked={selectedOffers[0]}
                                                        onChange={() => handleCheckboxChange(0)}
                                                    />
                                                    <OfferCard {...offerCardsData[3]}/>
                                                </label>
                                            </div>
                                            <div className={`w-5/12 ${selectedOffers[1] ? 'border-4 rounded-xl' : ''}`}>
                                                <label>
                                                    <input 
                                                        type='checkbox' 
                                                        className='hidden' 
                                                        checked={selectedOffers[1]}
                                                        onChange={() => handleCheckboxChange(1)}
                                                    />
                                                    <OfferCard {...offerCardsData[4]}/>
                                                </label>
                                            </div>
                                            <div className={`w-5/12 ${selectedOffers[2] ? 'border-4 rounded-xl' : ''}`}>
                                                <label>
                                                    <input 
                                                        type='checkbox' 
                                                        className='hidden' 
                                                        checked={selectedOffers[2]}
                                                        onChange={() => handleCheckboxChange(2)}
                                                    />
                                                    <OfferCard {...offerCardsData[5]}/>
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                    <div className='flex justify-center items-center'>
                                        {currentPage == 1 && <Button onClick={() => handlePageChange(2)}>Next</Button>}
                                        {currentPage == 2 && <Button onClick={() => handleSubmit()}>Submit</Button>}
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
