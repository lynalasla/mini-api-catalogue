import { useAuth } from '../context/AuthContext';
import './TopBar.css';

function TopBar({ onShowOrders }) {
  const { user } = useAuth();

  return (
    <div className="top-bar">
      <div className="top-bar-content">
        <div className="top-bar-left">
          <a href="#">Download BeliBeli App</a>
          <a href="#">Mitra BeliBeli</a>
          <a href="#">About BeliBeli</a>
          <a href="#">BeliBeli Care</a>
          <a href="#">Promo</a>
        </div>
        <div className="top-bar-right">
          {user && (
            <a href="#" onClick={(e) => { e.preventDefault(); onShowOrders(); }}>
              📦 My Orders
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopBar;
