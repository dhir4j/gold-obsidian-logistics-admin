"use client"

import { useState } from 'react';
import { useApi, apiMutate } from '@/hooks/use-api';
import { Card } from '@/components/ui/card';
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
import { Check, X } from 'lucide-react';
import type { PaymentRequest } from '@/types';

export default function PaymentsPage() {
  const { data, isLoading, error, mutate } = useApi<PaymentRequest[]>('/admin/payments');
  const [processingId, setProcessingId] = useState<number | null>(null);

  const handleApprove = async (paymentId: number) => {
    try {
      setProcessingId(paymentId);
      await apiMutate(`/admin/payments/${paymentId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'Approved' }),
      });
      mutate();
    } catch (error) {
      console.error('Failed to approve payment:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (paymentId: number) => {
    try {
      setProcessingId(paymentId);
      await apiMutate(`/admin/payments/${paymentId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'Rejected' }),
      });
      mutate();
    } catch (error) {
      console.error('Failed to reject payment:', error);
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Payment Requests</h1>
          <p className="text-muted-foreground">Review and approve payments</p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-destructive text-lg font-semibold">Failed to load payments</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payment Requests</h1>
          <p className="text-muted-foreground">
            {data?.length || 0} payment requests
          </p>
        </div>
      </div>

      <Card className="p-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Shipment ID</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>UTR Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.length > 0 ? (
                data.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell className="font-mono text-sm">{payment.order_id}</TableCell>
                    <TableCell>
                      {payment.first_name} {payment.last_name}
                    </TableCell>
                    <TableCell className="font-semibold">
                      ₹{payment.amount.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{payment.utr}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          payment.status === 'Approved'
                            ? 'success'
                            : payment.status === 'Rejected'
                            ? 'destructive'
                            : 'warning'
                        }
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {payment.status === 'Pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprove(payment.id)}
                            disabled={processingId === payment.id}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(payment.id)}
                            disabled={processingId === payment.id}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No payment requests found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
