import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Orders from './pages/Orders';
import ProductDetail from './pages/ProductDetail';
import SearchResults from './pages/SearchResults';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import './App.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        fontSize: '24px',
        color: '#ff6b00'
      }}>
        Loading...
      </div>
    );
  }

  return user ? children : <Navigate to="/" replace />;
}

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        fontSize: '24px',
        color: '#ff6b00'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="search" element={<SearchResults />} />
          <Route 
            path="orders" 
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
