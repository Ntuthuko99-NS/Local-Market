import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const categoryLabels = {
  electronics: 'Electronics',
  clothing: 'Clothing',
  furniture: 'Furniture',
  groceries: 'Groceries',
  vehicles: 'Vehicles',
  car_parts: 'Car Parts',
  books: 'Books',
  herbs_traditional: 'Herbs & Traditional',
  school_uniforms: 'School Uniforms',
  food_packs: 'Food Packs',
  beauty: 'Beauty',
  sports: 'Sports',
  home_garden: 'Home & Garden',
  phones: 'Phones',
  other: 'Other',
};

export default function ProductCard({ product }) {
  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80';

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="bg-card rounded-xl border border-border overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={mainImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.is_urgent && (
              <Badge className="bg-destructive text-destructive-foreground text-[10px] px-1.5 py-0.5">
                🔥 Urgent
              </Badge>
            )}
            {product.is_boosted && (
              <Badge className="bg-secondary text-secondary-foreground text-[10px] px-1.5 py-0.5">
                ⚡ Featured
              </Badge>
            )}
          </div>
          {product.condition && product.condition !== 'used' && (
            <Badge className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-[10px] px-1.5 py-0.5">
              {product.condition === 'new' ? 'New' : product.condition === 'like_new' ? 'Like New' : 'Refurbished'}
            </Badge>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
              {product.title}
            </h3>
          </div>
          <p className="font-heading font-bold text-lg text-primary mt-0.5">
            R{product.price?.toLocaleString()}
          </p>
          <div className="flex items-center gap-2 mt-1.5 text-muted-foreground">
            {product.city && (
              <span className="flex items-center gap-0.5 text-xs">
                <MapPin className="w-3 h-3" />
                {product.city}
              </span>
            )}
            {product.is_negotiable && (
              <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                Negotiable
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-muted-foreground text-[11px]">
            <span className="flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(product.created_date), { addSuffix: true })}
            </span>
            {product.views > 0 && (
              <span className="flex items-center gap-0.5">
                <Eye className="w-3 h-3" />
                {product.views}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
