import OrdersSection from '../components/OrdersSection';
import { useNavigate } from 'react-router-dom';

function Orders() {
  const navigate = useNavigate();

  return <OrdersSection onBack={() => navigate('/')} />;
}

export default Orders;
