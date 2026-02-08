"use client"

import { useApi } from '@/hooks/use-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Mail, Phone, Calendar, Package, CreditCard } from 'lucide-react';
import type { UserDetailResponse } from '@/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  'Pending Payment': 'outline',
  'Booked': 'default',
  'In Transit': 'secondary',
  'Out for Delivery': 'default',
  'Delivered': 'default',
  'Cancelled': 'destructive',
};

const paymentStatusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  'Pending': 'outline',
  'Approved': 'default',
  'Rejected': 'destructive',
};

export default function CustomerDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, error } = useApi<UserDetailResponse>(
    `/admin/users/${id}`
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-destructive text-lg font-semibold">Failed to load customer</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <Link href="/customers" className="mt-4">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Customers
          </Button>
        </Link>
      </div>
    );
  }

  if (!data) return null;

  const { user, shipments, payments } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/customers">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">
            {user.first_name} {user.last_name}
          </h1>
          <p className="text-muted-foreground">Customer #{user.id}</p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{user.email}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4" />
              Total Shipments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{shipments?.length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Member Since
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {new Date(user.created_at).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Shipments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Shipments ({shipments?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {shipments && shipments.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shipment ID</TableHead>
                    <TableHead>Receiver</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipments.map((shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell className="font-mono text-sm">
                        {shipment.shipment_id_str}
                      </TableCell>
                      <TableCell>{shipment.receiver_name}</TableCell>
                      <TableCell>{shipment.receiver_address_city}</TableCell>
                      <TableCell>{shipment.service_type}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(shipment.booking_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₹{shipment.total_with_tax_18_percent?.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[shipment.status] || 'default'}>
                          {shipment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No shipments found</p>
          )}
        </CardContent>
      </Card>

      {/* Payments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Requests ({payments?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payments && payments.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Shipment</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>UTR</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.id}</TableCell>
                      <TableCell className="font-mono text-sm">{payment.order_id}</TableCell>
                      <TableCell className="font-semibold">
                        ₹{payment.amount?.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{payment.utr}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={paymentStatusVariant[payment.status] || 'default'}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No payment requests found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
