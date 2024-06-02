import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Legend, CartesianGrid, Tooltip } from 'recharts';
import { dmoMonitorService } from '@/services/Client/MonitorService';
import { useUserStore } from '@/stores/useUserStore';
import { useQuery } from '@tanstack/react-query';

export function Overview() {
  const { scopes } = useUserStore();

  const getOffersByTags = async () => {
    if (scopes.includes('dmo')) {
      return (await dmoMonitorService.getNumberOfOffersByTag()).data;
    } else {
      console.log("Future Work");
      return [];
    }
  }

  const { data: offersByTags, isLoading } = useQuery<any>({
    queryKey: ['offersByTags'],
    queryFn: getOffersByTags,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Transformar os dados recebidos da API para o formato necessário pelo Recharts
  const data = offersByTags.map((offer: { _id: string, num: number }) => ({
    type: offer._id,
    offers: offer.num,
  }));

  return (
    <div className="flex flex-col items-center w-full">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value} offers`} />
          <Tooltip />
          <Bar dataKey="offers" fill="currentColor" className='fill-primary' barSize={30} radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
