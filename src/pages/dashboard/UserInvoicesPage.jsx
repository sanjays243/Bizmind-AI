import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Printer,
  Download,
  Eye,
  Loader2,
  Receipt,
  DollarSign,
  Send,
  Building2,
  X,
  CreditCard,
  UserCheck
} from 'lucide-react';
import { invoiceService } from '../../services/invoice.service';
import { businessService } from '../../services/business.service';

export default function UserInvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState(null);

  // Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [paymentTerms, setPaymentTerms] = useState('Net 15');
  const [taxRate, setTaxRate] = useState(5);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('Thank you for your business! Payment is due as scheduled.');
  const [items, setItems] = useState([
    { description: 'Business Advisory & Strategy Session', quantity: 1, unitPrice: 750 },
  ]);

  // Preview Modal
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const bizRes = await businessService.getMyBusinesses();
      const list = bizRes?.businesses || [];
      setBusinesses(list);

      const targetBiz = selectedBusinessId || (list.find((b) => b.isDefault)?._id) || (list[0]?._id) || '';
      if (!selectedBusinessId && targetBiz) {
        setSelectedBusinessId(targetBiz);
      }

      if (targetBiz) {
        const [invRes, statRes] = await Promise.all([
          invoiceService.getInvoices({ businessId: targetBiz, status: statusFilter === 'all' ? undefined : statusFilter }),
          invoiceService.getInvoiceStats(targetBiz).catch(() => null),
        ]);
        setInvoices(invRes?.invoices || []);
        setStats(statRes);
      } else {
        setInvoices([]);
        setStats(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedBusinessId, statusFilter]);

  // Dynamic Item Row helpers
  const addItemRow = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItemRow = (idx) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateItemRow = (idx, field, val) => {
    const updated = [...items];
    updated[idx][field] = field === 'description' ? val : Number(val) || 0;
    setItems(updated);
  };

  const subtotal = items.reduce((acc, it) => acc + (it.quantity || 1) * (it.unitPrice || 0), 0);
  const taxAmount = (subtotal * (Number(taxRate) || 0)) / 100;
  const grandTotal = Math.max(0, subtotal + taxAmount - (Number(discount) || 0));

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    if (!selectedBusinessId) {
      showToast('Please establish a business profile first.');
      return;
    }
    if (!clientName.trim()) {
      showToast('Client name is required.');
      return;
    }

    setCreating(true);
    try {
      await invoiceService.createInvoice({
        businessId: selectedBusinessId,
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        clientAddress: clientAddress.trim(),
        issueDate,
        dueDate,
        paymentTerms,
        taxRate: Number(taxRate) || 0,
        discount: Number(discount) || 0,
        notes,
        items,
        status: 'sent',
      });

      showToast('Invoice created and sent!');
      setShowCreateModal(false);
      setClientName('');
      setClientEmail('');
      setClientAddress('');
      setItems([{ description: 'Professional Services', quantity: 1, unitPrice: 500 }]);
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to create invoice.');
    } finally {
      setCreating(false);
    }
  };

  const handleMarkAsPaid = async (inv) => {
    try {
      await invoiceService.markAsPaid(inv._id);
      showToast(`Invoice ${inv.invoiceNumber} marked as paid! Revenue auto-logged to Ledger.`);
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to mark invoice as paid.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this invoice?')) return;
    try {
      await invoiceService.deleteInvoice(id);
      showToast('Invoice removed.');
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to delete invoice.');
    }
  };

  const activeBiz = businesses.find((b) => b._id === selectedBusinessId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
      {toast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0D0D0D] tracking-tight">
            Invoicing & Accounts Receivable (A/R)
          </h2>
          <p className="text-xs text-gray-500">
            Bill clients, track outstanding receivables, and auto-sync payments to your ledger.
          </p>
        </div>

        <button
          type="button"
          disabled={businesses.length === 0}
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 py-2.5 px-4 bg-[#FF6B00] hover:bg-[#E05300] text-white font-bold text-xs rounded-xl shadow-md shadow-[#FF6B00]/20 transition-all cursor-pointer disabled:opacity-40 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Invoice</span>
        </button>
      </div>

      {/* A/R Financial Metrics Overview */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-4 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Total Invoiced
            </span>
            <span className="text-xl font-black text-gray-900 block">
              ${stats.totalBilled?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-gray-400 block">{stats.invoiceCount} total invoices</span>
          </div>

          <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-4 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
              Outstanding A/R
            </span>
            <span className="text-xl font-black text-amber-600 block">
              ${stats.totalOutstanding?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-gray-400 block">Awaiting client payment</span>
          </div>

          <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-4 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block">
              Overdue Receivables
            </span>
            <span className="text-xl font-black text-red-600 block">
              ${stats.totalOverdue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-red-500 font-semibold block">Requires follow-up</span>
          </div>

          <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-4 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
              Collected & Paid
            </span>
            <span className="text-xl font-black text-emerald-700 block">
              ${stats.totalPaid?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold block">Synced to ledger</span>
          </div>
        </div>
      )}

      {/* Aging Analysis Bar */}
      {stats && stats.totalOutstanding > 0 && (
        <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-gray-700">Accounts Receivable Aging Schedule:</span>
            <span className="text-gray-400 font-normal">Tracking payment collection cycle</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 space-y-0.5">
              <span className="text-[10px] text-emerald-800 uppercase font-bold tracking-wider">0–30 Days (Current)</span>
              <p className="font-extrabold text-emerald-900 font-mono">
                ${(stats.aging?.current || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 space-y-0.5">
              <span className="text-[10px] text-amber-800 uppercase font-bold tracking-wider">31–60 Days</span>
              <p className="font-extrabold text-amber-900 font-mono">
                ${(stats.aging?.days30to60 || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 space-y-0.5">
              <span className="text-[10px] text-red-800 uppercase font-bold tracking-wider">60+ Days Overdue</span>
              <p className="font-extrabold text-red-900 font-mono">
                ${(stats.aging?.days60plus || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs & Business Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FFFFFF] border border-gray-200 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#FF6B00]" />
          <span className="text-xs font-bold text-gray-700">Business:</span>
          <select
            value={selectedBusinessId}
            onChange={(e) => setSelectedBusinessId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold bg-white outline-hidden focus:border-[#FF6B00]"
          >
            {businesses.map((b) => (
              <option key={b._id} value={b._id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Status Filters */}
        <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold">
          {['all', 'sent', 'paid', 'overdue'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                statusFilter === s ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {s === 'all' ? 'All Invoices' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs font-semibold text-gray-500 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#FF6B00]" />
            <span>Loading invoice registers...</span>
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500 space-y-3">
            <FileText className="w-10 h-10 text-gray-300 mx-auto" />
            <p>No invoices found matching criteria.</p>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="py-2 px-4 rounded-xl bg-[#0D0D0D] text-white font-bold text-xs"
            >
              Draft First Invoice
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F4F4F5] border-b border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-600">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Total Amount</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-gray-50/80 transition-colors text-xs">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#0D0D0D]">
                      {inv.clientName}
                      {inv.clientEmail && <span className="block text-[11px] font-normal text-gray-400">{inv.clientEmail}</span>}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                      {new Date(inv.issueDate).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                      {new Date(inv.dueDate).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${
                        inv.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : inv.status === 'overdue'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {inv.status === 'paid' && <CheckCircle2 className="w-3 h-3" />}
                        {inv.status === 'overdue' && <AlertTriangle className="w-3 h-3" />}
                        {inv.status === 'sent' && <Clock className="w-3 h-3" />}
                        <span>{inv.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-sm font-mono text-gray-900">
                      ${inv.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedInvoice(inv)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-[#0D0D0D] hover:bg-gray-100 transition-colors"
                          title="Preview & Print"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {inv.status !== 'paid' && (
                          <button
                            type="button"
                            onClick={() => handleMarkAsPaid(inv)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
                            title="Mark as Paid & record revenue in ledger"
                          >
                            Mark Paid
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDelete(inv._id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Invoice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── MODAL 1: Create Invoice ───────────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFFFF] border border-gray-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0D0D0D]">Create Client Invoice</h3>
                <p className="text-[11px] text-gray-500">Auto-calculates taxes, discounts, and terms</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              {/* Client Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">Client / Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Acme Corporation"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:border-[#FF6B00] outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">Client Email</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="billing@acme.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:border-[#FF6B00] outline-hidden"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-gray-700 block">Client Billing Address</label>
                  <input
                    type="text"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    placeholder="123 Business Way, Suite 400, New York, NY"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:border-[#FF6B00] outline-hidden"
                  />
                </div>
              </div>

              {/* Dates & Terms Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">Issue Date</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:border-[#FF6B00] outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:border-[#FF6B00] outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">Payment Terms</label>
                  <select
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:border-[#FF6B00] outline-hidden bg-white"
                  >
                    <option value="Due on Receipt">Due on Receipt</option>
                    <option value="Net 15">Net 15 Days</option>
                    <option value="Net 30">Net 30 Days</option>
                    <option value="Net 60">Net 60 Days</option>
                  </select>
                </div>
              </div>

              {/* Line Items Builder */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-gray-900 block">Line Items</label>
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="text-xs text-[#FF6B00] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Description of work or item..."
                        value={it.description}
                        onChange={(e) => updateItemRow(idx, 'description', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-xs focus:border-[#FF6B00] outline-hidden"
                      />
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={it.quantity}
                        onChange={(e) => updateItemRow(idx, 'quantity', e.target.value)}
                        className="w-16 px-2 py-2 rounded-xl border border-gray-300 text-xs text-center focus:border-[#FF6B00] outline-hidden"
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Rate ($)"
                        value={it.unitPrice}
                        onChange={(e) => updateItemRow(idx, 'unitPrice', e.target.value)}
                        className="w-24 px-2 py-2 rounded-xl border border-gray-300 text-xs text-right focus:border-[#FF6B00] outline-hidden"
                      />
                      <span className="w-20 text-right font-mono font-bold text-gray-900">
                        ${((it.quantity || 1) * (it.unitPrice || 0)).toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItemRow(idx)}
                        disabled={items.length <= 1}
                        className="p-1.5 text-gray-400 hover:text-red-600 disabled:opacity-30 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Summary Breakdown */}
              <div className="bg-[#F4F4F5] p-3 rounded-2xl space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal:</span>
                  <span className="font-mono font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-1">
                    Tax Rate (%):
                    <input
                      type="number"
                      min="0"
                      value={taxRate}
                      onChange={(e) => setTaxRate(e.target.value)}
                      className="w-14 px-1.5 py-0.5 border border-gray-300 rounded text-center text-xs"
                    />
                  </span>
                  <span className="font-mono font-bold">+${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-1">
                    Discount ($):
                    <input
                      type="number"
                      min="0"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="w-16 px-1.5 py-0.5 border border-gray-300 rounded text-center text-xs"
                    />
                  </span>
                  <span className="font-mono font-bold text-red-600">-${Number(discount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-gray-300 font-extrabold text-sm text-[#0D0D0D]">
                  <span>Total Amount:</span>
                  <span className="font-mono text-[#FF6B00]">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">Payment Terms & Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:border-[#FF6B00] outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="py-2 px-4 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="py-2.5 px-5 rounded-xl font-bold text-white bg-[#FF6B00] hover:bg-[#E05300] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-orange-500/20"
                >
                  {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Generate & Send Invoice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: Professional Invoice Preview & Printable View ─── */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white">
          <div className="bg-[#FFFFFF] border border-gray-200 rounded-3xl p-6 sm:p-10 max-w-2xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none">
            {/* Action Bar (hidden when printing) */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 print:hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Client Invoice Preview
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-[#0D0D0D] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-black transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Branded Invoice */}
            <div className="space-y-6 text-xs text-gray-800 font-sans">
              {/* Header: Company & Invoice Info */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-black text-[#0D0D0D] tracking-tight">{activeBiz?.name}</h1>
                  <p className="text-xs text-gray-500">{activeBiz?.type || 'Business Operations'}</p>
                  <p className="text-[11px] text-gray-400 mt-1">Generated via BizMind Financial Platform</p>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-xl font-mono font-black text-[#FF6B00] block">{selectedInvoice.invoiceNumber}</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    selectedInvoice.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    Status: {selectedInvoice.status}
                  </span>
                </div>
              </div>

              {/* Billed To / Dates Box */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div>
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block">Billed To:</span>
                  <p className="font-extrabold text-sm text-gray-900 mt-0.5">{selectedInvoice.clientName}</p>
                  {selectedInvoice.clientEmail && <p className="text-gray-600">{selectedInvoice.clientEmail}</p>}
                  {selectedInvoice.clientAddress && <p className="text-gray-500">{selectedInvoice.clientAddress}</p>}
                </div>
                <div className="text-right space-y-1 text-xs">
                  <div>
                    <span className="text-gray-400 font-medium">Issue Date: </span>
                    <strong className="text-gray-800">{new Date(selectedInvoice.issueDate).toLocaleDateString()}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">Payment Due: </span>
                    <strong className="text-red-700">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">Terms: </span>
                    <strong className="text-gray-800">{selectedInvoice.paymentTerms}</strong>
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#0D0D0D] text-white text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3 font-bold">Description</th>
                      <th className="py-2.5 px-3 text-center font-bold">Qty</th>
                      <th className="py-2.5 px-3 text-right font-bold">Unit Price</th>
                      <th className="py-2.5 px-3 text-right font-bold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-xs">
                    {selectedInvoice.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 font-medium text-gray-900">{item.description}</td>
                        <td className="py-2.5 px-3 text-center">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-right font-mono">${item.unitPrice.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-gray-900">${item.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Summary */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1.5 text-xs bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal:</span>
                    <span className="font-mono font-bold">${selectedInvoice.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedInvoice.taxAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tax ({selectedInvoice.taxRate}%):</span>
                      <span className="font-mono font-bold">+${selectedInvoice.taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {selectedInvoice.discount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Discount:</span>
                      <span className="font-mono font-bold">-${selectedInvoice.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1.5 border-t border-gray-300 font-black text-sm text-[#0D0D0D]">
                    <span>Total Due:</span>
                    <span className="font-mono text-[#FF6B00]">${selectedInvoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="pt-4 border-t border-gray-200 text-[11px] text-gray-500">
                <span className="font-bold text-gray-700 block">Payment Instructions & Notes:</span>
                <p>{selectedInvoice.notes}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

