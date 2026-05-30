"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/axios";

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
        return { success: true };
      }
      return { success: false, message: res.data.message || "Login failed" };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Invalid credentials",
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
        return { success: true };
      }
      return { success: false, message: res.data.message || "Signup failed" };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Signup failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post("/auth/logout");
    } catch (err) {
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
        return { success: true };
      }
      return { success: false, message: res.data.message || "Failed to add expense" };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to add expense",
      };
    }
  };

  const updateExpense = async (id, title, amount, category) => {
    try {
      const res = await api.put(`/expense/${id}`, { title, amount: parseFloat(amount), category });
      if (res.data && res.data.success) {
        await refreshExpenses();
        return { success: true };
      }
      return { success: false, message: res.data.message || "Failed to update expense" };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update expense",
      };
    }
  };

  const deleteExpense = async (id) => {
    try {
      const res = await api.delete(`/expense/${id}`);
      if (res.data && res.data.success) {
        await refreshExpenses();
        return { success: true };
      }
      return { success: false, message: res.data.message || "Failed to delete expense" };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to delete expense",
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
      return { success: false };
    } catch (err) {
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
