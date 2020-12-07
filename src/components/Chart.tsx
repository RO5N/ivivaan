import { BarChart, Bar, XAxis, YAxis } from 'recharts';

interface Props {
  data: any;
}

const renderCustomBarLabel = ({ x, y, width, value }: any) => {
  return (
    <text
      x={x + width / 2}
      y={y}
      fill='#666'
      textAnchor='middle'
      dy={-6}
    >{`Count: ${value}`}</text>
  );
};

export default function RenderBarChart({ data }: Props) {
  return (
    <BarChart width={1200} height={300} data={data}>
      <XAxis dataKey='name' />
      <YAxis />
      <Bar
        dataKey='productCount'
        barSize={30}
        fill='#8884d8'
        label={renderCustomBarLabel}
      />
    </BarChart>
  );
}
