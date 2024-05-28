import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { User } from '@/utils/types';
import { useMutation , useQueryClient} from '@tanstack/react-query';
import { UserService } from "@/services/Client/UserService";
import EditUserDialog from "./EditUserDialog";
import { useState } from "react";

interface AccountDialogProps {
    account: User | null;
}

const AccountDialog: React.FC<AccountDialogProps> = ({ account }) => {

    if (!account) return null;

    const [isOpen, setIsOpen] = useState(false);

    const handleDialogClose = () => {
        setIsOpen(false);
    }

    const handleDialogOpen = () => {
        setIsOpen(true);
    }

    const queryClient = useQueryClient();

    const deleteAccount = async () => {
        const response = await UserService.deleteUser(account.id.toString());
        return response.data;
    }

    const deleteMutation = useMutation({
        mutationFn: deleteAccount,
        onSuccess: () => {
            queryClient.invalidateQueries('users');
        },

    })

    return (
        <>
            <DialogContent className="max-w-md mx-auto p-6 rounded-lg shadow-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Account Number: {account.id}</DialogTitle>
                </DialogHeader>
                <DialogDescription className="mt-4">
                    <div className="space-y-2 text-lg">
                        <p><strong>Name:</strong> {account.name}</p>
                        <p><strong>Email:</strong> {account.email}</p>
                        <p><strong>Phone:</strong> {account.phone}</p>
                        <p><strong>Roles:</strong> {account.roles.join(', ')}</p>
                    </div>
                    <div className='flex pt-6 flex-row justify-center space-x-12'>
                        <Button variant={'outline'} onClick={handleDialogOpen}>Edit</Button>
                        <Button variant={'destructive'} onClick={() => deleteMutation.mutate()}>Delete</Button>
                    </div>
                </DialogDescription>
            </DialogContent>
            <EditUserDialog user={account} isOpen={isOpen} setIsOpen={handleDialogClose} />
        </>
    );
}

export default AccountDialog;
