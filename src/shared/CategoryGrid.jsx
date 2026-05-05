import { Link } from 'react-router-dom';

const categories = [
  { id: 'electronics', label: 'Electronics', emoji: '📱', color: 'bg-blue-50 text-blue-600' },
  { id: 'clothing', label: 'Clothing', emoji: '👕', color: 'bg-pink-50 text-pink-600' },
  { id: 'furniture', label: 'Furniture', emoji: '🛋️', color: 'bg-amber-50 text-amber-600' },
  { id: 'vehicles', label: 'Vehicles', emoji: '🚗', color: 'bg-red-50 text-red-600' },
  { id: 'phones', label: 'Phones', emoji: '📞', color: 'bg-purple-50 text-purple-600' },
  { id: 'groceries', label: 'Groceries', emoji: '🛒', color: 'bg-green-50 text-green-600' },
  { id: 'beauty', label: 'Beauty', emoji: '💄', color: 'bg-rose-50 text-rose-600' },
  { id: 'home_garden', label: 'Home & Garden', emoji: '🏡', color: 'bg-emerald-50 text-emerald-600' },
  { id: 'books', label: 'Books', emoji: '📚', color: 'bg-indigo-50 text-indigo-600' },
  { id: 'herbs_traditional', label: 'Herbs', emoji: '🌿', color: 'bg-lime-50 text-lime-600' },
  { id: 'car_parts', label: 'Car Parts', emoji: '🔧', color: 'bg-slate-50 text-slate-600' },
  { id: 'other', label: 'More', emoji: '➕', color: 'bg-gray-50 text-gray-600' },
];

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          to={`/products?category=${cat.id}`}
          className="flex flex-col items-center gap-1.5 group"
        >
          <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center text-2xl
            group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
            {cat.emoji}
          </div>
          <span className="text-[11px] font-medium text-center leading-tight text-muted-foreground group-hover:text-foreground transition-colors">
            {cat.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
