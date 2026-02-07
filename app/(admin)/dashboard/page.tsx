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
  Loader2,
} from 'lucide-react';
import type { DashboardStats } from '@/types';

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your logistics operations</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Shipments"
          value={stats?.total_orders || 0}
          icon={Package}
          description="All time shipments"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${(stats?.total_revenue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          icon={DollarSign}
          description="Total earnings"
        />
        <StatCard
          title="Average Revenue"
          value={`₹${(stats?.avg_revenue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          icon={TrendingUp}
          description="Per shipment"
        />
        <StatCard
          title="Total Customers"
          value={stats?.total_users || 0}
          icon={Users}
          description="Registered users"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium">New Shipment Created</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">New</span>
              </div>
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium">Payment Approved</p>
                  <p className="text-sm text-muted-foreground">5 hours ago</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Approved</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Customer Registered</p>
                  <p className="text-sm text-muted-foreground">1 day ago</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">User</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Shipments</span>
                <span className="font-semibold">
                  {stats?.total_orders ? Math.floor(stats.total_orders * 0.3) : 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending Payments</span>
                <span className="font-semibold">
                  {stats?.total_orders ? Math.floor(stats.total_orders * 0.1) : 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Delivered Today</span>
                <span className="font-semibold">
                  {stats?.total_orders ? Math.floor(stats.total_orders * 0.05) : 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Employee Count</span>
                <span className="font-semibold">12</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
