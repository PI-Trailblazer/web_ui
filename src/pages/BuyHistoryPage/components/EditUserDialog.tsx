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
import { Label } from '@/components/ui/label'
import { accountEditSchema, AccountEditFormValues } from './schema'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { User } from '@/utils/types'

type EditUserDialogProps = {
  user: User
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function EditUserDialog({ user, isOpen, setIsOpen }: EditUserDialogProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<AccountEditFormValues>({
    resolver: zodResolver(accountEditSchema),
    defaultValues: {
      email: user.email,
      name: user.name,
      phone: user.phone,
      password: '',
    },
  })

  function onSubmit(data: AccountEditFormValues) {
    console.log(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogHeader>
        <Button>Edit</Button>
      </DialogHeader>
      <DialogContent>
        sadad
      </DialogContent>
    </Dialog>
  )
}
