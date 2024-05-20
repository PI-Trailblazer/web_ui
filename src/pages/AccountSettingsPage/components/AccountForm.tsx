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
import { useEffect, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label'
import { useQuery } from '@tanstack/react-query';

import { useUserStore } from '@/stores/useUserStore'
import { UserService } from '@/services/Client/UserService'
import { UserResponse } from '@/lib/types'

//Firebase
import { firebase_app, auth } from '@/services/Firebase';
import 'firebase/auth';
import { CheckedState } from '@radix-ui/react-checkbox'

export function AccountForm() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(''); // URL da imagem de pré-visualização
  const tags: string[] = [
    'Accommodation',
    'Sports',
    'Adventure',
    'Culture',
    'Wellness',
    'Food',
    'Games',
    'Café',
    'Transportation',
    'Drinks',
  ];


  const userStore = useUserStore();

  async function fetchUser() {
    const response = await UserService.getUserByUserId(userStore.sub);
    console.log(response.data);
    return response.data;
  }
  
  const {data: userInfo, isLoading, error} = useQuery<UserResponse>({
    queryKey: ['user', userStore.sub],
    queryFn: fetchUser,
  })
  
  const [selectedTags, setSelectedTags] = useState<string[]>(userStore.tags || []);

  useEffect(() => {
    setSelectedTags(userStore.tags);
  }, [userStore.tags]);

  const form = useForm<AccountChangeFormValues>({
    resolver: zodResolver(accountChangeSchema),
    defaultValues: {
      name: '',
      phone: '', 
      email: '',
      currentPassword: '',
      image: '',
      tags: [],
    },
  });

  useEffect(() => {
    form.reset({
      name: `${userInfo?.f_name} ${userInfo?.l_name}`,
      phone: userInfo?.phone_number,
      email: userInfo?.email,
      currentPassword: '',
      image: '',
      tags: userInfo?.tags,
    });
  }
  , [userInfo]);



  function handleTagChange(checked: CheckedState, value: string) {
    if (checked) {
      setSelectedTags(prevTags => [...prevTags, value]);
    } else {
      setSelectedTags(prevTags => prevTags.filter(t => t !== value));
    }
  }
  
  function onSubmit(data: any) {

    data.tags = selectedTags;

    const name = data.name.split(' ');
    data.f_name = name[0];
    data.l_name = name[1];
    delete data.name;

    toast({
      variant: 'success',
      title: 'Account updated!',
      description: 'Your account information has been successfully updated.'
    });

    console.log(data);
  }

  if (isLoading && !userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className="grid grid-cols-2 gap-4">
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
          <FormField control={form.control} name='image' render={({ field }) => (
              <FormItem className="row-span-2">
                  <FormLabel>Profile Picture</FormLabel>
                  {imagePreviewUrl ? <img src={imagePreviewUrl} className="w-32 h-32 rounded-full" alt="Profile preview" />
                    : <img src={userStore.image || 'https://via.placeholder.com/150'} className="w-32 h-32 rounded-full" alt="Profile preview" /> }
                  <FormControl>
                  <Input type='file' {...field} onChange={(event) => {
                      field.onChange(event); // Mantenha o controle do formulário atualizado

                      if (event.target.files && event.target.files.length > 0) {
                        const file = event.target.files[0];
                        setImagePreviewUrl(URL.createObjectURL(file)); // Atualize a URL da imagem de pré-visualização
                      }
                    }} />
                  </FormControl>
                  <FormDescription>
                      This image will be displayed on your profile. You can change it at any time.
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
          <FormField control={form.control} name='tags' render={({ field }) => (
            <FormItem className='col-span-2'>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <div className="grid grid-cols-5 gap-5">
                {tags.map((tag) => (
                  <div className='inline-flex items-center' key={tag}>
                    <Checkbox key={tag} {...field} checked={selectedTags.includes(tag)} value={tag} onCheckedChange={(checked) => handleTagChange(checked, tag)}>
                      {' '}
                      {tag}
                    </Checkbox>
                    <Label htmlFor={tag} className="text-sm pl-2 font-medium leading-none">
                      {tag}
                    </Label>
                  </div>
                ))}
                </div>
              </FormControl>
              <FormDescription>
                Tags are used to match you with other users. You can change them at any time.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <div className='flex justify-center'>
          <Button type='submit'>Update Account</Button>
        </div>
      </form>
    </Form>
  );
}