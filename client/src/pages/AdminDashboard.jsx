import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const getStatusBadge = (status) => {
  const badges = {
    pending: { text: 'Pending', color: '#FCD34D', bg: '#FEF3C7' },
    active: { text: 'Active', color: '#34D399', bg: '#D1FAE5' },
    inactive: { text: 'Inactive', color: '#F87171', bg: '#FEE2E2' }
  };
  const badge = badges[status] || badges.pending;
  return (
    <span className="status-badge" style={{ 
      color: badge.color, 
      backgroundColor: badge.bg 
    }}>
      {badge.text}
    </span>
  );
};

const CustomerDetailsPanel = ({ customer, onClose, products }) => (
  <div className="details-panel">
    <div className="details-header">
      <h3>Customer Details</h3>
      <button onClick={onClose} className="close-btn">×</button>
    </div>
    <div className="details-content">
      <div className="detail-row">
        <span className="detail-label">Order placed</span>
        <span className="detail-value">{customer.lastOrder}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Order #</span>
        <span className="detail-value">{customer.sku}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Ship to</span>
        <span className="detail-value">Order Total: {customer.spend}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Order Status</span>
        <span className="detail-value">{getStatusBadge(customer.status)}</span>
      </div>
      <div className="product-images">
        {products.slice(0, 5).map((product, idx) => (
          <img key={idx} src={product.image_url} alt="" className="mini-product-img" />
        ))}
        <span className="more-products">+5 more</span>
      </div>
    </div>
    <div className="details-footer">
      <p>Customer Service has logged 5 issues for this order. The last update was 2 hours ago.</p>
      <button className="btn-outline">Show detail list</button>
    </div>
  </div>
);

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;
  
  const subtotal = order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const shipping = 5.00;
  const tax = subtotal * 0.1;
  const total = order.total_amount || (subtotal + shipping + tax);
  
  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-labelledby="order-modal-title"
      aria-modal="true"
    >
      <div 
        className="order-details-modal" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="order-modal-header">
          <div className="order-modal-title-section">
            <span className="order-icon">📦</span>
            <div>
              <h2 id="order-modal-title" className="order-modal-title">Order #{order.id}</h2>
              <p className="order-modal-subtitle">
                Placed on {new Date(order.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="order-modal-close"
            aria-label="Close order details"
          >
            ✕
          </button>
        </div>
        
        <div className="order-modal-body">
          {/* Customer Info Card */}
          <div className="info-card customer-card">
            <div className="card-header">
              <span className="card-icon">👤</span>
              <h3 className="card-title">Customer Information</h3>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label className="info-label">Customer Name</label>
                <p className="info-value">
                  {order.user?.firstName} {order.user?.lastName}
                </p>
              </div>
              <div className="info-item">
                <label className="info-label">Email Address</label>
                <p className="info-value">{order.user?.email}</p>
              </div>
              <div className="info-item">
                <label className="info-label">Order Time</label>
                <p className="info-value">
                  {new Date(order.created_at).toLocaleString('en-US', { 
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </p>
              </div>
              <div className="info-item">
                <label className="info-label">Order Status</label>
                <div className="info-value">{getStatusBadge(order.status?.toLowerCase() || 'pending')}</div>
              </div>
            </div>
          </div>

          {/* Order Items Card */}
          <div className="info-card items-card">
            <div className="card-header">
              <span className="card-icon">🛒</span>
              <h3 className="card-title">Order Items ({order.items?.length || 0})</h3>
            </div>
            <div className="order-items-list">
              {order.items?.map((item, idx) => (
                <div key={idx} className="order-item">
                  <div className="item-image-wrapper">
                    {item.product?.imageUrl ? (
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product_name || 'Product'}
                        className="item-image"
                      />
                    ) : (
                      <div className="item-image-placeholder">📦</div>
                    )}
                  </div>
                  <div className="item-details">
                    <h4 className="item-name">
                      {item.product_name || item.product?.name || 'Unknown Product'}
                    </h4>
                    <div className="item-meta">
                      <span className="item-price">${item.price.toFixed(2)}</span>
                      <span className="item-separator">×</span>
                      <span className="item-quantity">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="item-subtotal">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="info-card summary-card">
            <div className="card-header">
              <span className="card-icon">💰</span>
              <h3 className="card-title">Order Summary</h3>
            </div>
            <div className="summary-rows">
              <div className="summary-row">
                <span className="summary-label">Subtotal</span>
                <span className="summary-value">${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Shipping Fee</span>
                <span className="summary-value">${shipping.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Tax (10%)</span>
                <span className="summary-value">${tax.toFixed(2)}</span>
              </div>
              <div className="summary-row summary-total">
                <span className="summary-label">Total Amount</span>
                <span className="summary-value-total">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Information Card */}
          <div className="info-card delivery-card">
            <div className="card-header">
              <span className="card-icon">🚚</span>
              <h3 className="card-title">Delivery Information</h3>
            </div>
            <div className="delivery-content">
              <div className="info-grid">
                <div className="info-item">
                  <label className="info-label">Shipping Method</label>
                  <p className="info-value">Standard Shipping</p>
                </div>
                <div className="info-item">
                  <label className="info-label">Estimated Delivery</label>
                  <p className="info-value">
                    {new Date(new Date(order.created_at).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="shipping-address">
                <label className="info-label">Shipping Address</label>
                <address className="address-text">
                  {order.user?.firstName} {order.user?.lastName}<br />
                  123 Main Street<br />
                  New York, NY 10001<br />
                  United States
                </address>
              </div>
              
              <div className="tracking-status">
                <label className="info-label">Tracking Status</label>
                <div className={`status-indicator status-${order.status?.toLowerCase() || 'pending'}`}>
                  <span className="status-dot"></span>
                  <span className="status-text">
                    {order.status === 'PENDING' ? 'Order Placed - Preparing for shipment' : 
                     order.status === 'PROCESSING' ? 'Processing - Being prepared' : 
                     order.status === 'SHIPPED' ? 'Shipped - In transit' : 
                     'Delivered'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
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
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    stock: 0
  });
  
  // Data for charts
  const [revenueData, setRevenueData] = useState([
    { month: 'Jan', revenue: 45000, orders: 120 },
    { month: 'Feb', revenue: 52000, orders: 145 },
    { month: 'Mar', revenue: 48000, orders: 132 },
    { month: 'Apr', revenue: 61000, orders: 167 },
    { month: 'May', revenue: 55000, orders: 151 },
    { month: 'Jun', revenue: 72000, orders: 189 },
    { month: 'Jul', revenue: 68000, orders: 178 },
    { month: 'Aug', revenue: 79000, orders: 203 },
    { month: 'Sep', revenue: 85000, orders: 221 },
    { month: 'Oct', revenue: 92000, orders: 241 },
    { month: 'Nov', revenue: 88000, orders: 229 },
    { month: 'Dec', revenue: 96000, orders: 258 }
  ]);
  
  const [categoryData] = useState([
    { name: 'Electronics', value: 35, color: '#3b82f6' },
    { name: 'Fashion', value: 25, color: '#8b5cf6' },
    { name: 'Home & Living', value: 20, color: '#10b981' },
    { name: 'Beauty', value: 12, color: '#f59e0b' },
    { name: 'Others', value: 8, color: '#6b7280' }
  ]);
  
  const [topProducts, setTopProducts] = useState([
    { name: 'Wireless Headphones', sales: 234, revenue: 11700, trend: 'up' },
    { name: 'Smart Watch', sales: 189, revenue: 28350, trend: 'up' },
    { name: 'Laptop Stand', sales: 156, revenue: 7800, trend: 'down' },
    { name: 'Phone Case', sales: 145, revenue: 2900, trend: 'up' },
    { name: 'USB Cable', sales: 132, revenue: 1980, trend: 'up' }
  ]);

  const loadData = useCallback(async () => {
    try {
      const [customersRes, productsRes, ordersRes] = await Promise.all([
        axios.get('/api/users', { withCredentials: true }),
        axios.get('/api/products', { withCredentials: true }),
        axios.get('/api/orders', { withCredentials: true }).catch(() => ({ data: [] }))
      ]);
      
      console.log('Loaded users:', customersRes.data);
      console.log('Total users:', customersRes.data.length);
      
      // Filter out admin users - only keep regular users for statistics
      const regularUsers = customersRes.data.filter(user => user.role !== 'ADMIN');
      console.log('Regular users (non-admin):', regularUsers.length);
      
      setProducts(productsRes.data);
      setOrders(ordersRes.data || []);
      
      // Calculate real stats from DB - excluding admin users
      const totalRevenue = (ordersRes.data || []).reduce((sum, order) => sum + (order.total_amount || 0), 0);
      const totalOrders = (ordersRes.data || []).length;
      const totalProducts = productsRes.data.length;
      const totalCustomers = regularUsers.length;
      
      setStats({
        totalRevenue: Math.round(totalRevenue),
        totalOrders,
        totalProducts,
        totalCustomers,
        revenueGrowth: 12.5,
        ordersGrowth: 8.2,
        productsGrowth: 0,
        customersGrowth: 15.3
      });
      
      // Calculate top products from orders
      const productSales = {};
      (ordersRes.data || []).forEach(order => {
        if (order.items) {
          order.items.forEach(item => {
            if (!productSales[item.product_id]) {
              productSales[item.product_id] = {
                id: item.product_id,
                name: item.product_name || 'Unknown',
                sales: 0,
                revenue: 0
              };
            }
            productSales[item.product_id].sales += item.quantity;
            productSales[item.product_id].revenue += item.price * item.quantity;
          });
        }
      });
      
      const topProductsList = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
        .map((p) => ({
          ...p,
          salesData: Array.from({ length: 12 }, () => Math.floor(Math.random() * 50 + 10))
        }));
      
      if (topProductsList.length > 0) {
        setTopProducts(topProductsList);
      }
      
      // Calculate revenue data from orders
      const monthlyRevenue = Array.from({ length: 12 }, (_, i) => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
        revenue: 0,
        orders: 0
      }));
      
      (ordersRes.data || []).forEach(order => {
        const month = new Date(order.created_at).getMonth();
        monthlyRevenue[month].revenue += order.total_amount || 0;
        monthlyRevenue[month].orders += 1;
      });
      
      setRevenueData(monthlyRevenue);
      
      // Process real customer data from registered users (excluding admins)
      const customersData = regularUsers.map((user) => {
        // Calculate real orders and spending for this user
        const userOrders = (ordersRes.data || []).filter(order => order.user_id === user.id);
        const totalSpend = userOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
        const orderCount = userOrders.length;
        const avgOrderValue = orderCount > 0 ? Math.round(totalSpend / orderCount) : 0;
        
        // Get last order date
        const lastOrderDate = userOrders.length > 0 
          ? new Date(Math.max(...userOrders.map(o => new Date(o.created_at)))).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : 'No orders yet';
        
        // Determine status based on activity
        let status = 'active';
        if (orderCount === 0) {
          status = 'inactive';
        } else if (userOrders.some(o => new Date(o.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))) {
          status = 'active';
        } else {
          status = 'pending';
        }
        
        // Créer le nom complet à partir de firstName et lastName
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email?.split('@')[0] || `User ${user.id}`;
        
        return {
          ...user,
          username: fullName,
          status,
          rating: orderCount > 0 ? (4 + Math.min(orderCount / 10, 1)).toFixed(1) : '0.0',
          orders: orderCount,
          totalSpend: Math.round(totalSpend),
          spend: `$${totalSpend.toFixed(2)}`,
          sku: `USER-${user.id}`,
          lastOrder: lastOrderDate,
          avgOrderValue
        };
      });
      
      // Sort by registration date (most recent first) for inactive users, then by spending
      customersData.sort((a, b) => {
        if (a.totalSpend === 0 && b.totalSpend === 0) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return b.totalSpend - a.totalSpend;
      });
      
      console.log('Processed customers:', customersData);
      console.log('Setting customers state with:', customersData.length, 'users');
      setCustomers(customersData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }, []);

  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== 'ADMIN') {
      navigate('/');
    }
    loadData();
  }, [user, navigate, loadData]);

  console.log('Current customers state:', customers.length);
  console.log('Search query:', searchQuery);
  console.log('Filter status:', filterStatus);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  console.log('Filtered customers:', filteredCustomers.length);

  const filteredProducts = products.filter(product => 
    product.name?.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
    product.category_name?.toLowerCase().includes(productSearchQuery.toLowerCase())
  );

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      image_url: '',
      stock: 0
    });
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category_id: product.category_id || '',
      image_url: product.image_url,
      stock: product.stock || 0
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async () => {
    try {
      if (editingProduct) {
        // Update existing product
        await axios.put(`/api/products/${editingProduct.id}`, productFormData, { withCredentials: true });
      } else {
        // Create new product
        await axios.post('/api/products', productFormData, { withCredentials: true });
      }
      setShowProductModal(false);
      loadData(); // Reload products
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product. Please try again.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${productId}`, { withCredentials: true });
        loadData(); // Reload products
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleUpdateStock = async (productId, newStock) => {
    try {
      await axios.patch(`/api/products/${productId}/stock`, { stock: newStock }, { withCredentials: true });
      loadData(); // Reload products
    } catch (error) {
      console.error('Failed to update stock:', error);
      alert('Failed to update stock. Please try again.');
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">🛍️</div>
            <span className="logo-text">BeliBeli Admin</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <button className={activeTab === 'dashboard' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('dashboard')}>
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </button>
          <button className={activeTab === 'customers' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('customers')}>
            <span className="nav-icon">👥</span>
            <span>Customers</span>
          </button>
          <button className={activeTab === 'products' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('products')}>
            <span className="nav-icon">📦</span>
            <span>Products</span>
          </button>
          <button className={activeTab === 'orders' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('orders')}>
            <span className="nav-icon">🛒</span>
            <span>Orders</span>
          </button>
          <button className={activeTab === 'settings' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('settings')}>
            <span className="nav-icon">⚙️</span>
            <span>Settings</span>
          </button>
        </nav>

        <button className="sidebar-footer" onClick={() => navigate('/')}>
          <span className="nav-icon">🏠</span>
          <span>Back to Store</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Content Area */}
        {activeTab === 'dashboard' ? (
          <>
            <div className="dashboard-header-title">
              <h1>📊 Dashboard Overview</h1>
              <p className="dashboard-subtitle">Monitor your e-commerce performance</p>
            </div>
            {/* Top Performance Cards - Modern Design with Integrated Charts */}
            <div className="performance-cards-grid">
              <div className="performance-card">
                <div className="performance-header">
                  <div className="performance-info">
                    <span className="performance-label">Total Revenue</span>
                    <div className="performance-value">${(stats.totalRevenue / 1000).toFixed(2)}K</div>
                  </div>
                  <div className="performance-badge positive">
                    <span className="badge-icon">▲</span>
                    <span className="badge-value">+{stats.revenueGrowth}%</span>
                  </div>
                </div>
                <div className="mini-chart-container">
                  <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="mini-sparkline">
                    <defs>
                      <linearGradient id="revenueSparkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    {(() => {
                      const data = revenueData.slice(-8).map(d => d.revenue);
                      const max = Math.max(...data);
                      const points = data.map((val, i) => `${(i / (data.length - 1)) * 200},${60 - (val / max) * 50}`).join(' ');
                      return (
                        <>
                          <polygon points={`0,60 ${points} 200,60`} fill="url(#revenueSparkGradient)" />
                          <polyline points={points} fill="none" stroke="#10b981" strokeWidth="2" />
                        </>
                      );
                    })()}
                  </svg>
                </div>
              </div>

              <div className="performance-card">
                <div className="performance-header">
                  <div className="performance-info">
                    <span className="performance-label">Total Orders</span>
                    <div className="performance-value">{stats.totalOrders}</div>
                  </div>
                  <div className="performance-badge positive">
                    <span className="badge-icon">▲</span>
                    <span className="badge-value">+{stats.ordersGrowth}%</span>
                  </div>
                </div>
                <div className="mini-chart-container">
                  <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="mini-sparkline">
                    <defs>
                      <linearGradient id="ordersSparkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    {(() => {
                      const data = revenueData.slice(-8).map(d => d.orders);
                      const max = Math.max(...data);
                      const points = data.map((val, i) => `${(i / (data.length - 1)) * 200},${60 - (val / max) * 50}`).join(' ');
                      return (
                        <>
                          <polygon points={`0,60 ${points} 200,60`} fill="url(#ordersSparkGradient)" />
                          <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="2" />
                        </>
                      );
                    })()}
                  </svg>
                </div>
              </div>

              <div className="performance-card">
                <div className="performance-header">
                  <div className="performance-info">
                    <span className="performance-label">Products</span>
                    <div className="performance-value">{stats.totalProducts}</div>
                  </div>
                  <div className="performance-badge neutral">
                    <span className="badge-icon">=</span>
                    <span className="badge-value">0%</span>
                  </div>
                </div>
                <div className="mini-chart-container">
                  <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="mini-sparkline">
                    <defs>
                      <linearGradient id="productsSparkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    {(() => {
                      const data = Array.from({length: 8}, (_, i) => stats.totalProducts + Math.sin(i) * 10);
                      const max = Math.max(...data);
                      const points = data.map((val, i) => `${(i / (data.length - 1)) * 200},${60 - (val / max) * 50}`).join(' ');
                      return (
                        <>
                          <polygon points={`0,60 ${points} 200,60`} fill="url(#productsSparkGradient)" />
                          <polyline points={points} fill="none" stroke="#8b5cf6" strokeWidth="2" />
                        </>
                      );
                    })()}
                  </svg>
                </div>
              </div>

              <div className="performance-card">
                <div className="performance-header">
                  <div className="performance-info">
                    <span className="performance-label">Customers</span>
                    <div className="performance-value">{stats.totalCustomers}</div>
                  </div>
                  <div className="performance-badge positive">
                    <span className="badge-icon">▲</span>
                    <span className="badge-value">+{stats.customersGrowth}%</span>
                  </div>
                </div>
                <div className="mini-chart-container">
                  <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="mini-sparkline">
                    <defs>
                      <linearGradient id="customersSparkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    {(() => {
                      const baseValue = stats.totalCustomers;
                      const data = Array.from({length: 8}, (_, i) => baseValue * (0.7 + i * 0.04));
                      const max = Math.max(...data);
                      const points = data.map((val, i) => `${(i / (data.length - 1)) * 200},${60 - (val / max) * 50}`).join(' ');
                      return (
                        <>
                          <polygon points={`0,60 ${points} 200,60`} fill="url(#customersSparkGradient)" />
                          <polyline points={points} fill="none" stroke="#f59e0b" strokeWidth="2" />
                        </>
                      );
                    })()}
                  </svg>
                </div>
              </div>
            </div>
          <div className="dashboard-content">
            {/* Revenue Chart - Area Chart */}
            <div className="chart-card full-width">
              <div className="chart-header">
                <h3>Revenue Overview</h3>
                <div className="chart-legend">
                  <span className="legend-item"><span className="dot revenue-new"></span> Revenue</span>
                </div>
              </div>
              <div className="area-chart-container">
                <svg className="area-chart-svg" viewBox="0 0 800 300" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  {(() => {
                    const maxRevenue = Math.max(...revenueData.map(d => d.revenue), 1);
                    const points = revenueData.map((data, index) => {
                      const x = (index / (revenueData.length - 1)) * 800;
                      const y = 280 - ((data.revenue / maxRevenue) * 260);
                      return `${x},${y}`;
                    }).join(' ');
                    const areaPoints = `0,280 ${points} 800,280`;
                    return (
                      <>
                        <polyline
                          points={points}
                          fill="none"
                          stroke="#8b5cf6"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <polygon
                          points={areaPoints}
                          fill="url(#revenueGradient)"
                        />
                        {revenueData.map((data, index) => {
                          const x = (index / (revenueData.length - 1)) * 800;
                          const y = 280 - ((data.revenue / maxRevenue) * 260);
                          return (
                            <g key={index}>
                              <circle cx={x} cy={y} r="5" fill="#8b5cf6" className="chart-point" />
                              <text x={x} y="295" textAnchor="middle" fontSize="12" fill="#9ca3af">{data.month}</text>
                            </g>
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>
              </div>
            </div>

            {/* Category Distribution - Full Width */}
            <div className="chart-card full-width">
              <div className="chart-header">
                <h3>Sales by Category</h3>
              </div>
              <div className="donut-chart">
                <svg viewBox="0 0 200 200" className="donut-svg">
                  {categoryData.map((cat, idx) => {
                    const total = categoryData.reduce((sum, c) => sum + c.value, 0);
                    let startAngle = 0;
                    for (let i = 0; i < idx; i++) {
                      startAngle += (categoryData[i].value / total) * 360;
                    }
                    const angle = (cat.value / total) * 360;
                    const largeArc = angle > 180 ? 1 : 0;
                    const endAngle = startAngle + angle;
                    
                    const x1 = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
                    const y1 = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
                    const x2 = 100 + 80 * Math.cos((endAngle - 90) * Math.PI / 180);
                    const y2 = 100 + 80 * Math.sin((endAngle - 90) * Math.PI / 180);
                    
                    return (
                      <path
                        key={idx}
                        d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={cat.color}
                        className="donut-segment"
                      />
                    );
                  })}
                  <circle cx="100" cy="100" r="50" fill="#1a1f2e" />
                </svg>
                <div className="donut-center">
                  <div className="donut-total">100%</div>
                  <div className="donut-label">Sales</div>
                </div>
              </div>
              <div className="category-legend">
                {categoryData.map((cat, idx) => (
                  <div key={idx} className="legend-row">
                    <div className="legend-info">
                      <span className="legend-dot" style={{ backgroundColor: cat.color }}></span>
                      <span className="legend-name">{cat.name}</span>
                    </div>
                    <span className="legend-value">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="chart-card full-width">
              <div className="chart-header">
                <h3>Recent Activity</h3>
              </div>
              <div className="activity-timeline">
                <div className="activity-item">
                  <div className="activity-icon order">🛒</div>
                  <div className="activity-content">
                    <div className="activity-title">New order #12345</div>
                    <div className="activity-desc">John Doe placed an order worth $150</div>
                    <div className="activity-time">5 minutes ago</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon customer">👤</div>
                  <div className="activity-content">
                    <div className="activity-title">New customer registered</div>
                    <div className="activity-desc">Jane Smith joined the platform</div>
                    <div className="activity-time">1 hour ago</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon product">📦</div>
                  <div className="activity-content">
                    <div className="activity-title">Product stock low</div>
                    <div className="activity-desc">Wireless Headphones - Only 5 units left</div>
                    <div className="activity-time">2 hours ago</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon revenue">💰</div>
                  <div className="activity-content">
                    <div className="activity-title">Payment received</div>
                    <div className="activity-desc">Order #12344 - $89.99 paid</div>
                    <div className="activity-time">3 hours ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </>
        ) : activeTab === 'products' ? (
          <div className="products-content">
            <div className="content-header-modern">
              <div>
                <h2>Products Management</h2>
                <p className="subtitle">Manage your product inventory ({filteredProducts.length} products)</p>
              </div>
              <div className="header-actions">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="search-box-modern"
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                />
                <button className="btn-primary-modern" onClick={handleAddProduct}>
                  + Add Product
                </button>
              </div>
            </div>
            
            <div className="products-table-container">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Sales</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{textAlign: 'center', padding: '40px'}}>
                        <div style={{color: '#6b7280'}}>
                          {productSearchQuery ? 'No products found' : 'No products available'}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => {
                      const stock = product.stock || 0;
                      const sales = orders.filter(o => o.items?.some(i => i.product_id === product.id)).length;
                      const isLowStock = stock < 10;
                      return (
                      <tr key={product.id}>
                        <td>
                          <div className="product-cell">
                            <img src={product.image_url} alt={product.name} className="product-thumb" />
                            <div>
                              <div className="product-name-table">{product.name}</div>
                              <div className="product-sku">SKU: {product.id}</div>
                            </div>
                          </div>
                        </td>
                        <td>{product.category_name || 'General'}</td>
                        <td className="price-cell">${product.price}</td>
                        <td>
                          <div className="stock-control">
                            <button 
                              className="stock-btn" 
                              onClick={() => handleUpdateStock(product.id, Math.max(0, stock - 1))}
                              disabled={stock === 0}
                            >
                              -
                            </button>
                            <span className={`stock-badge ${isLowStock ? 'low-stock' : 'in-stock'}`}>
                              {stock}
                            </span>
                            <button 
                              className="stock-btn" 
                              onClick={() => handleUpdateStock(product.id, stock + 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td>{sales} orders</td>
                        <td>
                          <span className="status-badge-modern completed">Active</span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button 
                              className="btn-icon-table" 
                              title="Edit" 
                              onClick={() => handleEditProduct(product)}
                            >
                              ✏️
                            </button>
                            <button 
                              className="btn-icon-table" 
                              title="Delete" 
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Product Modal */}
            {showProductModal && (
              <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                    <button className="modal-close" onClick={() => setShowProductModal(false)}>×</button>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>Product Name *</label>
                      <input 
                        type="text" 
                        className="form-input"
                        value={productFormData.name}
                        onChange={(e) => setProductFormData({...productFormData, name: e.target.value})}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea 
                        className="form-input"
                        value={productFormData.description}
                        onChange={(e) => setProductFormData({...productFormData, description: e.target.value})}
                        placeholder="Enter product description"
                        rows="3"
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Price ($) *</label>
                        <input 
                          type="number" 
                          className="form-input"
                          value={productFormData.price}
                          onChange={(e) => setProductFormData({...productFormData, price: e.target.value})}
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>
                      <div className="form-group">
                        <label>Stock *</label>
                        <input 
                          type="number" 
                          className="form-input"
                          value={productFormData.stock}
                          onChange={(e) => setProductFormData({...productFormData, stock: parseInt(e.target.value) || 0})}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Category ID</label>
                      <input 
                        type="number" 
                        className="form-input"
                        value={productFormData.category_id}
                        onChange={(e) => setProductFormData({...productFormData, category_id: e.target.value})}
                        placeholder="Enter category ID"
                      />
                    </div>
                    <div className="form-group">
                      <label>Image URL *</label>
                      <input 
                        type="text" 
                        className="form-input"
                        value={productFormData.image_url}
                        onChange={(e) => setProductFormData({...productFormData, image_url: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    {productFormData.image_url && (
                      <div className="image-preview">
                        <img src={productFormData.image_url} alt="Preview" />
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button className="btn-secondary" onClick={() => setShowProductModal(false)}>
                      Cancel
                    </button>
                    <button 
                      className="btn-primary-modern" 
                      onClick={handleSaveProduct}
                      disabled={!productFormData.name || !productFormData.price || !productFormData.image_url}
                    >
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'orders' ? (
          <div className="orders-content">
            <div className="content-header-modern">
              <div className="header-title-section">
                <h1>📦 Orders Management</h1>
                <p className="header-subtitle">{orders.length} total orders</p>
              </div>
              <div className="header-actions-modern">
                <div className="search-box-modern">
                  <span className="search-icon">🔍</span>
                  <input 
                    type="text" 
                    placeholder="Search orders..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="btn-primary-modern">
                  <span>+</span> New Order
                </button>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No orders yet</h3>
                <p>Orders will appear here once customers start placing orders</p>
              </div>
            ) : (
              <div className="table-container" style={{ marginTop: '20px' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Products</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, idx) => (
                      <tr 
                        key={order.id || idx} 
                        onClick={() => setSelectedOrder(order)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>
                          <strong>#{order.id || `ORD-${1000 + idx}`}</strong>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="customer-avatar-large" style={{ width: '40px', height: '40px', fontSize: '16px' }}>
                              {order.user?.firstName?.[0] || 'U'}
                            </div>
                            <div>
                              <div style={{ fontWeight: '500' }}>
                                {order.user?.firstName || 'Unknown'} {order.user?.lastName || 'User'}
                              </div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                {order.user?.email || 'No email'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          {order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'N/A'}
                        </td>
                        <td>
                          <div style={{ maxWidth: '300px' }}>
                            {order.items && order.items.length > 0 ? (
                              <div>
                                {order.items.map((item, itemIdx) => (
                                  <div key={itemIdx} style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    padding: '4px 0',
                                    borderBottom: itemIdx < order.items.length - 1 ? '1px solid #f0f0f0' : 'none'
                                  }}>
                                    <span style={{ fontSize: '13px' }}>
                                      {item.product_name || item.product?.name || 'Unknown'} × {item.quantity}
                                    </span>
                                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#10b981' }}>
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span style={{ color: '#999' }}>No items</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <strong style={{ fontSize: '16px', color: '#10b981' }}>
                            ${order.total_amount ? order.total_amount.toFixed(2) : '0.00'}
                          </strong>
                        </td>
                        <td>
                          {getStatusBadge(order.status?.toLowerCase() || 'pending')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
              <OrderDetailsModal 
                order={selectedOrder} 
                onClose={() => setSelectedOrder(null)} 
              />
            )}
          </div>
        ) : activeTab === 'customers' ? (
          <div className="customers-content">
            <div className="content-header-modern">
              <div className="header-title-section">
                <h1>👥 All Users</h1>
                <p className="header-subtitle">{filteredCustomers.length} registered users</p>
              </div>
              <div className="header-actions-modern">
                <div className="search-box-modern">
                  <span className="search-icon">🔍</span>
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select 
                  className="filter-dropdown-modern"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            {filteredCustomers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <h3>No users found</h3>
                <p>No users match your search criteria</p>
              </div>
            ) : (
              <div className="table-container" style={{ marginTop: '20px' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>User</th>
                      <th>Email</th>
                      <th>Orders</th>
                      <th>Total Spent</th>
                      <th>Avg Order</th>
                      <th>Last Order</th>
                      <th>Status</th>
                      <th>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer, idx) => (
                      <tr key={customer.id}>
                        <td>{idx + 1}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="customer-avatar-large" style={{ width: '40px', height: '40px', fontSize: '16px' }}>
                              {customer.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <span style={{ fontWeight: '500' }}>{customer.username}</span>
                          </div>
                        </td>
                        <td>{customer.email}</td>
                        <td>{customer.orders}</td>
                        <td style={{ fontWeight: '600', color: '#10b981' }}>${customer.totalSpend}</td>
                        <td>${customer.avgOrderValue}</td>
                        <td>{customer.lastOrder}</td>
                        <td>{getStatusBadge(customer.status)}</td>
                        <td>⭐ {customer.rating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="content-wrapper">
            <div className="content-header">
              <div className="header-left">
                <h1>Products</h1>
                <div className="filter-tabs">
                <button className={filterStatus === 'all' ? 'filter-tab active' : 'filter-tab'} onClick={() => setFilterStatus('all')}>
                  All Customers
                </button>
                <button className={filterStatus === 'active' ? 'filter-tab active' : 'filter-tab'} onClick={() => setFilterStatus('active')}>
                  Active
                </button>
                <button className={filterStatus === 'pending' ? 'filter-tab active' : 'filter-tab'} onClick={() => setFilterStatus('pending')}>
                  Pending
                </button>
                <button className={filterStatus === 'inactive' ? 'filter-tab active' : 'filter-tab'} onClick={() => setFilterStatus('inactive')}>
                  Inactive
                </button>
              </div>
            </div>
            <div className="header-right">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search customers..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="btn-primary">+ New Customer</button>
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>Customer Name</th>
                  <th>Status</th>
                  <th>Rating</th>
                  <th>Orders</th>
                  <th>Total Spend</th>
                  <th>SKU</th>
                  <th>Last Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} onClick={() => setSelectedCustomer(customer)}>
                    <td>
                      <input type="checkbox" onClick={(e) => e.stopPropagation()} />
                    </td>
                    <td>
                      <div className="customer-cell">
                        <div className="customer-avatar">
                          {customer.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="customer-info">
                          <div className="customer-name">{customer.username || 'Unknown'}</div>
                          <div className="customer-email">{customer.email || 'No email'}</div>
                        </div>
                      </div>
                    </td>
                    <td>{getStatusBadge(customer.status)}</td>
                    <td>
                      <span className="rating">⭐ {customer.rating}</span>
                    </td>
                    <td>{customer.orders}</td>
                    <td><strong>{customer.spend}</strong></td>
                    <td><span className="sku-badge">{customer.sku}</span></td>
                    <td>{customer.lastOrder}</td>
                    <td>
                      <button className="action-btn" onClick={(e) => { e.stopPropagation(); setSelectedCustomer(customer); }}>
                        ⋯
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <span className="pagination-info">Showing 1-8 of {customers.length}</span>
            <div className="pagination-controls">
              <button className="pagination-btn">Previous</button>
              <button className="pagination-btn active">1</button>
              <button className="pagination-btn">2</button>
              <button className="pagination-btn">3</button>
              <button className="pagination-btn">Next</button>
            </div>
          </div>
        </div>
        )}
      </main>

      {/* Details Panel */}
      {selectedCustomer && (
        <CustomerDetailsPanel 
          customer={selectedCustomer} 
          products={products}
          onClose={() => setSelectedCustomer(null)} 
        />
      )}
    </div>
  );
}

export default AdminDashboard;
