import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Legend, CartesianGrid, Tooltip } from 'recharts';

const offerTypes = [
  "Accommodation", "Sports", "Adventure", "Food", "Wellness", "Transportation", "Culture", "Drinks", "Café", "Games"
];

// Gerar dados fictícios para cada tipo de oferta
const data = offerTypes.map(type => ({
  type,
  // valores fictícios entre 20 e 100
  offers: Math.floor(Math.random() * 80) + 20
}));

export function Overview() {
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
