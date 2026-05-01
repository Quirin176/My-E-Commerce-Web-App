export interface RecentOrder {
  id: number;
  customerName: string;
  totalAmount: number;
  status: string;
}

export interface TopProduct {
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
  topProducts: TopProduct[];
  lineChartPoints: LineChartPoints[];
}