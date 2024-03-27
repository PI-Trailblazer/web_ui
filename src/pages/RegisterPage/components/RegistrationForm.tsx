import { useState } from 'react';

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

interface RegistrationFormProps {
    userType: 'Tourist' | 'Provider';
    handleRegister: (email: string, password: string, phone?: string) => void;
    isLoading: boolean;
  }

const regiterSchema = z.object({
    email: z.string().email(),
    phone: z.string()
    .optional()
    .refine(phone => phone ? /^\+?[1-9]\d{1,14}$/.test(phone) : true, {
        message: 'Invalid phone number',
    }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    verifyPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    additionalInfo: z.string().optional() // linha de teste
}).refine(data => data.password === data.verifyPassword, {
    message: 'Passwords do not match',
    path: ['verifyPassword']
})

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ userType, handleRegister, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showVerifyPassword, setShowVerifyPassword] = useState(false)

  const form = useForm<z.infer<typeof regiterSchema>>({
    resolver: zodResolver(regiterSchema),
    defaultValues: {
        email: '',
        password: '',
        phone: '',
        verifyPassword: '',
        ...(userType === 'Provider' && { additionalInfo: '' }),

    }
  })

  function onSubmit(data: z.infer<typeof regiterSchema>) {
    handleRegister(data.email, data.password, data.phone)

    // form.reset()
  }

  return (
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
              {userType === 'Provider' && (
                  <FormField
                      control={form.control}
                      name="additionalInfo"
                      render={({ field }) => (
                          <FormItem className='mb-6'>
                              <FormLabel>Certification</FormLabel>
                              <FormControl>
                                <Input id="picture" type="file" {...field} />
                              </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                  />
              )}
              <Button disabled={isLoading} type="submit">{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />} Submit</Button>
          </form>
      </Form>
  )
}
