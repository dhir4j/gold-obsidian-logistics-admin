"use client"

import { useState } from 'react';
import { useApi, apiMutate } from '@/hooks/use-api';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { Search } from 'lucide-react';
import type { ShipmentsResponse } from '@/types';
import Link from 'next/link';

const STATUS_COLORS: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  'Pending Payment': 'warning',
  'Booked': 'default',
  'In Transit': 'secondary',
  'Out for Delivery': 'default',
  'Delivered': 'success',
  'Cancelled': 'destructive',
};

const VALID_STATUSES = ['Booked', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled'];

export default function ShipmentsPage() {
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkStatus, setBulkStatus] = useState('');
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [bulkError, setBulkError] = useState('');
  const [bulkSuccess, setBulkSuccess] = useState('');

  const { data, isLoading, error, mutate } = useApi<ShipmentsResponse>(
    `/admin/shipments?page=1&limit=9999${search ? `&q=${search}` : ''}`
  );

  const handleSearch = () => {
    setSearch(searchInput);
    setSelectedIds([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const shipments = data?.shipments || [];

  const allIds = shipments.map((s) => s.id);
  const allSelected = allIds.length > 0 && selectedIds.length === allIds.length;

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : allIds);
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkUpdate = async () => {
    if (!bulkStatus || selectedIds.length === 0) return;
    setBulkUpdating(true);
    setBulkError('');
    setBulkSuccess('');
    try {
      await apiMutate('/admin/shipments/bulk-status-update', {
        method: 'POST',
        body: JSON.stringify({ shipment_ids: selectedIds, status: bulkStatus }),
      });
      setBulkSuccess(`Updated ${selectedIds.length} shipment(s) to "${bulkStatus}"`);
      setSelectedIds([]);
      setBulkStatus('');
      mutate();
    } catch (e: any) {
      setBulkError(e.message || 'Bulk update failed');
    } finally {
      setBulkUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Shipments</h1>
          <p className="text-muted-foreground">Manage all shipments</p>
        </div>
        <Card className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 flex-1" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-destructive text-lg font-semibold">Failed to load shipments</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shipments</h1>
          <p className="text-muted-foreground">{data?.totalCount || 0} total shipments</p>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by shipment ID, sender, receiver, or email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3 mb-4 p-3 rounded-md bg-muted border">
            <span className="text-sm font-medium">{selectedIds.length} selected</span>
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Set status...</option>
              {VALID_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <Button
              size="sm"
              onClick={handleBulkUpdate}
              disabled={!bulkStatus || bulkUpdating}
            >
              {bulkUpdating ? 'Updating...' : 'Apply'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => { setSelectedIds([]); setBulkStatus(''); setBulkError(''); setBulkSuccess(''); }}
            >
              Clear
            </Button>
            {bulkError && <span className="text-sm text-destructive">{bulkError}</span>}
            {bulkSuccess && <span className="text-sm text-green-600">{bulkSuccess}</span>}
          </div>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="cursor-pointer"
                  />
                </TableHead>
                <TableHead>Shipment ID</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Receiver</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Weight (kg)</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>User Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.length > 0 ? (
                shipments.map((shipment) => (
                  <TableRow
                    key={shipment.id}
                    className={`hover:bg-muted/50 ${selectedIds.includes(shipment.id) ? 'bg-muted/30' : ''}`}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(shipment.id)}
                        onChange={() => toggleSelect(shipment.id)}
                        className="cursor-pointer"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link href={`/shipments/${shipment.shipment_id_str}`} className="text-primary hover:underline">
                        {shipment.shipment_id_str}
                      </Link>
                    </TableCell>
                    <TableCell>{shipment.sender_name}</TableCell>
                    <TableCell>{shipment.receiver_name}</TableCell>
                    <TableCell>{shipment.receiver_address_city}</TableCell>
                    <TableCell className="text-sm">{shipment.service_type}</TableCell>
                    <TableCell>{shipment.package_weight_kg}</TableCell>
                    <TableCell className="text-sm">
                      {new Date(shipment.booking_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_COLORS[shipment.status] || 'default'}>
                        {shipment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      ₹{shipment.total_with_tax_18_percent.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{shipment.user_type}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} className="text-center text-muted-foreground py-8">
                    No shipments found
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
