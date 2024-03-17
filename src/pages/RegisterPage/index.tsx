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

const regiterShema = z.object({
    email: z.string().email(),
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

    const registerMutation = useMutation({
        mutationFn: (token: string) => {
            console.log(token);
            console.log('POST /api/register (PlaceHolder)');
            return axios.post('/api/register', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((res) => res.data);
        },
        onError: (error) => {
            console.log(error);
        },
        onSuccess: (data) => {
            console.log(data);
        }
    })

    const form = useForm<z.infer<typeof regiterShema>>({
        resolver: zodResolver(regiterShema),
        defaultValues: {
            email: '',
            password: '',
            verifyPassword: ''
        }
    })
    
    function onSubmit(data: z.infer<typeof regiterShema>) {
        handleRegister(data.email, data.password)
    }

    const handleRegister = async (email: string, password: string) => {
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

        registerMutation.mutate(token);

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
        <div className='flex flex-col items-center'>
            <h1>Register Page</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-1/6">
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
        </div>
    )    
}