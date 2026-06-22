import { Link } from "react-router-dom";

interface DashboardCardProp {
  title: string,
  value: string,
  icon?: React.ReactNode;
  link?: string;
}

export default function DashboardCard({ title, value, icon, link }: DashboardCardProp) {
  return (
    <div className="w-full h-full rounded-2xl p-4 flex flex-col justify-between">
      <div>
        <h1>{title}</h1>
        <p className="text-2xl font-bold">{value}</p>
      </div>

      <div className="flex justify-end">
        {link ? (
          <Link
            to={link}
            className="p-2 rounded-lg text-white bg-(--brand-primary) hover:bg-(--brand-secondary) transition cursor-pointer"
          >
            {icon}
          </Link>) : (
          <button className="p-2 rounded-lg text-white bg-(--brand-primary) hover:bg-(--brand-secondary) transition cursor-pointer"
          >
            {icon}
          </button>)}
      </div>
    </div>
  );
}