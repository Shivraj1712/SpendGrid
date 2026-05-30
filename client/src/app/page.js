"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/AuthModals";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Wallet,
  LayoutDashboard,
  User,
  Plus,
  Search,
  LogOut,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  Shield,
  Loader2,
  Trash2,
  Edit,
} from "lucide-react";

export default function Home() {
  const {
    user,
    expenses,
    loading,
    logout,
    addExpense,
    searchExpenses,
    refreshExpenses,
  } = useAuth();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState("login");

  const [activeTab, setActiveTab] = useState("expenses");

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addTitle, setAddTitle] = useState("");
  const [addAmount, setAddAmount] = useState("");
  const [addCategory, setAddCategory] = useState("essentials");
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setCategoryFilter("All Categories");
    await searchExpenses(searchQuery, "");
  };

  const handleCategoryChange = async (value) => {
    setCategoryFilter(value);
    setSearchQuery("");
    const cat = value === "All Categories" ? "" : value;
    await searchExpenses("", cat);
  };

  const handleResetSearch = async () => {
    setSearchQuery("");
    setCategoryFilter("All Categories");
    await refreshExpenses();
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setAddError("");
    setAddLoading(true);

    try {
      const res = await addExpense(addTitle, addAmount, addCategory);
      if (res.success) {
        setAddTitle("");
        setAddAmount("");
        setAddCategory("essentials");
        setAddModalOpen(false);
      } else {
        setAddError(res.message);
      }
    } catch (err) {
      setAddError("Failed to add expense");
    } finally {
      setAddLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-slate-900" />
        <p className="mt-4 text-sm font-medium text-slate-600">Loading SpendGrid...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <header className="border-b border-slate-100 py-4 px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 text-white p-1.5 rounded-lg">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">LedgerMinimal</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setAuthModalType("login");
                setAuthModalOpen(true);
              }}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 transition"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthModalType("signup");
                setAuthModalOpen(true);
              }}
              className="text-sm font-medium bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition"
            >
              Get Started
            </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col justify-center items-center px-6 md:px-12 py-16 max-w-6xl mx-auto w-full">
          <div className="text-center max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold text-slate-800">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Simplified Expenditure Management</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Financial ledger <br className="hidden md:inline" />
              <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                made simple.
              </span>
            </h1>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Manage, audit, and trace every organizational expense in real-time. Beautifully structured, minimal dashboard built for absolute clarity.
            </p>
            <div className="flex justify-center pt-4">
              <button
                onClick={() => {
                  setAuthModalType("signup");
                  setAuthModalOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium px-8 py-3.5 rounded-xl shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20 transition-all transform hover:-translate-y-0.5 text-base"
              >
                Start tracking free
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full border-t border-slate-100 pt-16">
            <div className="space-y-3">
              <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center border border-slate-100 text-slate-900">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Instant Tracking</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Log expenses immediately with automatic category classification. Monitor organizational burn rate instantly.
              </p>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center border border-slate-100 text-slate-900">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Real-time Auditing</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Clean and transparent overview of historical ledger records. Filter and sort expenses by categories or queries easily.
              </p>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center border border-slate-100 text-slate-900">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Secure & Reliable</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                State-of-the-art secure session cookies, standard auth validation, and isolated account records protect your data.
              </p>
            </div>
          </div>
        </main>

        <footer className="border-t border-slate-100 py-8 px-6 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} SpendGrid. All rights reserved.</p>
        </footer>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialType={authModalType}
        />
      </div>
    );
  }

  const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <div className="bg-slate-900 text-white p-1 rounded-lg">
            <Wallet className="h-4 w-4" />
          </div>
          <span className="font-bold text-slate-950 tracking-tight">SpendGrid</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab("expenses")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
              activeTab === "expenses"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Expenses</span>
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
              activeTab === "profile"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
        {activeTab === "expenses" ? (
          <div className="p-8 md:p-12 space-y-8 flex-1 overflow-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Financial Ledger</h1>
                <p className="text-slate-500 text-sm mt-1">Manage and audit your organizational expenditure.</p>
              </div>
              <button
                onClick={() => setAddModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Expense</span>
              </button>
            </div>

            <form onSubmit={handleSearch} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-950 focus:border-slate-950 text-sm"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-slate-950 focus:border-slate-950 text-sm"
              >
                <option value="All Categories">All Categories</option>
                <option value="essentials">Essentials</option>
                <option value="utilities">Utilities</option>
                <option value="office">Office</option>
                <option value="food">Food</option>
                <option value="others">Others</option>
              </select>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-slate-950 hover:bg-slate-900 text-white text-sm font-semibold px-5 py-2 rounded-lg transition"
                >
                  Search
                </button>
                {(searchQuery || categoryFilter !== "All Categories") && (
                  <button
                    type="button"
                    onClick={handleResetSearch}
                    className="border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold px-3 py-2 rounded-lg transition"
                  >
                    Reset
                  </button>
                )}
              </div>
            </form>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {expenses.length > 0 ? (
                      expenses.map((item) => (
                        <tr
                          key={item.expense_id}
                          className="hover:bg-slate-50 transition cursor-pointer"
                        >
                          <td className="px-6 py-4 font-semibold text-slate-900">
                            <Link href={`/expense/${item.expense_id}`} className="hover:underline block">
                              {item.title}
                            </Link>
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-slate-900">
                            ${item.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 uppercase tracking-wide">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {new Date(item.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              href={`/expense/${item.expense_id}`}
                              className="inline-flex items-center justify-center p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-950 hover:bg-slate-50 transition"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                          No expenses found. Click "+ Add Expense" to log your first record.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 md:p-12 max-w-md mx-auto w-full space-y-8 flex-1 flex flex-col justify-center">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-6">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-3xl font-bold shadow-md">
                {user.user_name ? user.user_name.charAt(0).toUpperCase() : "U"}
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">{user.user_name}</h2>
              </div>

              <div className="border-t border-slate-100 pt-4 text-left space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Email</span>
                  <span className="text-slate-900 font-semibold">{user.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Total Expenses</span>
                  <span className="text-2xl font-bold text-slate-900 mt-1 block">{expenses.length}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Total Amount</span>
                  <span className="text-2xl font-bold text-slate-900 mt-1 block">
                    ${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 border border-red-200 hover:bg-red-50 text-red-600 font-semibold py-2.5 rounded-xl transition text-sm shadow-sm"
                >
                  <LogOut className="h-4.5 w-4.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-md bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Add New Expense</DialogTitle>
            <DialogDescription className="text-slate-500">Record a new organizational expenditure detail.</DialogDescription>
          </DialogHeader>

          {addError && (
            <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg border border-red-100">
              {addError}
            </div>
          )}

          <form onSubmit={handleAddExpense} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Title</label>
              <input
                type="text"
                required
                value={addTitle}
                onChange={(e) => setAddTitle(e.target.value)}
                placeholder="e.g. AWS Production Server"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-950 focus:border-slate-950 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-950 focus:border-slate-950 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Category</label>
              <select
                value={addCategory}
                onChange={(e) => setAddCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-slate-950 focus:border-slate-950 text-sm"
              >
                <option value="essentials">Essentials</option>
                <option value="utilities">Utilities</option>
                <option value="office">Office</option>
                <option value="food">Food</option>
                <option value="others">Others</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-2 rounded-lg transition text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addLoading}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 rounded-lg transition text-sm flex items-center justify-center"
              >
                {addLoading ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : "Save Expense"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
