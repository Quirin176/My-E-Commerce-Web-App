
interface DashboardCardProp {
    title: string,
    value: string,
    icon?: React.ReactNode;
    onClick?: () => void;
}

export default function DashboardCard({ title, value, icon, onClick }: DashboardCardProp) {
  return (
    <div className="h-32 rounded-2xl bg-gray-100 p-4 flex flex-col justify-between">
      <div>
        <h1 className="text-gray-600">{title}</h1>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="flex justify-end">
        <button
          onClick={onClick}
          className="p-2 rounded-lg bg-blue-200 hover:bg-blue-400 transition"
        >
          {icon}
        </button>
      </div>
    </div>
  );
}