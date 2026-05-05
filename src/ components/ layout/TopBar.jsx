import { Link, useLocation } from 'react-router-dom';
import { MapPin, Bell, Search, Home, ShoppingBag, Wrench, BarChart3, MessageCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const desktopLinks = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/products', label: 'Products', icon: ShoppingBag },
  { path: '/services', label: 'Services', icon: Wrench },
  { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { path: '/messages', label: 'Messages', icon: MessageCircle },
];

export default function TopBar() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-lg hidden sm:block">LocalMarket</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {desktopLinks.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link to="/search">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Search className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <User className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
