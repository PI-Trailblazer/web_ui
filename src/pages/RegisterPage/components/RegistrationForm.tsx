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

    return (
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
                <Button disabled={isLoading} type="submit">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Submit
                </Button>
            </form>
        </Form>
    );
};
