import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CircleDollarSign, Handbag, ShoppingBag, User2 } from "lucide-react";
import { useAuth } from "../../../hooks/auth/useAuth";
import { adminDashboardApi } from "../../../api/admin/adminDashboardApi";
import DashboardCard from "../../../components/admin/dashboard/DashboardCard";
import RecentOrdersTable from "../../../components/admin/dashboard/RecentOrdersTable";
import TopSellingProductsTable from "../../../components/admin/dashboard/TopSellingProductsTable";
import TopNewestProductsTable from "../../../components/admin/dashboard/TopNewestProductsTable";
import DashboardLineChart from "../../../components/admin/dashboard/DashboardLineChart";
import LoadingState from "../../../components/pageState/LoadingState";
import type { RecentOrder, TopSellingProduct, LineChartPoints } from "../../../types/dto/AdminDashboardDTOs";
import type { Product } from "../../../types/models/products/Product";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const [totalusers, setTotalUsers] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalSale, setTotalSale] = useState<number>(0);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[] | null>(null);
  const [topSellingProducts, setTopSellingProducts] = useState<TopSellingProduct[] | null>(null);
  const [topNewestProducts, setTopNewestProducts] = useState<Product[] | null>(null);
  const [chartData, setChartData] = useState<LineChartPoints[] | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      if (user !== null && user.role !== "Admin") return;

      try {
        setLoading(true);
        const res = await adminDashboardApi.getSummary(10, 10, 10);

        setTotalUsers(res.totalUsers);
        setTotalOrders(res.totalOrders);
        setTotalSale(res.totalRevenue);
        setTotalProducts(res.totalProducts);
        setRecentOrders(res.recentOrders);
        setTopNewestProducts(res.topNewestProducts);
        setTopSellingProducts(res.topSellingProducts);
        setChartData(res.lineChartPoints);
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user])

  if (loading)
    return (
      <LoadingState
        message="Loading Dashboard..."
        subMessage="Please wait while we fetch the dashboard's data."
      />
    );

  return (
    <div className="flex flex-col w-full py-8 px-8 gap-y-8 bg-(--bg-muted)">

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl bg-(--bg-surface) shadow p-6">
          <DashboardCard title="Total Revenue" value={`${totalSale?.toLocaleString("vi-VN")} VND`} icon={<CircleDollarSign />} />
        </div>

        <div className="rounded-2xl bg-(--bg-surface) shadow p-6">
          <DashboardCard title="Total Orders" value={totalOrders?.toLocaleString("vi-VN")} icon={<Handbag />} link={"/admin/orders"} />
        </div>

        <div className="rounded-2xl bg-(--bg-surface) shadow p-6">
          <DashboardCard title="Total Users" value={totalusers?.toLocaleString("vi-VN")} icon={<User2 />} link={"/admin/users"} />
        </div>

        <div className="rounded-2xl bg-(--bg-surface) shadow p-6">
          <DashboardCard title="Total Products" value={totalProducts?.toLocaleString("vi-VN")} icon={<ShoppingBag />} link={"/admin/products"} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* RECENT ORDERS */}
        <div className="rounded-2xl bg-(--bg-surface) shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>

          <RecentOrdersTable orders={recentOrders} />
        </div>

        {/* LINE CHART */}
        <DashboardLineChart data={chartData} />

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* TOP PRODUCTS */}
        <div className="rounded-2xl bg-(--bg-surface) shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Top 10 Selling Products</h2>

          <TopSellingProductsTable topProducts={topSellingProducts} />
        </div>

        <div className="rounded-2xl bg-(--bg-surface) shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Top 10 Newest Products</h2>

          <TopNewestProductsTable topProducts={topNewestProducts} />
        </div>
      </div>

    </div>
  );
};
