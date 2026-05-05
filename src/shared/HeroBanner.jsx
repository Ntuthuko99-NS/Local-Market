import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground p-6 md:p-10"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-32 h-32 border-2 border-white rounded-full" />
        <div className="absolute bottom-4 left-1/3 w-48 h-48 border border-white rounded-full" />
        <div className="absolute top-1/2 right-1/4 w-20 h-20 border border-white rounded-full" />
      </div>

      <div className="relative z-10 max-w-lg">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🇿🇦</span>
          <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">South Africa's Local Marketplace</span>
        </div>
        <h1 className="font-heading text-2xl md:text-4xl font-bold leading-tight">
          Buy, Sell & Hire<br />
          <span className="text-secondary">Locally</span>
        </h1>
        <p className="text-sm md:text-base opacity-90 mt-3 leading-relaxed">
          Connect with your community. Find products, services, and opportunities near you.
        </p>
        <div className="flex flex-wrap gap-3 mt-5">
          <Link to="/create">
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold gap-2">
              <Zap className="w-4 h-4" />
              Quick Sell
            </Button>
          </Link>
          <Link to="/services">
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2">
              Find Services
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
