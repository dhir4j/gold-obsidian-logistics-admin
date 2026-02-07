"use client"

import { useState } from 'react';
import { useApi, apiMutate } from '@/hooks/use-api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Plus, Trash2 } from 'lucide-react';
import type { BalanceCode } from '@/types';

export default function BalanceCodesPage() {
  const [status, setStatus] = useState<'active' | 'redeemed' | ''>('');
  const { data, isLoading, error, mutate } = useApi<BalanceCode[]>(
    `/admin/balance-codes${status ? `?status=${status}` : ''}`
  );

  const [amount, setAmount] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleCreate = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    try {
      setIsCreating(true);
      await apiMutate('/admin/balance-codes', {
        method: 'POST',
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });
      setAmount('');
      mutate();
    } catch (error) {
      console.error('Failed to create balance code:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id);
      await apiMutate(`/admin/balance-codes/${id}`, {
        method: 'DELETE',
      });
      mutate();
    } catch (error) {
      console.error('Failed to delete balance code:', error);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Balance Codes</h1>
          <p className="text-muted-foreground">Manage employee balance top-up codes</p>
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
        <p className="text-destructive text-lg font-semibold">Failed to load balance codes</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Balance Codes</h1>
          <p className="text-muted-foreground">
            {data?.length || 0} balance codes
          </p>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Label htmlFor="amount">Create New Balance Code</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount (₹)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
              />
              <Button onClick={handleCreate} disabled={isCreating || !amount}>
                <Plus className="h-4 w-4 mr-1" />
                Create
              </Button>
            </div>
          </div>

          <div className="flex items-end gap-2">
            <Button
              variant={status === '' ? 'default' : 'outline'}
              onClick={() => setStatus('')}
            >
              All
            </Button>
            <Button
              variant={status === 'active' ? 'default' : 'outline'}
              onClick={() => setStatus('active')}
            >
              Active
            </Button>
            <Button
              variant={status === 'redeemed' ? 'default' : 'outline'}
              onClick={() => setStatus('redeemed')}
            >
              Redeemed
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Redeemed By</TableHead>
                <TableHead>Redeemed Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.length > 0 ? (
                data.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell className="font-medium">{code.id}</TableCell>
                    <TableCell className="font-mono text-sm font-semibold">
                      {code.code}
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      ₹{code.amount.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={code.is_redeemed ? 'secondary' : 'success'}>
                        {code.is_redeemed ? 'Redeemed' : 'Active'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(code.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm">
                      {code.redeemed_by || '-'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {code.redeemed_at
                        ? new Date(code.redeemed_at).toLocaleDateString()
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {!code.is_redeemed && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(code.id)}
                          disabled={deletingId === code.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No balance codes found
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
