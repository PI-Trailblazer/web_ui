import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Firebase
import { firebase_app, auth } from "@/services/Firebase";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";

// Forms
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

// UI
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const regiterSchema = z.object({
    email: z.string().email(),
    phone: z.string()
    .optional()
    .refine(phone => phone ? /^\+?[1-9]\d{1,14}$/.test(phone) : true, {
        message: 'Invalid phone number',
    }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    verifyPassword: z.string().min(6, { message: 'Password must be at least 6 characters' })
}).refine(data => data.password === data.verifyPassword, {
    message: 'Passwords do not match',
    path: ['verifyPassword']
})

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [showVerifyPassword, setShowVerifyPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    
    const navigate = useNavigate();


    const form = useForm<z.infer<typeof regiterSchema>>({
        resolver: zodResolver(regiterSchema),
        defaultValues: {
            email: '',
            password: '',
            phone: '',
            verifyPassword: ''
        }
    })
    
    function onSubmit(data: z.infer<typeof regiterSchema>) {
        handleRegister(data.email, data.password, data.phone)
    }

    const register = async ({ token, phone }: { token: string; phone: string }) => {
        const response = await axios.post('/api/register', 
            { roles: ['NORMAL', 'PROVIDER'], phone_number: phone === '' ? null : phone},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    };

    const registerMutation = useMutation({
        mutationFn: register,
        onSuccess: () => {
            console.log('Success');
        },
        onError: (error) => {
            console.log(error);
        }
    });
    
    const handleRegister = async (email: string, password: string, phone: string | undefined) => {
        setIsLoading(true)
        let token = ''
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log(userCredential);
            // Signed in 
            const user = userCredential.user;
            token = await user.getIdToken()
            console.log(token);
            console.log(user);
        } catch (error) {
            console.log(error);
            setIsLoading(false)
            return
        }
        
        if (token === '') {
            setIsLoading(false)
            return
        }
        
        let data = {
            token: token,
            phone: phone
        }
        
        registerMutation.mutate(data);

        localStorage.setItem('token', token);
        // delete user
        const user = auth.currentUser;
        if (user !== null) {
            deleteUser(user).then(() => {
                // User deleted.
                console.log('User deleted');
            }, (error) => {
                console.log(error);
            });
        }

        setIsLoading(false)
        navigate('/')
    }

    return (
        <div className='flex flex-col min-h-screen items-center justify-center'>
            <div className='pb-6'>
                <h1 className='font-bold text-2xl'>Register Page</h1>
            </div>
            <Tabs className='border rounded-xl shadow-lg dark:bg-zinc-900 bg-muted p-8' defaultValue='Tourist'>
                <TabsList className="grid grid-cols-2 w-[350px]">
                    <TabsTrigger value='Tourist'>Tourist</TabsTrigger>
                    <TabsTrigger value='Provider'>Provider</TabsTrigger>
                </TabsList>
                <TabsContent value='Tourist'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className='mb-6'>
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
                                    <FormItem className='mb-6'>
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
                                        <div className='flex flex-col space-y-4'>
                                            <Input type={showPassword ? "text" : "password"} placeholder="Password" {...field} />
                                            <div className='items-top flex space-x-2'>
                                                <Checkbox id='showPassword' onClick={() => setShowPassword(!showPassword)}> Show Password</Checkbox>
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
                                        <div className='flex flex-col space-y-4'>
                                            <Input type={showVerifyPassword ? "text" : "password"} placeholder="Verify Password" {...field} />
                                            <div className='items-top flex space-x-2'>
                                                <Checkbox id='showVerifyPassword' onClick={() => setShowVerifyPassword(!showVerifyPassword)}> Show Password</Checkbox>
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
                        <Button disabled={isLoading} type="submit">{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />} Submit</Button>
                    </form>
                </Form>

                </TabsContent>
                <TabsContent value='Provider'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className='mb-6'>
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
                                    <FormItem className='mb-6'>
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
                                            <div className='flex flex-col space-y-4'>
                                                <Input type={showPassword ? "text" : "password"} placeholder="Password" {...field} />
                                                <div className='items-top flex space-x-2'>
                                                    <Checkbox id='showPassword' onClick={() => setShowPassword(!showPassword)}> Show Password</Checkbox>
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
                                            <div className='flex flex-col space-y-4'>
                                                <Input type={showVerifyPassword ? "text" : "password"} placeholder="Verify Password" {...field} />
                                                <div className='items-top flex space-x-2'>
                                                    <Checkbox id='showVerifyPassword' onClick={() => setShowVerifyPassword(!showVerifyPassword)}> Show Password</Checkbox>
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
                            <Button disabled={isLoading} type="submit">{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />} Submit</Button>
                        </form>
                    </Form>
                </TabsContent>
            </Tabs>
        </div>
    )    
}