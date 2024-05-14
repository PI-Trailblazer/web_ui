import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Firebase
import { firebase_app, auth } from '@/services/Firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Forms
import { z } from 'zod';
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
import primary from '@/assets/Background/primary.svg';
import secondary from '@/assets/Background/secondary.svg';
import accent from '@/assets/Background/accent.svg';

import { useUserStore } from '@/stores/useUserStore';
import { UserService } from '@/services/Client/UserService';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    function onSubmit(data: z.infer<typeof loginSchema>) {
        handleLogin(data.email, data.password);
    }

    const login = async () => {
        return (await UserService.login()).data;
    };
    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: data => {
            console.log('Success');
            console.log(data);
            useUserStore.getState().login(data.access_token);
            setIsLoading(false);
            navigate('/');    
        },
        onError: error => {
            console.log(error);
            setIsLoading(false);
        },
    });

    const handleLogin = async (email: string, password: string) => {
        setIsLoading(true);
        let token = '';
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            token = await user.getIdToken();
        } catch (error) {
            setIsLoading(false);
            return;
        }

        if (token === '') {
            setIsLoading(false);
            return;
        }

        useUserStore.setState({ token });

        loginMutation.mutate();
    };

    return (
        <div className="flex flex-col min-h-screen justify-center items-center relative">
            <div className="pb-6 z-20">
                <h1 className="font-bold bg-card shadow-lg rounded-xl px-3 py-2 border text-2xl">
                    Login your account
                </h1>
            </div>
            <div className="rounded-xl w-[350px] shadow-lg z-20 border bg-card p-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        <Button disabled={isLoading} type="submit">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Submit
                        </Button>
                    </form>
                </Form>
            </div>
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 w-full"
                    style={{
                        backgroundImage: `url(${primary})`,
                        backgroundRepeat: 'repeat-x',
                        backgroundPosition: 'top 100px left 0',
                    }}
                ></div>
                <div
                    className="absolute inset-0 w-full"
                    style={{
                        backgroundImage: `url(${secondary})`,
                        backgroundRepeat: 'repeat-x',
                        backgroundPosition: 'top 100px left 0',
                    }}
                ></div>
                <div
                    className="absolute inset-0 w-full"
                    style={{
                        backgroundImage: `url(${accent})`,
                        backgroundRepeat: 'repeat-x',
                        backgroundPosition: 'top 100px left 0',
                    }}
                ></div>
            </div>
        </div>
    );
}
