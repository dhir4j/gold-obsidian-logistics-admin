"use client"

import { useState } from 'react';
import { useApi, apiMutate } from '@/hooks/use-api';
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
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  User,
  Calendar,
  Weight,
  Ruler,
  CreditCard,
  History,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { Shipment } from '@/types';

const STATUS_COLORS: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  'Pending Payment': 'warning',
  'Booked': 'default',
  'In Transit': 'secondary',
  'Out for Delivery': 'default',
  'Delivered': 'success',
  'Cancelled': 'destructive',
};

const VALID_STATUSES = ['Booked', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled'];

interface ShipmentDetail extends Omit<Shipment, 'user_type'> {
  user_email: string;
  user_type: string;
  payment_utr: string | null;
}

export default function ShipmentDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: shipment, isLoading, error, mutate } = useApi<ShipmentDetail>(
    `/admin/shipments/${id}`
  );

  const [newStatus, setNewStatus] = useState('');
  const [location, setLocation] = useState('');
  const [activity, setActivity] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');

  const handleStatusUpdate = async () => {
    if (!newStatus) return;
    setUpdating(true);
    setUpdateError('');
    try {
      await apiMutate(`/admin/shipments/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus, location, activity }),
      });
      setNewStatus('');
      setLocation('');
      setActivity('');
      mutate();
    } catch (e: any) {
      setUpdateError(e.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-destructive text-lg font-semibold">Failed to load shipment</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <Link href="/shipments" className="mt-4">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shipments
          </Button>
        </Link>
      </div>
    );
  }

  if (!shipment) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/shipments">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold font-mono">{shipment.shipment_id_str}</h1>
          <p className="text-muted-foreground text-sm">{shipment.service_type}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{shipment.user_type}</Badge>
          <Badge variant={STATUS_COLORS[shipment.status] || 'default'}>{shipment.status}</Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Booking Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{new Date(shipment.booking_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Weight className="h-4 w-4" />
              Weight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{shipment.package_weight_kg} kg</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              Dimensions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-sm">{shipment.package_length_cm} × {shipment.package_width_cm} × {shipment.package_height_cm} cm</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Total Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">₹{shipment.total_with_tax_18_percent.toLocaleString('en-IN')}</p>
            <p className="text-xs text-muted-foreground">incl. 18% GST</p>
          </CardContent>
        </Card>
      </div>

      {/* Sender / Receiver */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" />
              Sender
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-semibold text-base">{shipment.sender_name}</p>
            <p className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              {shipment.sender_address_street}, {shipment.sender_address_city}, {shipment.sender_address_state} — {shipment.sender_address_pincode}, {shipment.sender_address_country}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              {shipment.sender_phone}
            </p>
            <p className="text-muted-foreground">{shipment.user_email} <Badge variant="outline" className="ml-1 text-xs">{shipment.user_type}</Badge></p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="h-4 w-4" />
              Receiver
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-semibold text-base">{shipment.receiver_name}</p>
            <p className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              {shipment.receiver_address_street}, {shipment.receiver_address_city}, {shipment.receiver_address_state} — {shipment.receiver_address_pincode}, {shipment.receiver_address_country}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              {shipment.receiver_phone}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment & Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="h-4 w-4" />
            Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-4 text-sm">
            <div>
              <p className="text-muted-foreground">Base Price</p>
              <p className="font-semibold">₹{shipment.price_without_tax.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-muted-foreground">GST (18%)</p>
              <p className="font-semibold">₹{shipment.tax_amount_18_percent.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total</p>
              <p className="font-semibold">₹{shipment.total_with_tax_18_percent.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Payment Status</p>
              <div className="flex items-center gap-2">
                <Badge variant={shipment.payment_status === 'Approved' ? 'success' : shipment.payment_status === 'Rejected' ? 'destructive' : 'outline'}>
                  {shipment.payment_status || 'None'}
                </Badge>
                {shipment.payment_utr && (
                  <span className="text-xs text-muted-foreground font-mono">{shipment.payment_utr}</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goods */}
      {shipment.goods_details && shipment.goods_details.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Goods Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Value (₹)</TableHead>
                    <TableHead>HSN Code</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipment.goods_details.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₹{item.value.toLocaleString('en-IN')}</TableCell>
                      <TableCell className="font-mono text-sm">{item.hsn_code}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Update Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Update Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-3">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Select new status</option>
              {VALID_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <Input
              placeholder="Location (optional)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Input
              placeholder="Activity note (optional)"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
            />
          </div>
          {updateError && <p className="text-sm text-destructive">{updateError}</p>}
          <Button onClick={handleStatusUpdate} disabled={!newStatus || updating}>
            {updating ? 'Updating...' : 'Update Status'}
          </Button>
        </CardContent>
      </Card>

      {/* Tracking History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-4 w-4" />
            Tracking History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {shipment.tracking_history && shipment.tracking_history.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stage</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...shipment.tracking_history].reverse().map((entry, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Badge variant={STATUS_COLORS[entry.stage || (entry as any).status] || 'default'}>
                          {entry.stage || (entry as any).status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(entry.date).toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell>{entry.location || '—'}</TableCell>
                      <TableCell>{entry.activity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-6">No tracking history yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
