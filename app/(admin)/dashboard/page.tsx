"use client"

import { useApi } from '@/hooks/use-api';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Package,
  TrendingUp,
  Users,
  DollarSign,
  UserCheck,
  Clock,
} from 'lucide-react';
import type { DashboardStats } from '@/types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area,
} from 'recharts';

const COLORS = ['#C5A059', '#3B82F6', '#22C55E', '#F97316', '#EF4444', '#8B5CF6'];

const STATUS_COLORS: Record<string, string> = {
  'Booked': '#C5A059',
  'In Transit': '#3B82F6',
  'Out for Delivery': '#F97316',
  'Delivered': '#22C55E',
  'Cancelled': '#EF4444',
  'Pending Payment': '#8B5CF6',
};

function formatMonth(month: string) {
  const [year, m] = month.split('-');
  const date = new Date(Number(year), Number(m) - 1);
  return date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
}

export default function DashboardPage() {
  const { data: stats, isLoading, error } = useApi<DashboardStats>('/admin/web_analytics');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your logistics operations</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-destructive">
          <p className="text-lg font-semibold">Failed to load dashboard</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  const revenueData = (stats?.revenue_over_time || []).map(item => ({
    ...item,
    label: formatMonth(item.month),
  }));

  const statusData = (stats?.shipments_by_status || []).map(item => ({
    ...item,
    fill: STATUS_COLORS[item.status] || '#6B7280',
  }));

  const serviceData = stats?.shipments_by_service || [];
  const destinationData = stats?.top_destinations || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your logistics operations</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Total Shipments"
          value={stats?.total_orders || 0}
          icon={Package}
          description="All time"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${(stats?.total_revenue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          icon={DollarSign}
          description="Total earnings"
        />
        <StatCard
          title="Avg. Revenue"
          value={`₹${(stats?.avg_revenue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          icon={TrendingUp}
          description="Per shipment"
        />
        <StatCard
          title="Customers"
          value={stats?.total_users || 0}
          icon={Users}
          description="Registered users"
        />
        <StatCard
          title="Employees"
          value={stats?.total_employees || 0}
          icon={UserCheck}
          description="Active staff"
        />
        <StatCard
          title="Pending Payments"
          value={stats?.pending_payments || 0}
          icon={Clock}
          description="Awaiting approval"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Revenue Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C5A059" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#C5A059" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="label" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" fontSize={12} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #C5A059', borderRadius: '8px' }}
                    labelStyle={{ color: '#C5A059' }}
                    formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#C5A059" fill="url(#revenueGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">No revenue data available</div>
            )}
          </CardContent>
        </Card>

        {/* Shipments by Status (Pie Chart) */}
        <Card>
          <CardHeader>
            <CardTitle>Shipments by Status</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="status"
                    label={({ status, count }) => `${status}: ${count}`}
                    labelLine={false}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #C5A059', borderRadius: '8px' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">No status data available</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Orders Over Time (Bar) */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="label" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #C5A059', borderRadius: '8px' }}
                    labelStyle={{ color: '#C5A059' }}
                  />
                  <Bar dataKey="orders" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">No order data available</div>
            )}
          </CardContent>
        </Card>

        {/* Top Destinations */}
        <Card>
          <CardHeader>
            <CardTitle>Top Destinations</CardTitle>
          </CardHeader>
          <CardContent>
            {destinationData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={destinationData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis type="number" stroke="#888" fontSize={12} />
                  <YAxis dataKey="city" type="category" stroke="#888" fontSize={12} width={100} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #C5A059', borderRadius: '8px' }}
                    labelStyle={{ color: '#C5A059' }}
                  />
                  <Bar dataKey="count" fill="#C5A059" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">No destination data available</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Shipments & Service Type Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Shipments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(stats?.recent_shipments || []).length > 0 ? (
                stats!.recent_shipments.map((shipment) => (
                  <div key={shipment.shipment_id_str} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium font-mono text-sm">{shipment.shipment_id_str}</p>
                      <p className="text-sm text-muted-foreground">
                        {shipment.receiver_name} &middot; {shipment.receiver_city}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: `${STATUS_COLORS[shipment.status] || '#6B7280'}20`,
                          color: STATUS_COLORS[shipment.status] || '#6B7280',
                        }}
                      >
                        {shipment.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        ₹{shipment.total.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No recent shipments</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Service Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Shipments by Service Type</CardTitle>
          </CardHeader>
          <CardContent>
            {serviceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="service"
                    label={({ service, count }) => `${service}: ${count}`}
                    labelLine={false}
                  >
                    {serviceData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #C5A059', borderRadius: '8px' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">No service data available</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
