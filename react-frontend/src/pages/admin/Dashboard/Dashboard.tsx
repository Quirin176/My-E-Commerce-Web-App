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
import type { RecentOrder, TopProduct } from "../../../types/dto/AdminDashboardDTOs";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const [totalusers, setTotalUsers] = useState<Number>(0);
  const [totalOrders, setTotalOrders] = useState<Number>(0);
  const [totalSale, setTotalSale] = useState<Number>(0);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[] | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user !== null && user.role !== "Admin") return;

      try {
        setLoading(true);
        const res = await adminDashboardApi.getSummary();
        const summary = res.result;

        setTotalUsers(summary.totalUsers);
        setTotalOrders(summary.totalOrders);
        setTotalSale(summary.totalRevenue);
        setRecentOrders(summary.recentOrders);
        setTopProducts(summary.topProducts);
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

      {/* RECENT ORDERS */}
      <div className="rounded-2xl bg-gray-100 shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <RecentOrdersTable orders={recentOrders} />
      </div>

      {/* TOP PRODUCTS */}
      <div className="rounded-2xl bg-gray-100 shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Top Products</h2>
        <TopProductsTable topProducts={topProducts} />
      </div>

      {/* TOP PRODUCTS */}
      {/* <DashboardLineChart data={} /> */}
    </div>
  );
};
