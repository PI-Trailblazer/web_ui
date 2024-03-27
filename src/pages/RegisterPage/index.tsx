import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Firebase
import { firebase_app, auth } from "@/services/Firebase";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

//component
import { RegistrationForm } from './components/RegistrationForm';

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false)
    
    const navigate = useNavigate();
    
    const register = async ({ token, phone }: { token: string; phone?: string }) => { //se o phone for undefined, ele vai ser null
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
                <h1 className='font-bold text-2xl'>Register your account</h1>
            </div>
            <Tabs className='border rounded-xl shadow-lg dark:bg-zinc-900 bg-muted p-8' defaultValue='Tourist'>
                <TabsList className="grid grid-cols-2 w-[350px]">
                    <TabsTrigger value='Tourist'>Tourist</TabsTrigger>
                    <TabsTrigger value='Provider'>Provider</TabsTrigger>
                </TabsList>
                <TabsContent value='Tourist'>
                    <RegistrationForm userType='Tourist' handleRegister={handleRegister} isLoading={isLoading} />
                </TabsContent>
                <TabsContent value='Provider'>
                    <RegistrationForm userType='Provider' handleRegister={handleRegister} isLoading={isLoading} />
                </TabsContent>
            </Tabs>
        </div>
    )    
}