import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Firebase
import { firebase_app, auth } from '@/services/Firebase';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormValues } from './components/schema';
//component
import { RegistrationForm } from './components/RegistrationForm';
import primary from '@/assets/Background/primary.svg';
import secondary from '@/assets/Background/secondary.svg';
import accent from '@/assets/Background/accent.svg';

import { useUserStore } from '@/stores/useUserStore';
import { UserService } from '@/services/Client/UserService';

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [userType, setUserType] = useState('Tourist');

    const navigate = useNavigate();

    const register = async ({ data, tags }: { data: FormValues, tags: string[] }) => {
        //se o phone for undefined, ele vai ser null
        let inRoles = ['USER'];
        if (userType === 'Provider') {
            inRoles.push('PROVIDER');
        }

        let payload = {
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            roles: inRoles,
            phone: data.phone ?? null,
            tags: tags,
        };

        console.log(payload);
        const response = await UserService.register({
            ...payload,
        });

        return response.data;
    };

    const registerMutation = useMutation({
        mutationFn: register,
        onSuccess: data => {
            console.log('Success');
            let loginData = {
                f_name: data.f_name,
                l_name: data.l_name,
                image: data.image,
                roles: data.roles,
                tags: data.tags,
                uid: data.uid,
            };
            console.log(loginData);
            useUserStore.getState().login(loginData);
            setIsLoading(false);
            navigate('/');
        },
        onError: error => {
            console.log(error);
            setIsLoading(false);
        },
    });

    const handleRegister = async (data: FormValues, tags: string[]) => {
        setIsLoading(true);
        let token = '';
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password,
            );
            // Signed in
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

        registerMutation.mutate({ data: data, tags:tags });
    };

    return (
        <div className="flex flex-col min-h-screen items-center relative justify-center">
            <div className="pb-6 relative z-10">
                <h1 className="font-bold dark:bg-zinc-900 dark:border rounded-xl p-2 text-2xl">
                    Register your account
                </h1>
            </div>
            <Tabs
                className="border rounded-xl relative z-10 shadow-lg dark:bg-zinc-900 bg-muted p-8"
                defaultValue={userType}
            >
                <TabsList className="grid grid-cols-2 w-[350px]">
                    <TabsTrigger value="Tourist" onClick={() => setUserType('Tourist')}>
                        Tourist
                    </TabsTrigger>
                    <TabsTrigger value="Provider" onClick={() => setUserType('Provider')}>
                        Provider
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="Tourist">
                    <RegistrationForm
                        userType="Tourist"
                        handleRegister={handleRegister}
                        isLoading={isLoading}
                    />
                </TabsContent>
                <TabsContent value="Provider">
                    <RegistrationForm
                        userType="Provider"
                        handleRegister={handleRegister}
                        isLoading={isLoading}
                    />
                </TabsContent>
            </Tabs>
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
