import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './TopBar.css';

function TopBar() {
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
            <Link to="/orders">
              📦 My Orders
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopBar;
