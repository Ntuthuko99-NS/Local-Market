import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import MobileNav from './MobileNav';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="pb-20 md:pb-6">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}
