/**
 * Status Badge Component
 * Affiche un badge de statut coloré (pending, active, inactive)
 */

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

export default getStatusBadge;
