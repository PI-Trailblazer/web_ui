import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/custom/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { AccountChangeFormValues, accountChangeSchema } from './schema'
import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label'



export function AccountForm() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showVerifyNewPassword, setShowVerifyNewPassword] = useState(false);

  const form = useForm<AccountChangeFormValues>({
    resolver: zodResolver(accountChangeSchema),
    defaultValues: {
      name: '', // Default value can be from user data if available
      phone: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      verifyNewPassword: '',
    }
  });

  function onSubmit(data: any) {
    toast({
      title: 'Account updated!',
      description: 'Your account information has been successfully updated.'
    });
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField control={form.control} name='name' render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder='Your name' {...field} />
            </FormControl>
            <FormDescription>
              This is the name that will be displayed on your profile.
              Your name must consist of exactly two words. For example: John Doe
            </FormDescription>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name='email' render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type='email' placeholder='Your email' {...field} />
            </FormControl>
            <FormDescription>
              We will send account related emails to this address. You can change it at any time.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name='phone' render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input placeholder='Your phone number' {...field} />
            </FormControl>
            <FormDescription>
              We will send account related SMS messages to this number. You can change it at any time.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name='currentPassword' render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <div className="flex flex-col space-y-4">
                <Input type={showCurrentPassword ? 'text' : 'password'} placeholder='Current password' {...field} />
                <div className="items-top flex space-x-2">
                  <Checkbox id='showCurrentPassword' onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                    {' '}
                    Show password
                  </Checkbox>
                  <Label
                    htmlFor="showCurrentPassword"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Show password
                  </Label>
                </div>
              </div>
            </FormControl>
            <FormDescription>
              Enter your current password to confirm your identity.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name='newPassword' render={({ field }) => (
          <FormItem>
            <FormLabel>New Password</FormLabel>
            <FormControl>
              <div className="flex flex-col space-y-4">
                <Input type={showNewPassword ? 'text' : 'password'} placeholder='New password' {...field} />
                <div className="items-top flex space-x-2">
                  <Checkbox id='showNewPassword' onClick={() => setShowNewPassword(!showNewPassword)}>
                    {' '}
                    Show password
                  </Checkbox>
                  <Label
                    htmlFor="showNewPassword"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Show password
                  </Label>
                </div>
              </div>
            </FormControl>
            <FormDescription>
              Enter a new password. It must be at least 8 characters long.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name='verifyNewPassword' render={({ field }) => (
          <FormItem>
            <FormLabel>Verify New Password</FormLabel>
            <FormControl>
              <div className="flex flex-col space-y-4">
                <Input type={showVerifyNewPassword ? 'text' : 'password'} placeholder='Verify new password' {...field} />
                <div className="items-top flex space-x-2">
                  <Checkbox id='showVerifyNewPassword' onClick={() => setShowVerifyNewPassword(!showVerifyNewPassword)}>
                    {' '}
                    Show password
                  </Checkbox>
                  <Label
                    htmlFor="showVerifyNewPassword"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Show password
                  </Label>
                </div>
              </div>
            </FormControl>
            <FormDescription>
              Re-enter your new password to confirm it.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )} />
        <Button type='submit'>Update Account</Button>
      </form>
    </Form>
  );
}