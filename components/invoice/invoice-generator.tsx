"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ExportAuthDialog } from "@/components/ui/export-auth-dialog";
import { useAuthGuard, PROTECTED_ACTIVITIES } from "@/lib/auth-utils";
import { InvoicePreview, InvoiceData, InvoiceItem, computeTotals } from "./invoice-preview";
import InvoiceTemplates from "./invoice-templates";
import { Loader2, Sparkles, Download, FileImage, Plus, Minus, Receipt, Palette } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function InvoiceGenerator() {
  const [template, setTemplate] = useState("clean-blue");
  const [currency, setCurrency] = useState("USD");
  const [invoiceNumber, setInvoiceNumber] = useState("INV-0001");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [billFrom, setBillFrom] = useState({ name: "", address: "", email: "", phone: "", logo: "" });
  const [billTo, setBillTo] = useState({ name: "", address: "", email: "", phone: "" });
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [notes, setNotes] = useState("");

  const [isExporting, setIsExporting] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { toast } = useToast();
  const { requireAuth } = useAuthGuard();

  const data: InvoiceData = useMemo(
    () => ({
      invoiceNumber,
      issueDate,
      dueDate: dueDate || undefined,
      billFrom,
      billTo,
      currency,
      items,
      discount,
      shipping,
      notes,
      template,
    }),
    [invoiceNumber, issueDate, dueDate, billFrom, billTo, currency, items, discount, shipping, notes, template]
  );

  const totals = computeTotals(data);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: uid(), description: "", quantity: 1, unitPrice: 0, taxRate: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, patch: Partial<InvoiceItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  };

  const handleExportPDF = async () => {
    if (!requireAuth(PROTECTED_ACTIVITIES.EXPORT_PRESENTATION)) {
      setShowAuthDialog(true);
      return;
    }
    if (items.length === 0) {
      toast({ title: "Add at least one item", variant: "destructive" });
      return;
    }
    setIsExporting(true);
    try {
      const element = document.getElementById("invoice-preview");
      if (!element) throw new Error("Invoice preview not found");
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoiceNumber.replace(/\s+/g, "-")}.pdf`);
      toast({ title: "Invoice exported!", description: "Your invoice has been downloaded as PDF." });
    } catch (e) {
      console.error(e);
      toast({ title: "Export failed", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportImage = async () => {
    if (!requireAuth(PROTECTED_ACTIVITIES.EXPORT_PRESENTATION)) {
      setShowAuthDialog(true);
      return;
    }
    if (items.length === 0) {
      toast({ title: "Add at least one item", variant: "destructive" });
      return;
    }
    setIsExporting(true);
    try {
      const element = document.getElementById("invoice-preview");
      if (!element) throw new Error("Invoice preview not found");
      const canvas = await html2canvas(element, { scale: 3, useCORS: true, backgroundColor: "#ffffff" });
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = `${invoiceNumber.replace(/\s+/g, "-")}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
      toast({ title: "Invoice exported!", description: "Your invoice has been downloaded as PNG image." });
    } catch (e) {
      console.error(e);
      toast({ title: "Export failed", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Templates */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-yellow-600" />
          <h2 className="text-xl font-semibold">Choose a Template</h2>
        </div>
        <InvoiceTemplates selectedTemplate={template} onSelect={setTemplate} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card className="border-yellow-400/20">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Receipt className="h-5 w-5 text-yellow-600" />
                <h2 className="text-xl font-semibold">Invoice Details</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoiceNumber" className="text-sm">Invoice #</Label>
                  <Input id="invoiceNumber" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="currency" className="text-sm">Currency</Label>
                  <Input id="currency" value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} />
                </div>
                <div>
                  <Label htmlFor="issueDate" className="text-sm">Issue Date</Label>
                  <Input id="issueDate" type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="dueDate" className="text-sm">Due Date</Label>
                  <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Bill From</Label>
                  <Input placeholder="Your company" value={billFrom.name} onChange={(e) => setBillFrom({ ...billFrom, name: e.target.value })} />
                  <Textarea placeholder="Address" value={billFrom.address} onChange={(e) => setBillFrom({ ...billFrom, address: e.target.value })} />
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Email" value={billFrom.email} onChange={(e) => setBillFrom({ ...billFrom, email: e.target.value })} />
                    <Input placeholder="Phone" value={billFrom.phone} onChange={(e) => setBillFrom({ ...billFrom, phone: e.target.value })} />
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <Input type="file" accept="image/*" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => setBillFrom({ ...billFrom, logo: String(reader.result || "") });
                      reader.readAsDataURL(file);
                    }} />
                    {billFrom.logo && <img src={billFrom.logo} alt="Logo preview" className="h-8 w-auto rounded border" />}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Bill To</Label>
                  <Input placeholder="Client name" value={billTo.name} onChange={(e) => setBillTo({ ...billTo, name: e.target.value })} />
                  <Textarea placeholder="Address" value={billTo.address} onChange={(e) => setBillTo({ ...billTo, address: e.target.value })} />
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Email" value={billTo.email} onChange={(e) => setBillTo({ ...billTo, email: e.target.value })} />
                    <Input placeholder="Phone" value={billTo.phone} onChange={(e) => setBillTo({ ...billTo, phone: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Items</Label>
                  <Button variant="outline" size="sm" className="border-yellow-400/30" onClick={addItem}>
                    <Plus className="h-4 w-4 mr-1" /> Add Item
                  </Button>
                </div>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                      <Input className="col-span-5" placeholder="Description" value={item.description} onChange={(e) => updateItem(item.id, { description: e.target.value })} />
                      <Input className="col-span-2" type="number" min={0} step={1} placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) || 0 })} />
                      <Input className="col-span-2" type="number" min={0} step={0.01} placeholder="Unit Price" value={item.unitPrice} onChange={(e) => updateItem(item.id, { unitPrice: Number(e.target.value) || 0 })} />
                      <Input className="col-span-2" type="number" min={0} step={0.01} placeholder="Tax %" value={item.taxRate} onChange={(e) => updateItem(item.id, { taxRate: Number(e.target.value) || 0 })} />
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <p className="text-xs text-muted-foreground">No items. Add your first item to get started.</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Discount (amount)</Label>
                  <Input type="number" min={0} step={0.01} value={discount} onChange={(e) => setDiscount(Number(e.target.value) || 0)} />
                </div>
                <div>
                  <Label className="text-sm">Shipping</Label>
                  <Input type="number" min={0} step={0.01} value={shipping} onChange={(e) => setShipping(Number(e.target.value) || 0)} />
                </div>
              </div>

              <div>
                <Label className="text-sm">Notes</Label>
                <Textarea placeholder="Thank you for your business." value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{new Intl.NumberFormat(undefined, { style: "currency", currency }).format(totals.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>{new Intl.NumberFormat(undefined, { style: "currency", currency }).format(totals.taxes)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold">{new Intl.NumberFormat(undefined, { style: "currency", currency }).format(totals.total)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="border-yellow-400/30" onClick={handleExportImage} disabled={isExporting || items.length === 0}>
                <FileImage className="h-4 w-4 mr-1" /> PNG
              </Button>
              <Button variant="outline" className="border-yellow-400/30" onClick={handleExportPDF} disabled={isExporting || items.length === 0}>
                {isExporting ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Download className="h-4 w-4 mr-1" />} PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Preview</h2>
          </div>
          <Card className="border-yellow-400/20">
            <CardContent className="p-6">
              <InvoicePreview data={data} />
            </CardContent>
          </Card>
        </div>
      </div>

      <ExportAuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onSignIn={() => {
          setShowAuthDialog(false);
          requireAuth(PROTECTED_ACTIVITIES.EXPORT_PRESENTATION);
        }}
        exportType="invoice"
      />
    </div>
  );
}

export default InvoiceGenerator;
