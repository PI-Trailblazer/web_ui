import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface DeleteOfferProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onDelete: () => void;
    isPending: boolean;
}

export default function DeleteOffer( { isOpen, setIsOpen, onDelete, isPending }: DeleteOfferProps ) {

    const handleDeleteOffer = () => {
        console.log('Deletar oferta');
        onDelete();
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Offer</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Are you sure you want to delete this offer?
                </DialogDescription>
                <div className="flex justify-end gap-4 mt-4">
                    <Button onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteOffer} variant="destructive">
                        {isPending ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}