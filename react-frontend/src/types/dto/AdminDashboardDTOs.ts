import type { Product } from "../models/products/Product";

export interface RecentOrder {
  id: number;
  customerName: string;
  totalAmount: number;
  status: string;
}

export interface TopSellingProduct {
  productId: number;
  productName: string;
  unitPrice: number;
  totalQuantity: number;
  totalRevenue: number;
}

export interface LineChartPoints {
  date: Date;
  orderCount: number;
  totalRevenue: number;
}

export interface DashboardSummary {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: RecentOrder[];
  topsellingProducts: TopSellingProduct[];
  topNewestProducts: Product[];
  lineChartPoints: LineChartPoints[];
}