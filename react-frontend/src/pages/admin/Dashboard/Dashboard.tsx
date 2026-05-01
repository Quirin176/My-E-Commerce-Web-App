import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CircleDollarSign, Handbag, User2 } from "lucide-react";
import { useAuth } from "../../../hooks/auth/useAuth";
import { adminDashboardApi } from "../../../api/admin/adminDashboardApi";
import DashboardCard from "../../../components/Admin/Dashboards/DashboardCard";
import RecentOrdersTable from "../../../components/Admin/Dashboards/RecentOrdersTable";
import TopProductsTable from "../../../components/Admin/Dashboards/TopProductsTable";
import DashboardLineChart from "../../../components/Admin/Dashboards/DashboardLineChart";
import type { RecentOrder, TopProduct, LineChartPoints } from "../../../types/dto/AdminDashboardDTOs";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const [totalusers, setTotalUsers] = useState<Number>(0);
  const [totalOrders, setTotalOrders] = useState<Number>(0);
  const [totalSale, setTotalSale] = useState<Number>(0);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[] | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[] | null>(null);
  const [chartData, setChartData] = useState<LineChartPoints[] | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      if (user !== null && user.role !== "Admin") return;

      try {
        setLoading(true);
        const res = await adminDashboardApi.getSummary();

        setTotalUsers(res.totalUsers);
        setTotalOrders(res.totalOrders);
        setTotalSale(res.totalRevenue);
        setRecentOrders(res.recentOrders);
        setTopProducts(res.topProducts);
        setChartData(res.lineChartPoints);
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [])

  if (user?.role !== "Admin") {
  }

  return (
    <div className="flex flex-col w-full py-8 px-8 gap-y-8">

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total Revenue" value={`${totalSale?.toLocaleString("vi-VN")} VND`} icon={<CircleDollarSign />} />
        <DashboardCard title="Total Orders" value={totalOrders?.toLocaleString("vi-VN")} icon={<Handbag />} onClick={() => navigate("/admin/orders")} />
        <DashboardCard title="Total Users" value={totalusers?.toLocaleString("vi-VN")} icon={<User2 />} onClick={() => navigate("/admin/users")} />
      </div>

      <div className="flex flex-row w-full">
        {/* RECENT ORDERS */}
        <div className="rounded-2xl bg-gray-50 shadow p-6 w-1/2 mr-4">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <RecentOrdersTable orders={recentOrders} />
        </div>

        {/* TOP PRODUCTS */}
        <div className="rounded-2xl bg-gray-50 shadow p-6 w-1/2 ml-4">
          <h2 className="text-lg font-semibold mb-4">Top Products</h2>
          <TopProductsTable topProducts={topProducts} />
        </div>
      </div>

      {/* LINE CHART */}
      <DashboardLineChart data={chartData} />
    </div>
  );
};
