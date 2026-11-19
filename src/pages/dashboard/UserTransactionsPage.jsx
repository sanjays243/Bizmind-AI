import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Receipt,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Loader2,
  CheckCircle2,
  UploadCloud,
  FileSpreadsheet,
  Download,
  Printer,
  X,
  AlertCircle,
  FileText,
  DollarSign,
  Camera,
  Sparkles
} from 'lucide-react';
import { businessService } from '../../services/business.service';

export default function UserTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState('');
  const [loading, setLoading] = useState(true);

  // New Transaction Modal
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Sales Revenue');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // CSV Import State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importing, setImporting] = useState(false);
  const [parsedTransactions, setParsedTransactions] = useState([]);
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef(null);

  // P&L Statement Modal State
  const [showPLModal, setShowPLModal] = useState(false);
  const [plLoading, setPLLoading] = useState(false);
  const [plPeriod, setPLPeriod] = useState('month');
  const [plData, setPLData] = useState(null);

  // AI Receipt Scanner State
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const receiptInputRef = useRef(null);

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
        const txRes = await businessService.getTransactions({ businessId: targetBiz, limit: 100 });
        setTransactions(txRes?.transactions || []);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedBusinessId]);

  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    if (!selectedBusinessId) {
      showToast('Please establish a business profile first.');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      showToast('Please enter a valid positive amount.');
      return;
    }

    setSaving(true);
    try {
      await businessService.createTransaction({
        businessId: selectedBusinessId,
        type,
        amount: Number(amount),
        category,
        description: description.trim() || category,
        date: new Date(date),
        status: 'completed',
      });
      showToast('Transaction logged successfully.');
      setAmount('');
      setDescription('');
      setShowModal(false);
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to log transaction.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await businessService.deleteTransaction(id);
      showToast('Transaction deleted.');
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to delete transaction.');
    }
  };

  // Smart Categorization Classifier
  const autoClassify = (desc, amountVal) => {
    const d = (desc || '').toLowerCase();
    if (d.includes('stripe') || d.includes('client') || d.includes('deposit') || d.includes('sales') || d.includes('invoice') || d.includes('payment received')) {
      return { category: 'Sales Revenue', type: 'income' };
    }
    if (d.includes('google') || d.includes('aws') || d.includes('zoom') || d.includes('slack') || d.includes('microsoft') || d.includes('adobe') || d.includes('github') || d.includes('saas') || d.includes('software')) {
      return { category: 'Software & Tools', type: 'expense' };
    }
    if (d.includes('salary') || d.includes('payroll') || d.includes('wage') || d.includes('contractor') || d.includes('upwork') || d.includes('fiverr')) {
      return { category: 'Payroll & Contractors', type: 'expense' };
    }
    if (d.includes('uber') || d.includes('lyft') || d.includes('airline') || d.includes('delta') || d.includes('hotel') || d.includes('airbnb') || d.includes('flight')) {
      return { category: 'Travel & Lodging', type: 'expense' };
    }
    if (d.includes('rent') || d.includes('wework') || d.includes('lease') || d.includes('electric') || d.includes('utility') || d.includes('internet')) {
      return { category: 'Rent & Facilities', type: 'expense' };
    }
    if (d.includes('facebook') || d.includes('meta') || d.includes('adwords') || d.includes('ads') || d.includes('marketing')) {
      return { category: 'Marketing & Ads', type: 'expense' };
    }
    if (d.includes('coffee') || d.includes('restaurant') || d.includes('lunch') || d.includes('dinner') || d.includes('food') || d.includes('doordash')) {
      return { category: 'Meals & Entertainment', type: 'expense' };
    }
    return {
      category: amountVal > 0 ? 'Operating Expense' : 'Sales Revenue',
      type: amountVal > 0 ? 'expense' : 'income'
    };
  };

  // CSV File Handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (!text) throw new Error('File is empty.');

        const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
        if (lines.length < 2) {
          throw new Error('CSV must contain a header row and at least one transaction row.');
        }

        // Header column matching
        const headerRow = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''));
        const dateIdx = headerRow.findIndex((h) => h.includes('date'));
        const descIdx = headerRow.findIndex((h) => h.includes('desc') || h.includes('payee') || h.includes('memo') || h.includes('name'));
        const amountIdx = headerRow.findIndex((h) => h.includes('amount') || h.includes('total') || h.includes('debit') || h.includes('net'));
        const typeIdx = headerRow.findIndex((h) => h.includes('type'));
        const catIdx = headerRow.findIndex((h) => h.includes('cat'));

        const parsed = [];
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(',').map((cell) => cell.trim().replace(/^["']|["']$/g, ''));
          if (row.length === 1 && !row[0]) continue;

          let rawDate = dateIdx >= 0 ? row[dateIdx] : new Date().toISOString().split('T')[0];
          let rawDesc = descIdx >= 0 ? row[descIdx] : (row[1] || 'Transaction');
          let rawAmount = amountIdx >= 0 ? row[amountIdx] : row[row.length - 1];

          // Parse amount cleaning currency symbols
          const cleanAmount = parseFloat((rawAmount || '').replace(/[^0-9.-]/g, ''));
          if (isNaN(cleanAmount) || cleanAmount === 0) continue;

          const numAmount = Math.abs(cleanAmount);
          const classified = autoClassify(rawDesc, cleanAmount);

          let detectedType = classified.type;
          if (typeIdx >= 0 && row[typeIdx]) {
            const t = row[typeIdx].toLowerCase();
            if (t.includes('credit') || t.includes('inc') || t.includes('deposit')) detectedType = 'income';
            if (t.includes('debit') || t.includes('exp') || t.includes('withdraw')) detectedType = 'expense';
          }

          let detectedCategory = (catIdx >= 0 && row[catIdx]) ? row[catIdx] : classified.category;

          parsed.push({
            date: !isNaN(new Date(rawDate).getTime()) ? new Date(rawDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            description: rawDesc || 'Imported Entry',
            amount: numAmount,
            type: detectedType,
            category: detectedCategory,
          });
        }

        if (parsed.length === 0) {
          throw new Error('Could not parse any valid transaction rows from the CSV file.');
        }

        setParsedTransactions(parsed);
      } catch (err) {
        setImportError(err.message || 'Failed to process CSV file.');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = async () => {
    if (!selectedBusinessId) {
      setImportError('Please select a business ledger first.');
      return;
    }
    if (parsedTransactions.length === 0) return;

    setImporting(true);
    setImportError('');
    try {
      const res = await businessService.importTransactions({
        businessId: selectedBusinessId,
        transactions: parsedTransactions,
      });

      showToast(`Successfully imported ${res?.data?.importedCount || parsedTransactions.length} transactions!`);
      setShowImportModal(false);
      setParsedTransactions([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      loadData();
    } catch (err) {
      setImportError(err.message || 'Failed to import transactions.');
    } finally {
      setImporting(false);
    }
  };

  // P&L Statement Loader
  const handleOpenPLModal = async (period = 'month') => {
    if (!selectedBusinessId) return;
    setPLPeriod(period);
    setShowPLModal(true);
    setPLLoading(true);
    try {
      const res = await businessService.getPLStatement(selectedBusinessId, { period });
      setPLData(res?.data || null);
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to load P&L Statement.');
    } finally {
      setPLLoading(false);
    }
  };

  // Export P&L as CSV
  const handleExportCSV = () => {
    if (!plData) return;
    const rows = [
      ['BizMind AI - Profit & Loss Statement'],
      ['Business Name:', plData.business?.name || 'My Business'],
      ['Reporting Period:', plData.period?.name || plPeriod],
      ['Generated On:', new Date(plData.generatedAt).toLocaleString()],
      [''],
      ['REVENUE / INCOME'],
      ['Category', 'Count', 'Amount ($ USD)', 'Percentage (%)'],
      ...(plData.revenue?.items || []).map((item) => [item.category, item.count, item.amount.toFixed(2), item.percentage + '%']),
      ['Total Operating Revenue', '', plData.revenue?.totalGrossRevenue?.toFixed(2) || '0.00', '100%'],
      [''],
      ['OPERATING EXPENSES'],
      ['Category', 'Count', 'Amount ($ USD)', 'Percentage (%)'],
      ...(plData.expenses?.items || []).map((item) => [item.category, item.count, item.amount.toFixed(2), item.percentage + '%']),
      ['Total Operating Expenses', '', plData.expenses?.totalOperatingExpenses?.toFixed(2) || '0.00', '100%'],
      [''],
      ['SUMMARY'],
      ['Net Operating Income (EBITDA)', '', plData.summary?.netOperatingIncome?.toFixed(2) || '0.00'],
      ['Net Profit Margin (%)', '', (plData.summary?.profitMargin || 0) + '%'],
      ['Estimated Tax Reserve (15%)', '', plData.summary?.estimatedTax?.toFixed(2) || '0.00'],
      ['Net Income After Tax', '', plData.summary?.netIncomeAfterTax?.toFixed(2) || '0.00'],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BizMind_PL_Statement_${plData.business?.name || 'Report'}_${plPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Receipt Scanner Handlers
  const handleReceiptUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result;
      setImagePreview(base64);
      setScanning(true);
      setScannedData(null);
      try {
        const res = await businessService.scanReceipt({
          imageBase64: base64,
          filename: file.name,
        });
        if (res?.data?.extracted) {
          setScannedData(res.data.extracted);
        }
      } catch (err) {
        showToast(err.message || 'Failed to scan receipt image.');
      } finally {
        setScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyScannedReceipt = () => {
    if (!scannedData) return;
    setAmount(String(scannedData.amount || ''));
    setDescription(scannedData.merchant ? `${scannedData.merchant} receipt` : 'Receipt Expense');
    setCategory(scannedData.category || 'General Operating');
    setDate(scannedData.date || new Date().toISOString().split('T')[0]);
    setType('expense');
    setShowScanModal(false);
    setShowModal(true);
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
            Financial Ledger & Transactions
          </h2>
          <p className="text-xs text-gray-500">
            Record actual customer receipts, bank transactions, and operating expenses.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Export P&L Button */}
          <button
            type="button"
            disabled={businesses.length === 0}
            onClick={() => handleOpenPLModal('month')}
            className="inline-flex items-center gap-2 py-2 px-3.5 bg-white border border-gray-300 hover:border-[#FF6B00] hover:text-[#FF6B00] text-gray-700 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-40"
          >
            <FileText className="w-4 h-4 text-[#FF6B00]" />
            <span>P&L Report</span>
          </button>

          {/* Scan Receipt Button */}
          <button
            type="button"
            disabled={businesses.length === 0}
            onClick={() => { setShowScanModal(true); setScannedData(null); setImagePreview(null); }}
            className="inline-flex items-center gap-2 py-2 px-3.5 bg-white border border-gray-300 hover:border-[#FF6B00] hover:text-[#FF6B00] text-gray-700 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-40"
          >
            <Camera className="w-4 h-4 text-[#FF6B00]" />
            <span>Scan Receipt</span>
          </button>

          {/* Import CSV Button */}
          <button
            type="button"
            disabled={businesses.length === 0}
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center gap-2 py-2 px-3.5 bg-[#0D0D0D] hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-40"
          >
            <UploadCloud className="w-4 h-4 text-[#FF6B00]" />
            <span>Import CSV</span>
          </button>

          {/* Add Transaction Button */}
          <button
            type="button"
            disabled={businesses.length === 0}
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 py-2 px-4 bg-[#FF6B00] hover:bg-[#E05300] text-white font-bold text-xs rounded-xl shadow-md shadow-[#FF6B00]/20 transition-all cursor-pointer disabled:opacity-40"
          >
            <Plus className="w-4 h-4" />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      {/* Business Selector & Quick Stats */}
      {businesses.length > 0 && (
        <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#FF6B00]" />
            <span className="text-xs font-bold text-[#0D0D0D]">Active Ledger:</span>
            <select
              value={selectedBusinessId}
              onChange={(e) => setSelectedBusinessId(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold bg-white outline-hidden focus:border-[#FF6B00]"
            >
              {businesses.map((b) => (
                <option key={b._id} value={b._id}>{b.name} ({b.type})</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
            <span>Total Logged: <strong className="text-gray-900">{transactions.length} entries</strong></span>
            {transactions.length > 0 && (
              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">
                Net: ${transactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0).toLocaleString()}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs font-semibold text-gray-500 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#FF6B00]" />
            <span>Loading ledger transactions...</span>
          </div>
        ) : businesses.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            Please create a business profile before recording transactions.
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500 space-y-3">
            <Receipt className="w-10 h-10 text-gray-300 mx-auto" />
            <p>No transactions logged yet for {activeBiz?.name}.</p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowImportModal(true)}
                className="py-2 px-4 rounded-xl border border-gray-300 font-bold text-xs hover:border-[#FF6B00] transition-colors"
              >
                Import Bank Statement CSV
              </button>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="py-2 px-4 rounded-xl bg-[#0D0D0D] text-white font-bold text-xs"
              >
                Add Manual Entry
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F4F4F5] border-b border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-600">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50/80 transition-colors text-xs">
                    <td className="py-3 px-4 text-gray-400 whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#0D0D0D]">
                      {tx.description || tx.category}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {tx.category}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          tx.type === 'income'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {tx.type === 'income' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                        <span className="capitalize">{tx.type}</span>
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-right font-extrabold text-sm ${
                      tx.type === 'income' ? 'text-emerald-700' : 'text-red-600'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(tx._id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── MODAL 1: Add Transaction ─────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFFFF] border border-gray-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#0D0D0D]">Log New Transaction</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#0D0D0D] uppercase tracking-wider block">
                  Transaction Type *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setType('income'); setCategory('Sales Revenue'); }}
                    className={`py-2 rounded-xl font-bold cursor-pointer transition-colors ${
                      type === 'income'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    + Income
                  </button>
                  <button
                    type="button"
                    onClick={() => { setType('expense'); setCategory('Rent & Facilities'); }}
                    className={`py-2 rounded-xl font-bold cursor-pointer transition-colors ${
                      type === 'expense'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    - Expense
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0D0D0D] uppercase tracking-wider block">
                  Amount ($ USD) *
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:border-[#FF6B00] outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0D0D0D] uppercase tracking-wider block">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder={type === 'income' ? 'e.g. Sales Revenue, Consulting' : 'e.g. Software, Payroll, Rent'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#FF6B00] outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0D0D0D] uppercase tracking-wider block">
                  Description / Note
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional memo..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#FF6B00] outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0D0D0D] uppercase tracking-wider block">
                  Transaction Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#FF6B00] outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="py-2.5 px-4 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="py-2.5 px-5 rounded-xl font-bold text-white bg-[#0D0D0D] hover:bg-black shadow-md transition-colors cursor-pointer"
                >
                  {saving ? 'Recording...' : 'Record Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: CSV Bank Statement Import ────────────────────── */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFFFF] border border-gray-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0D0D0D]">Import Bank Statement CSV</h3>
                  <p className="text-[11px] text-gray-500">Auto-detects dates, amounts, and categorizes transactions</p>
                </div>
              </div>
              <button onClick={() => setShowImportModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {importError && (
              <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            {/* Drop / Select Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 hover:border-[#FF6B00] bg-gray-50 hover:bg-[#FFF7ED]/30 rounded-2xl p-6 text-center cursor-pointer transition-all space-y-2"
            >
              <FileSpreadsheet className="w-8 h-8 text-[#FF6B00] mx-auto" />
              <p className="text-xs font-bold text-gray-800">
                Click to browse or drop your Bank Statement (.csv)
              </p>
              <p className="text-[11px] text-gray-400">
                Supports Chase, Wells Fargo, Bank of America, Stripe, PayPal, and standard CSV formats
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv,text/plain"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Preview of Parsed Rows */}
            {parsedTransactions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-700">Preview: {parsedTransactions.length} Transactions Detected</span>
                  <div className="flex gap-3 text-[11px]">
                    <span className="text-emerald-700">Income: ${parsedTransactions.filter((t) => t.type === 'income').reduce((a, b) => a + b.amount, 0).toLocaleString()}</span>
                    <span className="text-red-600">Expenses: ${parsedTransactions.filter((t) => t.type === 'expense').reduce((a, b) => a + b.amount, 0).toLocaleString()}</span>
                  </div>
                </div>

                <div className="max-h-56 overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100 text-xs">
                  {parsedTransactions.map((item, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between gap-3 hover:bg-gray-50">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-2 h-2 rounded-full ${item.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <div className="truncate">
                          <p className="font-bold text-gray-900 truncate">{item.description}</p>
                          <p className="text-[10px] text-gray-400">{item.date} • {item.category}</p>
                        </div>
                      </div>
                      <span className={`font-mono font-bold whitespace-nowrap ${item.type === 'income' ? 'text-emerald-700' : 'text-red-600'}`}>
                        {item.type === 'income' ? '+' : '-'}${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => { setShowImportModal(false); setParsedTransactions([]); }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={parsedTransactions.length === 0 || importing}
                onClick={handleConfirmImport}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#FF6B00] hover:bg-[#E05300] disabled:opacity-40 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {importing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm & Import ({parsedTransactions.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: Profit & Loss Statement (P&L) ────────────────── */}
      {showPLModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white">
          <div className="bg-[#FFFFFF] border border-gray-200 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none">
            {/* Header / Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4 print:hidden">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0D0D0D] text-[#FF6B00] flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0D0D0D]">Profit & Loss Statement (P&L)</h3>
                  <p className="text-xs text-gray-500">{activeBiz?.name} • Financial Intelligence Report</p>
                </div>
              </div>

              {/* Period Tabs & Actions */}
              <div className="flex items-center gap-2">
                <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold">
                  {['month', 'quarter', 'year'].map((p) => (
                    <button
                      key={p}
                      onClick={() => handleOpenPLModal(p)}
                      className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                        plPeriod === p ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      {p === 'month' ? 'This Month' : p === 'quarter' ? 'This Quarter' : 'Year-to-Date'}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  disabled={!plData || plLoading}
                  className="p-2 border border-gray-200 hover:border-gray-400 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  title="Download CSV"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2 border border-gray-200 hover:border-gray-400 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  title="Print / Save PDF"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowPLModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {plLoading ? (
              <div className="py-16 text-center text-xs font-semibold text-gray-500 flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#FF6B00]" />
                <span>Aggregating ledger categories and computing profit margin...</span>
              </div>
            ) : !plData ? (
              <div className="py-12 text-center text-xs text-gray-500">
                No financial records available for this period.
              </div>
            ) : (
              <div className="space-y-6 text-xs text-gray-800 font-sans">
                {/* Print Title Header */}
                <div className="text-center space-y-1 pb-4 border-b border-gray-200">
                  <h2 className="text-xl font-black text-[#0D0D0D] tracking-tight">{plData.business?.name}</h2>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Profit and Loss Statement • Period: {plPeriod.toUpperCase()}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Generated: {new Date(plData.generatedAt).toLocaleDateString()} | Currency: {plData.business?.currency}
                  </p>
                </div>

                {/* Section 1: Revenue */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b-2 border-emerald-600 font-extrabold text-xs uppercase tracking-wider text-emerald-900">
                    <span>Operating Revenue (Income)</span>
                    <span>Amount ($)</span>
                  </div>
                  {plData.revenue?.items?.length === 0 ? (
                    <p className="text-[11px] text-gray-400 italic py-1">No recorded revenue entries for this period.</p>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {plData.revenue?.items?.map((item, idx) => (
                        <div key={idx} className="py-1.5 flex justify-between items-center text-xs">
                          <span className="font-medium text-gray-700">{item.category} ({item.count} entries)</span>
                          <span className="font-bold font-mono text-gray-900">
                            ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 font-bold text-xs bg-emerald-50/70 p-2 rounded-lg text-emerald-950">
                    <span>Total Gross Revenue</span>
                    <span className="font-mono text-sm font-extrabold text-emerald-800">
                      ${(plData.revenue?.totalGrossRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Section 2: Operating Expenses */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b-2 border-red-600 font-extrabold text-xs uppercase tracking-wider text-red-900">
                    <span>Operating Expenses</span>
                    <span>Amount ($)</span>
                  </div>
                  {plData.expenses?.items?.length === 0 ? (
                    <p className="text-[11px] text-gray-400 italic py-1">No recorded operating expenses for this period.</p>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {plData.expenses?.items?.map((item, idx) => (
                        <div key={idx} className="py-1.5 flex justify-between items-center text-xs">
                          <span className="font-medium text-gray-700">{item.category} ({item.count} entries)</span>
                          <span className="font-bold font-mono text-gray-900">
                            ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 font-bold text-xs bg-red-50/70 p-2 rounded-lg text-red-950">
                    <span>Total Operating Expenses</span>
                    <span className="font-mono text-sm font-extrabold text-red-700">
                      ${(plData.expenses?.totalOperatingExpenses || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Section 3: Net Summary */}
                <div className="p-4 bg-[#F4F4F5] rounded-2xl border border-gray-200 space-y-2.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Net Operating Income (EBITDA):</span>
                    <span className={`font-mono font-bold ${plData.summary?.netOperatingIncome >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                      ${(plData.summary?.netOperatingIncome || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Net Profit Margin:</span>
                    <span className="font-mono font-bold text-gray-900">{plData.summary?.profitMargin || 0}%</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-gray-500">
                    <span>Suggested Tax Reserve (15%):</span>
                    <span className="font-mono font-bold text-gray-700">
                      ${(plData.summary?.estimatedTax || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-300 text-sm font-extrabold text-[#0D0D0D]">
                    <span>Estimated Net Income After Tax:</span>
                    <span className="font-mono text-[#FF6B00]">
                      ${(plData.summary?.netIncomeAfterTax || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-gray-400 italic text-center">
                  {plData.disclaimer}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── MODAL 4: AI Receipt & Bill Scanner ──────────────────── */}
      {showScanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFFFF] border border-gray-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0D0D0D]">Smart Receipt & Bill Scanner</h3>
                  <p className="text-[11px] text-gray-500">Auto-extracts vendor, total amount, and expense category</p>
                </div>
              </div>
              <button onClick={() => setShowScanModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Upload Zone */}
            <div
              onClick={() => receiptInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 hover:border-[#FF6B00] bg-gray-50 hover:bg-[#FFF7ED]/30 rounded-2xl p-6 text-center cursor-pointer transition-all space-y-2"
            >
              <Camera className="w-8 h-8 text-[#FF6B00] mx-auto" />
              <p className="text-xs font-bold text-gray-800">
                Click to snap or upload receipt photo / PDF
              </p>
              <p className="text-[11px] text-gray-400">
                Supports JPG, PNG, WEBP, and PDF receipts
              </p>
              <input
                ref={receiptInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleReceiptUpload}
                className="hidden"
              />
            </div>

            {/* Preview & Processing */}
            {imagePreview && (
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-900 max-h-48 flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Receipt preview"
                    className="max-h-48 object-contain"
                  />
                  {scanning && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 text-white text-xs font-bold">
                      <Loader2 className="w-6 h-6 animate-spin text-[#FF6B00]" />
                      <span>AI Vision analyzing receipt lines & amounts...</span>
                    </div>
                  )}
                </div>

                {scannedData && (
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-emerald-900 text-sm">{scannedData.merchant}</span>
                      <span className="text-[10px] font-mono font-bold bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full">
                        {scannedData.provider || 'Smart OCR'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-gray-700">
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase">Detected Amount:</span>
                        <strong className="font-mono text-emerald-800 text-base">${scannedData.amount?.toFixed(2)}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase">Category:</span>
                        <strong className="text-gray-900">{scannedData.category}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase">Date:</span>
                        <span className="text-gray-800">{scannedData.date}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase">Confidence:</span>
                        <span className="text-emerald-700 font-bold">{scannedData.confidence}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowScanModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!scannedData || scanning}
                onClick={handleApplyScannedReceipt}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#FF6B00] hover:bg-[#E05300] disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve & Log to Ledger</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
