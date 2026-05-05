import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, CheckCircle, Briefcase } from 'lucide-react';

const serviceTypeLabels = {
  plumbing: '🔧 Plumbing',
  electrical: '⚡ Electrical',
  cleaning: '🧹 Cleaning',
  gardening: '🌿 Gardening',
  painting: '🎨 Painting',
  carpentry: '🪚 Carpentry',
  transport: '🚚 Transport',
  tutoring: '📚 Tutoring',
  beauty: '💅 Beauty',
  cooking: '🍳 Cooking',
  childcare: '👶 Childcare',
  security: '🛡️ Security',
  it_services: '💻 IT Services',
  handyman: '🔨 Handyman',
  other: '📋 Other',
};

export default function ServiceCard({ service }) {
  const mainImage = service.images?.[0] || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80';

  return (
    <Link to={`/service/${service.id}`} className="group block">
      <div className="bg-card rounded-xl border border-border overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
        <div className="flex gap-3 p-3">
          {/* Image */}
          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={mainImage}
              alt={service.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              {service.is_verified && (
                <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {serviceTypeLabels[service.service_type] || service.service_type}
            </p>
            <div className="flex items-center gap-2 mt-1">
              {service.rating > 0 && (
                <span className="flex items-center gap-0.5 text-xs">
                  <Star className="w-3 h-3 fill-secondary text-secondary" />
                  {service.rating.toFixed(1)}
                  <span className="text-muted-foreground">({service.total_reviews})</span>
                </span>
              )}
              {service.jobs_completed > 0 && (
                <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                  <Briefcase className="w-3 h-3" />
                  {service.jobs_completed} jobs
                </span>
              )}
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="font-heading font-bold text-sm text-primary">
                {service.price_from ? `From R${service.price_from}` : 'Get Quote'}
              </span>
              {service.city && (
                <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {service.city}
                </span>
              )}
            </div>
          </div>
        </div>
        {/* Tags */}
        <div className="px-3 pb-3 flex items-center gap-1.5">
          {service.is_boosted && (
            <Badge className="bg-secondary/20 text-secondary-foreground text-[10px] px-1.5 py-0">
              ⚡ Featured
            </Badge>
          )}
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {service.availability === 'available_now' ? '🟢 Available Now' :
             service.availability === 'weekdays' ? 'Weekdays' :
             service.availability === 'weekends' ? 'Weekends' : 'By Appointment'}
          </Badge>
        </div>
      </div>
    </Link>
  );
}
