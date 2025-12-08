import './QuickCategories.css';

const categories = [
  { icon: '👕', name: 'T-Shirt' },
  { icon: '🧥', name: 'Jacket' },
  { icon: '👟', name: 'Shoes' },
  { icon: '👜', name: 'Bag' },
  { icon: '⌚', name: 'Watch' },
  { icon: '🎧', name: 'Electronics' },
  { icon: '📱', name: 'Phone' },
  { icon: '💄', name: 'Beauty' },
  { icon: '🎮', name: 'Gaming' }
];

function QuickCategories() {
  return (
    <div className="quick-categories-container">
      <div className="quick-categories">
        {categories.map((cat, index) => (
          <div key={index} className="quick-cat-item">
            <div className="quick-cat-icon">{cat.icon}</div>
            <div className="quick-cat-name">{cat.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuickCategories;
