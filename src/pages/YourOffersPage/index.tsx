import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import OffersList from "./components/OfferList/OffersList";
import { AddOfferDialog } from "./components/AddOfferDialog";
import { useState } from "react";

export default function YourOffersPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen p-4 lg:p-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col space-y-1">
          <h1 className="text-lg font-semibold md:text-3xl">Your Offers</h1>
          <p className="text-md text-muted-foreground">
            Manage your offers here. Add, edit or delete them.
            </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="text-sm font-bold">Add Offer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Offer</DialogTitle>
              <DialogDescription>Add a new offer to start your tourism business.</DialogDescription>
            </DialogHeader>
            <AddOfferDialog closeModal={() => setIsOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <OffersList />
    </div>
  );
}
