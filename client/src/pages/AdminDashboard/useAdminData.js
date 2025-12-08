/**
 * Custom Hook pour la gestion des données Admin Dashboard
 * Centralise toute la logique de fetching et état
 */

import { useState, useEffect, useCallback } from 'axios';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useAdminData = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 243085,
    totalOrders: 203,
    totalProducts: 129,
    totalCustomers: 34,
    revenueGrowth: 12.5,
    ordersGrowth: 8.2,
    productsGrowth: 0,
    customersGrowth: 15.3
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const [productsRes, ordersRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/api/products`, config),
        axios.get(`${API_URL}/api/orders`, config),
        axios.get(`${API_URL}/api/users`, config)
      ]);

      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      setCustomers(usersRes.data);

      // Calculate stats
      const totalRevenue = ordersRes.data.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
      setStats(prev => ({
        ...prev,
        totalRevenue,
        totalOrders: ordersRes.data.length,
        totalProducts: productsRes.data.length,
        totalCustomers: usersRes.data.length
      }));

      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    customers,
    products,
    orders,
    stats,
    loading,
    error,
    refetch: fetchAllData,
    setProducts,
    setOrders,
    setCustomers
  };
};
