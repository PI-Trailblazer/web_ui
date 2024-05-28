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

interface CombinedOffer extends OfferDetailsProps, Payment {
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

export default function BuyHistoryPage() {
  const [sort, setSort] = useState('ascending')
  const [searchTerm, setSearchTerm] = useState('')
  const [tags, setTags] = useState("alltags")
  const [offersIDs, setOffersIDs] = useState<number[]>([])
  const [combinedOffers, setCombinedOffers] = useState<CombinedOffer[]>([]);

  // Get all the accounts
  const getPayments = async () => {
    const response = await PaymentService.getTransactionsByUser();
    return response.data;
  }

  const { data: payHistory, isLoading, isSuccess } = useQuery<Payment[], Error>({
    queryKey: ['payments'],
    queryFn: getPayments
  });

  useEffect(() => {
    if (isSuccess) {
      const ids = payHistory?.map((payment) => payment.offer_id);
      setOffersIDs(ids);
    }
  }, [isSuccess, payHistory])

  const getOfferById = async (id: number) => {
    return (await OfferService.getOffer(id)).data;
  }

  const results = useQueries({
    queries: offersIDs.map((id) => ({
      queryKey: ['offer', id],
      queryFn: () => getOfferById(id),
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
    if (results.every(result => result.isSuccess) && imagesResults.every(result => result.isSuccess) && payHistory) {
      const offers = results.map((result, index) => ({
        ...result.data,
        ...payHistory[index],
        image: imagesResults[index].data[0]?.image || '', // Assuming the first image is the desired one
      })) as CombinedOffer[];
      setCombinedOffers(offers);
    }
  }, [results, imagesResults, isSuccess, payHistory]);

  console.log(combinedOffers);

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
            Transition's History
          </h1>
          <p className='text-muted-foreground'>
            Here&apos;s a list of all the transactions you&apos;ve made.
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
          {isSuccess && filteredOffers?.map((offer) => (
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
                    <div>
                      <span className={`h-3 w-3 rounded-full translate-x-[540px] -translate-y-16 absolute animate-glow ${offer.status === 'completed' ? 'bg-green-500 shadow-green' : 'bg-yellow-500 shadow-yellow'}`} />
                    </div>
                    <div className="absolute bottom-4 right-4 text-white text-right">
                      <h2 className="text-lg font-bold">{offer.name}</h2>
                      <p className="text-sm">
                        {new Date(offer.timestamp).toLocaleDateString()} - {new Date(offer.timestamp).toLocaleTimeString()}
                      </p>
                      <p className="text-sm">
                        {offer.quantity} items reserved for approximately €{offer.amount}
                      </p>
                      <p className="text-sm">
                        Status: {offer.status}
                      </p>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent>
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-4">{offer.name}</h2>
                  <p className="mb-2"><strong>Description:</strong> {offer.description}</p>
                  <p className="mb-2"><strong>Location:</strong> {offer.street}, {offer.city}, {offer.postal_code}</p>
                  <p className="mb-2"><strong>Price:</strong> €{offer.price}</p>
                  <p className="mb-2"><strong>Discount:</strong> {offer.discount}%</p>
                  <p className="mb-2"><strong>Tags:</strong> {offer.tags.join(', ')}</p>
                  <p className="mb-2"><strong>Reviews:</strong> {offer.n_reviews}</p>
                  <p className="mb-2"><strong>Max Review Score:</strong> {offer.max_review_score}</p>
                  <p className="mb-2"><strong>Nationality:</strong> {offer.nationality}</p>
                  <p className="mb-2"><strong>Amount:</strong> €{offer.amount}</p>
                  <p className="mb-2"><strong>Quantity:</strong> {offer.quantity}</p>
                  <p className="mb-2"><strong>Status:</strong> {offer.status}</p>
                  <p className="mb-2"><strong>Purchased on:</strong> {new Date(offer.timestamp).toLocaleString()}</p>
                  <Link to={`/offer/${encodeId(offer.offer_id)}`} className="mt-4 flex flex-row justify-center">
                    <Button className='w-full'>See Offer</Button>
                  </Link>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
        {isSuccess && filteredOffers.length === 0 && (
            <div className='text-center justify-center flex text-muted-foreground'>
              <p className='text-2xl'>No transactions found.</p>
            </div>
          )}
      </LayoutBody>
    </Layout>
  )
}
