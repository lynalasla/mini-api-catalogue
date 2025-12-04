import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

function AuthModal({ isOpen, onClose, mode, onSwitchToLogin, onSwitchToSignup }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.name, formData.email, formData.password);
      }
      setFormData({ name: '', email: '', password: '' });
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || `${mode === 'login' ? 'Login' : 'Signup'} failed`);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <div className="modal active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>
          
          <button type="submit" className="btn-submit">
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>
        
        <div className="switch-auth">
          {mode === 'login' ? (
            <p>
              Don't have an account? 
              <button className="link-btn" onClick={onSwitchToSignup}>Sign Up</button>
            </p>
          ) : (
            <p>
              Already have an account? 
              <button className="link-btn" onClick={onSwitchToLogin}>Login</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
