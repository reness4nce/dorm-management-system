
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ReportChartProps {
  type: "checkouts" | "clearance" | "residents";
}

// Sample data - in a real app, this would come from your backend
const data = [
  { name: 'Jan', value: 12 },
  { name: 'Feb', value: 19 },
  { name: 'Mar', value: 15 },
  { name: 'Apr', value: 22 },
  { name: 'May', value: 26 },
  { name: 'Jun', value: 25 },
];

export const ReportChart = ({ type }: ReportChartProps) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
