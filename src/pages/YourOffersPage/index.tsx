import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import OffersList from "./components/OfferList/OffersList";
import { AddOfferDialog } from "./components/AddOfferDialog";

export default function YourOffersPage() {
  return (
    <div className="flex flex-col min-h-screen p-4 lg:p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Your Offers</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Offer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Offer</DialogTitle>
              <DialogDescription>Add a new offer to start your tourism business.</DialogDescription>
            </DialogHeader>
            <AddOfferDialog />
          </DialogContent>
        </Dialog>
      </div>
      <OffersList />
    </div>
  );
}
