import { useEffect, useState } from 'react'
import {
  IconAdjustmentsHorizontal,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
} from '@tabler/icons-react'
import { Layout, LayoutBody } from '@/components/custom/layout'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// query
import { useQuery, useQueries } from '@tanstack/react-query';
import { PaymentService } from '@/services/Client/PaymentService';
import { OfferService } from '@/services/Client/OfferService'
import { OfferDetailsProps, Payment } from '@/lib/types'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { encodeId } from '@/lib/utils'
import OfferTransactions from './components/OfferTransactions';

interface CombinedOffer extends OfferDetailsProps, Payment {
  payments: Payment[]
  image: string;
}

const tagsText = new Map<string, string>([
  ['alltags', 'AllTags'],
  ['accomodation', 'Accomodation'],
  ['sports', 'Sports'],
  ['adventure', 'Adventure'],
  ['food', 'Food'],
  ['wellness', 'Wellness'],
  ['transportation', 'Transportation'],
  ['culture', 'Culture'],
  ['drinks', 'Drinks'],
  ['café', 'Café'],
  ['games', 'Games'],
])

export default function YourOffersTransactionsPage() {
  const [sort, setSort] = useState('ascending')
  const [searchTerm, setSearchTerm] = useState('')
  const [tags, setTags] = useState("alltags")
  const [offersIDs, setOffersIDs] = useState<number[]>([])
  const [combinedOffers, setCombinedOffers] = useState<CombinedOffer[]>([]);


  //get all user's offers
  const getAllOffersForUser = async () => {
    return (await OfferService.getOffersByUser()).data;
  }

    const { data: allOffers, isLoading: offersLoading, isSuccess: offersSuccess } = useQuery<OfferDetailsProps[]>({
        queryKey: ['allOffers'],
        queryFn: getAllOffersForUser,
    });

    useEffect(() => {
        if (offersSuccess) {
            const ids = allOffers?.map((offer) => offer.id);
            setOffersIDs(ids);
        }
    }, [offersSuccess, allOffers])

  const getPaymentsByOfferId = async (offerId: number) => {
    return (await PaymentService.getTransactionsByOffer(offerId)).data;
  }

  const results = useQueries({
    queries: offersIDs.map((id) => ({
      queryKey: ['payment', id],
      queryFn: () => getPaymentsByOfferId(id),
      staleTime: Infinity,
    })),
  })

  // fetching offers images
  const fetchImages = async (id: number) => {
    return (await OfferService.getImages(id)).data;
  };

  const imagesResults = useQueries({
    queries: offersIDs.map((id) => ({
      queryKey: ['images', id],
      queryFn: () => fetchImages(id),
      staleTime: Infinity,
    })),
  })

  useEffect(() => {
    if (combinedOffers.length > 0 && combinedOffers.every(value => value !== undefined)) {
      return;
    }
    if (results.every(result => result.isSuccess) && imagesResults.every(result => result.isSuccess) && allOffers) {
      const offers = results.map((result, index) => ({
        payments: result.data,
        ...allOffers[index],
        image: imagesResults[index].data[0]?.image || '', // Assuming the first image is the desired one
      })) as unknown as CombinedOffer[];
      setCombinedOffers(offers);
    }
  }, [results, imagesResults, offersSuccess, allOffers]);

  console.log('combinedOffers', combinedOffers);

  const filteredOffers = combinedOffers
    .sort((a, b) =>
      sort === 'ascending'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    )
    .filter((offer) => offer.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((offer) => tags === 'alltags' || offer.tags.includes(tagsText.get(tags)!));

  return (
    <Layout fadedBelow fixedHeight>
      {/* ===== Content ===== */}
      <LayoutBody className='flex flex-col' fixedHeight>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            My Offer's Transactions
          </h1>
          <p className='text-muted-foreground'>
            View all transactions made on your offers.
          </p>
        </div>
        <div className='my-4 flex items-end justify-between sm:my-0 sm:items-center'>
          <div className='flex flex-col gap-4 sm:my-4 sm:flex-row'>
            <Input
              placeholder='Filter offers...'
              className='h-9 w-40 lg:w-[250px]'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={tags} onValueChange={setTags}>
              <SelectTrigger className='w-36'>
                <SelectValue>
                  {tagsText.get(tags)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Array.from(tagsText).map(([key, value]) => (
                  <SelectItem value={key} key={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className='w-16'>
              <SelectValue>
                <IconAdjustmentsHorizontal size={18} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent align='end'>
              <SelectItem value='ascending'>
                <div className='flex items-center gap-4'>
                  <IconSortAscendingLetters size={16} />
                  <span>Ascending</span>
                </div>
              </SelectItem>
              <SelectItem value='descending'>
                <div className='flex items-center gap-4'>
                  <IconSortDescendingLetters size={16} />
                  <span>Descending</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator className='shadow' />
        <div className='no-scrollbar grid gap-4 overflow-y-scroll pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3'>
          {offersSuccess && filteredOffers?.map((offer) => (
            <Dialog key={offer.id}>
              <DialogTrigger>
                <div
                  className='rounded-lg relative border hover:shadow-md transform ease-in-out duration-300 cursor-pointer hover:brightness-75'
                >
                  <div className='flex relative w-full h-[200px] items-center justify-between'>
                    <img
                      src={offer.image}
                      alt={offer.name}
                      className="absolute inset-0 w-full rounded-lg brightness-50 border h-full object-cover"
                    />
                    <div className="absolute bottom-4 right-4 text-white text-right">
                      <h2 className="text-lg font-bold">{offer.name}</h2>
                      <p className="text-sm">
                        {offer.street}, {offer.city}, {offer.postal_code}
                      </p>
                      <p className="text-sm">
                        Price: €{offer.price} - Discount: {offer.discount}%
                      </p>
                      <p className="text-sm">
                        {offer.tags.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{offer.name}</DialogTitle>
                  <DialogDescription>
                    All transactions made on this offer.
                  </DialogDescription>
                </DialogHeader>
                <div className='space-y-2 overflow-y-auto h-96 pr-2'>
                  <OfferTransactions payments={offer.payments} />
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
        {offersSuccess && filteredOffers.length === 0 && (
            <div className='text-center justify-center flex text-muted-foreground'>
              <p className='text-2xl'>No transactions found.</p>
            </div>
          )}
      </LayoutBody>
    </Layout>
  )
}
