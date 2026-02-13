"use client"

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://www.server.waynexshipping.com/api';

export default function InternationalRatesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [percent, setPercent] = useState('');
  const [flat, setFlat] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    details?: { total_destinations: number; total_services: number; active_services: number };
  } | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setResult(null);

    try {
      const sessionData = localStorage.getItem('admin_session');
      const session = sessionData ? JSON.parse(sessionData) : null;

      const formData = new FormData();
      formData.append('file', file);
      if (percent) formData.append('percent', percent);
      if (flat) formData.append('flat', flat);

      const headers: Record<string, string> = {};
      if (session?.email) {
        headers['X-User-Email'] = session.email;
      }

      const response = await fetch(`${API_URL}/admin/international-rates/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
          details: {
            total_destinations: data.total_destinations,
            total_services: data.total_services,
            active_services: data.active_services,
          },
        });
        setFile(null);
        setPercent('');
        setFlat('');
        // Reset file input
        const fileInput = document.getElementById('rate-file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        setResult({ success: false, message: data.error || 'Upload failed' });
      }
    } catch (error) {
      setResult({ success: false, message: 'Failed to upload file. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">International Rates</h1>
        <p className="text-muted-foreground">
          Upload an Excel rate sheet to update international shipping rates
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Upload Rate Sheet</h2>

        <div className="space-y-6 max-w-lg">
          {/* File Input */}
          <div className="space-y-2">
            <Label htmlFor="rate-file">Excel File (.xlsx, .xls)</Label>
            <Input
              id="rate-file"
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setResult(null);
              }}
            />
          </div>

          {/* Percent Increase */}
          <div className="space-y-2">
            <Label htmlFor="percent">Increase rates by % (optional)</Label>
            <Input
              id="percent"
              type="number"
              step="0.01"
              placeholder="e.g. 10 for 10% increase"
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
            />
          </div>

          {/* Flat Increase */}
          <div className="space-y-2">
            <Label htmlFor="flat">Increase rates by flat value ₹ (optional)</Label>
            <Input
              id="flat"
              type="number"
              step="0.01"
              placeholder="e.g. 50 for ₹50 increase"
              value={flat}
              onChange={(e) => setFlat(e.target.value)}
            />
          </div>

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading & Processing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload & Update Rates
              </>
            )}
          </Button>
        </div>

        {/* Result */}
        {result && (
          <div
            className={`mt-6 p-4 rounded-lg border ${
              result.success
                ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800'
                : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'
            }`}
          >
            <div className="flex items-start gap-3">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              )}
              <div>
                <p className={`font-medium ${result.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                  {result.message}
                </p>
                {result.details && (
                  <div className="mt-2 text-sm text-muted-foreground space-y-1">
                    <p>Destinations: {result.details.total_destinations}</p>
                    <p>Total services: {result.details.total_services}</p>
                    <p>Active services: {result.details.active_services}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
