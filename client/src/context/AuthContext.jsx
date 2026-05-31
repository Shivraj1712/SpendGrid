"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { handleApiError } from "@/lib/utils";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfileAndExpenses = async () => {
    try {
      const profileRes = await api.get("/auth/profile");
      if (profileRes.data && profileRes.data.success) {
        setUser(profileRes.data.data);
        const expensesRes = await api.get("/expense");
        if (expensesRes.data && expensesRes.data.success) {
          setExpenses(expensesRes.data.data || []);
        }
      } else {
        setUser(null);
        setExpenses([]);
      }
    } catch (err) {
      setUser(null);
      setExpenses([]);
      // Only toast on initial fetch failures if it is a real error like network or 500 server error
      if (err.response && err.response.status !== 401) {
        toast.error(handleApiError(err, "Failed to load profile"));
      } else if (!err.response) {
        toast.error(handleApiError(err, "Failed to connect to server"));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndExpenses();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data && res.data.success) {
        const profileRes = await api.get("/auth/profile");
        if (profileRes.data && profileRes.data.success) {
          setUser(profileRes.data.data);
          const expensesRes = await api.get("/expense");
          if (expensesRes.data && expensesRes.data.success) {
            setExpenses(expensesRes.data.data || []);
          }
        }
        toast.success("Successfully logged in!");
        return { success: true };
      }
      const errorMsg = res.data.message || "Login failed";
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    } catch (err) {
      const errorMsg = handleApiError(err, "Invalid credentials");
      toast.error(errorMsg);
      return {
        success: false,
        message: errorMsg,
      };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/signup", {
        user_name: username,
        email,
        password,
      });
      if (res.data && res.data.success) {
        const profileRes = await api.get("/auth/profile");
        if (profileRes.data && profileRes.data.success) {
          setUser(profileRes.data.data);
          const expensesRes = await api.get("/expense");
          if (expensesRes.data && expensesRes.data.success) {
            setExpenses(expensesRes.data.data || []);
          }
        }
        toast.success("Successfully signed up!");
        return { success: true };
      }
      const errorMsg = res.data.message || "Signup failed";
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    } catch (err) {
      const errorMsg = handleApiError(err, "Signup failed");
      toast.error(errorMsg);
      return {
        success: false,
        message: errorMsg,
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post("/auth/logout");
      toast.success("Logged out successfully.");
    } catch (err) {
      toast.error(handleApiError(err, "Logout failed"));
    } finally {
      setUser(null);
      setExpenses([]);
      setLoading(false);
    }
  };

  const refreshExpenses = async () => {
    try {
      const expensesRes = await api.get("/expense");
      if (expensesRes.data && expensesRes.data.success) {
        setExpenses(expensesRes.data.data || []);
      }
    } catch (err) {
    }
  };

  const addExpense = async (title, amount, category) => {
    try {
      const res = await api.post("/expense", { title, amount: parseFloat(amount), category });
      if (res.data && res.data.success) {
        await refreshExpenses();
        toast.success("Expense added successfully!");
        return { success: true };
      }
      const errorMsg = res.data.message || "Failed to add expense";
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    } catch (err) {
      const errorMsg = handleApiError(err, "Failed to add expense");
      toast.error(errorMsg);
      return {
        success: false,
        message: errorMsg,
      };
    }
  };

  const updateExpense = async (id, title, amount, category) => {
    try {
      const res = await api.put(`/expense/${id}`, { title, amount: parseFloat(amount), category });
      if (res.data && res.data.success) {
        await refreshExpenses();
        toast.success("Expense updated successfully!");
        return { success: true };
      }
      const errorMsg = res.data.message || "Failed to update expense";
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    } catch (err) {
      const errorMsg = handleApiError(err, "Failed to update expense");
      toast.error(errorMsg);
      return {
        success: false,
        message: errorMsg,
      };
    }
  };

  const deleteExpense = async (id) => {
    try {
      const res = await api.delete(`/expense/${id}`);
      if (res.data && res.data.success) {
        await refreshExpenses();
        toast.success("Expense deleted successfully!");
        return { success: true };
      }
      const errorMsg = res.data.message || "Failed to delete expense";
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    } catch (err) {
      const errorMsg = handleApiError(err, "Failed to delete expense");
      toast.error(errorMsg);
      return {
        success: false,
        message: errorMsg,
      };
    }
  };

  const searchExpenses = async (searchTerm, category) => {
    try {
      const res = await api.post(`/expense/search?searchTerm=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(category)}`);
      if (res.data && res.data.success) {
        setExpenses(res.data.data || []);
        return { success: true };
      }
      toast.error("Failed to search expenses");
      return { success: false };
    } catch (err) {
      toast.error(handleApiError(err, "Failed to search expenses"));
      return { success: false };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        expenses,
        loading,
        login,
        signup,
        logout,
        addExpense,
        updateExpense,
        deleteExpense,
        refreshExpenses,
        searchExpenses,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
