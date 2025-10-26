'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // percent
};

export type InvoiceData = {
  invoiceNumber: string;
  issueDate: string; // ISO
  dueDate?: string; // ISO
  billFrom: {
    name: string;
    address?: string;
    email?: string;
    phone?: string;
    logo?: string; // data url
  };
  billTo: {
    name: string;
    address?: string;
    email?: string;
    phone?: string;
  };
  currency: string; // e.g. USD
  items: InvoiceItem[];
  discount?: number; // absolute amount
  shipping?: number; // absolute amount
  notes?: string;
  template: string;
};

const templateStyles: Record<
  string,
  {
    bg: string;
    text: string;
    accent: string;
    header: string;
    border: string;
  }
> = {
  'clean-blue': {
    bg: 'bg-white dark:bg-neutral-950',
    text: 'text-neutral-900 dark:text-neutral-100',
    accent: 'text-blue-700 dark:text-blue-300',
    header: 'bg-blue-50 dark:bg-neutral-900',
    border: 'border-blue-100 dark:border-neutral-800',
  },
  'classic-slate': {
    bg: 'bg-white dark:bg-neutral-950',
    text: 'text-neutral-900 dark:text-neutral-100',
    accent: 'text-neutral-800 dark:text-neutral-200',
    header: 'bg-neutral-50 dark:bg-neutral-900',
    border: 'border-neutral-200 dark:border-neutral-800',
  },
  'accent-amber': {
    bg: 'bg-white dark:bg-neutral-950',
    text: 'text-neutral-900 dark:text-neutral-100',
    accent: 'text-amber-700 dark:text-amber-300',
    header: 'bg-amber-50 dark:bg-neutral-900',
    border: 'border-amber-100 dark:border-neutral-800',
  },
};

function formatCurrency(value: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

export function computeTotals(data: InvoiceData) {
  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const taxes = data.items.reduce(
    (sum, item) => sum + (item.quantity * item.unitPrice * (item.taxRate || 0)) / 100,
    0,
  );
  const discount = data.discount || 0;
  const shipping = data.shipping || 0;
  const total = Math.max(0, subtotal + taxes + shipping - discount);
  return { subtotal, taxes, discount, shipping, total };
}

export function InvoicePreview({ data, className }: { data: InvoiceData; className?: string }) {
  const styles = templateStyles[data.template] ?? templateStyles['clean-blue'];
  const totals = computeTotals(data);

  return (
    <div className={cn('w-full', className)}>
      <div
        id="invoice-preview"
        className={cn(
          'relative mx-auto w-full max-w-[1000px] select-none rounded-xl overflow-hidden shadow-sm',
          styles.bg,
          styles.text,
        )}
      >
        {/* Header */}
        <div className={cn('p-6 border-b', styles.header, styles.border)}>
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              {data.billFrom.logo && (
                <img
                  src={data.billFrom.logo}
                  alt="Logo"
                  className="h-10 w-auto object-contain mb-2 opacity-90"
                />
              )}
              <p className="font-semibold text-lg">{data.billFrom.name || 'Your Company'}</p>
              {data.billFrom.address && (
                <p className="text-sm text-muted-foreground">{data.billFrom.address}</p>
              )}
              {(data.billFrom.email || data.billFrom.phone) && (
                <p className="text-xs text-muted-foreground">
                  {data.billFrom.email ? data.billFrom.email : ''}
                  {data.billFrom.email && data.billFrom.phone ? ' • ' : ''}
                  {data.billFrom.phone ? data.billFrom.phone : ''}
                </p>
              )}
            </div>
            <div className="text-right">
              <h1 className={cn('text-2xl font-bold tracking-tight', styles.accent)}>Invoice</h1>
              <p className="text-sm">
                <span className="text-muted-foreground">Invoice #</span>{' '}
                {data.invoiceNumber || 'INV-0001'}
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Issue:</span>{' '}
                {new Date(data.issueDate).toLocaleDateString()}
              </p>
              {data.dueDate && (
                <p className="text-sm">
                  <span className="text-muted-foreground">Due:</span>{' '}
                  {new Date(data.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Parties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div>
            <p className="text-sm font-semibold">Bill From</p>
            <p className="text-base">{data.billFrom.name || 'Your Company'}</p>
            {data.billFrom.address && (
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {data.billFrom.address}
              </p>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold">Bill To</p>
            <p className="text-base">{data.billTo.name || 'Client Name'}</p>
            {data.billTo.address && (
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {data.billTo.address}
              </p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="px-6 pb-6">
          <div className={cn('rounded-lg overflow-hidden border', styles.border)}>
            <table className="w-full text-sm">
              <thead className={cn(styles.header)}>
                <tr>
                  <th className="text-left p-3 font-medium">Description</th>
                  <th className="text-right p-3 font-medium">Qty</th>
                  <th className="text-right p-3 font-medium">Unit Price</th>
                  <th className="text-right p-3 font-medium">Tax %</th>
                  <th className="text-right p-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.items.length === 0 ? (
                  <tr>
                    <td className="p-3 text-muted-foreground" colSpan={5}>
                      Add items to build your invoice.
                    </td>
                  </tr>
                ) : (
                  data.items.map((item) => {
                    const amount = item.quantity * item.unitPrice;
                    return (
                      <tr key={item.id} className="border-t">
                        <td className="p-3">{item.description || 'Item'}</td>
                        <td className="p-3 text-right">{item.quantity}</td>
                        <td className="p-3 text-right">
                          {formatCurrency(item.unitPrice, data.currency)}
                        </td>
                        <td className="p-3 text-right">{(item.taxRate || 0).toFixed(2)}%</td>
                        <td className="p-3 text-right">{formatCurrency(amount, data.currency)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {data.notes && (
              <>
                <p className="text-sm font-semibold mb-1">Notes</p>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{data.notes}</p>
              </>
            )}
          </div>
          <div className="md:ml-auto">
            <div className={cn('rounded-lg border p-4 space-y-2', styles.border)}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-sm">{formatCurrency(totals.subtotal, data.currency)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tax</span>
                <span className="text-sm">{formatCurrency(totals.taxes, data.currency)}</span>
              </div>
              {totals.shipping > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Shipping</span>
                  <span className="text-sm">{formatCurrency(totals.shipping, data.currency)}</span>
                </div>
              )}
              {totals.discount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Discount</span>
                  <span className="text-sm">
                    - {formatCurrency(totals.discount, data.currency)}
                  </span>
                </div>
              )}
              <div className="border-t pt-2 mt-2 flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">{formatCurrency(totals.total, data.currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Live preview. Export options appear once you add items.
      </p>
    </div>
  );
}

export default InvoicePreview;
