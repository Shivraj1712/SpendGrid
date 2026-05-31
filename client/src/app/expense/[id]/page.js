"use client";

import { useEffect, useState, use } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { handleApiError } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Calendar,
  Layers,
  DollarSign,
  Trash2,
  Edit2,
  Save,
  X,
  Loader2,
  Wallet,
} from "lucide-react";

export default function ExpensePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const { updateExpense, deleteExpense, user, loading: authLoading } = useAuth();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
      return;
    }
  }, [user, authLoading]);

  const fetchExpense = async () => {
    try {
      const res = await api.get(`/expense/${id}`);
      if (res.data && res.data.success) {
        const data = res.data.data;
        setExpense(data);
        setEditTitle(data.title);
        setEditAmount(data.amount.toString());
        setEditCategory(data.category);
      } else {
        const msg = res.data?.message || "Expense not found";
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      const errorMsg = handleApiError(err, "Failed to fetch expense details");
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchExpense();
    }
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError("");

    try {
      const res = await updateExpense(id, editTitle, editAmount, editCategory);
      if (res.success) {
        setExpense({
          ...expense,
          title: editTitle,
          amount: parseFloat(editAmount),
          category: editCategory,
        });
        setEditMode(false);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Failed to update expense");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteConfirmOpen(false);
    setActionLoading(true);
    setError("");

    try {
      const res = await deleteExpense(id);
      if (res.success) {
        router.push("/");
      } else {
        setError(res.message);
        setActionLoading(false);
      }
    } catch (err) {
      setError("Failed to delete expense");
      setActionLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-slate-900" />
        <p className="mt-4 text-sm font-medium text-slate-600">Loading details...</p>
      </div>
    );
  }

  if (error && !expense) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-sm w-full space-y-4">
          <div className="bg-red-50 text-red-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
            <X className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Error</h2>
          <p className="text-slate-500 text-sm">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 rounded-xl transition text-sm flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <header className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 md:px-12 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 text-white p-1 rounded-lg">
            <Wallet className="h-4 w-4" />
          </div>
          <span className="font-bold text-slate-950 tracking-tight text-sm sm:text-base">LedgerMinimal</span>
        </div>
        <button
          onClick={() => router.push("/")}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 px-2.5 py-1.5 rounded-lg transition flex items-center gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Dashboard</span>
        </button>
      </header>

      <main className="flex-1 p-4 sm:p-6 md:p-12 max-w-2xl mx-auto w-full flex flex-col justify-center">
        {error && (
          <div className="mb-4 bg-red-50 text-red-600 text-xs px-3 py-2.5 rounded-lg border border-red-100 font-medium">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-4 py-4 sm:px-6 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expense Record</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-800 uppercase tracking-wide">
              {expense.category}
            </span>
          </div>

          <div className="p-4 sm:p-6 md:p-8">
            {editMode ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Title</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-slate-950 focus:border-slate-950 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-slate-950 focus:border-slate-950 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-slate-950 focus:border-slate-950 text-sm"
                  >
                    <option value="essentials">Essentials</option>
                    <option value="utilities">Utilities</option>
                    <option value="office">Office</option>
                    <option value="food">Food</option>
                    <option value="others">Others</option>
                  </select>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => {
                      setEditTitle(expense.title);
                      setEditAmount(expense.amount.toString());
                      setEditCategory(expense.category);
                      setEditMode(false);
                    }}
                    className="w-full sm:flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-lg transition text-sm flex items-center justify-center gap-1.5"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full sm:flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg transition text-sm flex items-center justify-center gap-1.5"
                  >
                    {actionLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug break-words">{expense.title}</h2>
                  <p className="text-xs text-slate-400 mt-1">ID: {expense.expense_id}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 py-6 border-y border-slate-100">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Amount</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                      ${expense.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Created On</span>
                    <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 mt-1">
                      <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {new Date(expense.created_at).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => setEditMode(true)}
                    disabled={actionLoading}
                    className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-lg transition text-sm flex items-center justify-center gap-1.5"
                  >
                    <Edit2 className="h-4 w-4 text-slate-500" />
                    <span>Update Details</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirmOpen(true)}
                    disabled={actionLoading}
                    className="flex-1 border border-red-200 hover:bg-red-50 text-red-600 font-semibold py-2.5 rounded-lg transition text-sm flex items-center justify-center gap-1.5"
                  >
                    {actionLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span>Delete Expense</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Delete Expense?</DialogTitle>
            <DialogDescription className="text-slate-500">
              Are you sure you want to delete this expense? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <button
              onClick={() => setDeleteConfirmOpen(false)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition text-sm shadow-sm"
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
