import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import MainLayout from './components/MainLayout';
import './App.css';

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

  return <MainLayout />;
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
