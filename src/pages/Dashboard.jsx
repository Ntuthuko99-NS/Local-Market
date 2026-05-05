import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

// Simple API helper (replace with your backend)
const api = {
  getUser: async () => {
    const res = await fetch('/api/me');
    return res.json();
  },

  getProducts: async (email) => {
    const res = await fetch(`/api/products?user=${email}`);
    return res.json();
  },

  getServices: async (email) => {
    const res = await fetch(`/api/services?user=${email}`);
    return res.json();
  },

  getOrders: async (email) => {
    const res = await fetch(`/api/orders?seller=${email}`);
    return res.json();
  },
};

// Simple stat card (no UI libraries)
function StatCard({ title, value }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 10 }}>
      <p style={{ fontSize: 12, color: '#777' }}>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

export default function Dashboard() {
  // Get current user
  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: api.getUser,
  });

  // Get data
  const { data: products = [] } = useQuery({
    queryKey: ['products', user?.email],
    queryFn: () => api.getProducts(user.email),
    enabled: !!user?.email,
  });

  const { data: services = [] } = useQuery({
    queryKey: ['services', user?.email],
    queryFn: () => api.getServices(user.email),
    enabled: !!user?.email,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['orders', user?.email],
    queryFn: () => api.getOrders(user.email),
    enabled: !!user?.email,
  });

  // Calculations
  const totalEarnings = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + (o.amount || 0), 0);

  const totalViews = products.reduce(
    (sum, p) => sum + (p.views || 0),
    0
  );

  const activeProducts = products.filter(
    p => p.status === 'active'
  ).length;

  const pendingOrders = orders.filter(
    o => o.status === 'pending'
  ).length;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
      <h1>📊 Dashboard</h1>
      <p>Track your performance and earnings</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <StatCard title="Total Earnings" value={`R${totalEarnings}`} />
        <StatCard title="Active Listings" value={activeProducts} />
        <StatCard title="Total Views" value={totalViews} />
        <StatCard title="Pending Orders" value={pendingOrders} />
      </div>

      {/* Recent Orders */}
      <div style={{ marginTop: 30 }}>
        <h2>Recent Orders</h2>

        {orders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          orders.slice(0, 5).map(order => (
            <div
              key={order.id}
              style={{
                borderBottom: '1px solid #eee',
                padding: '10px 0',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <strong>{order.product_title}</strong>
                <p style={{ fontSize: 12, color: '#777' }}>
                  {order.buyer_name || order.buyer_email}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <strong>R{order.amount}</strong>
                <p style={{ fontSize: 12 }}>{order.status}</p>
              </div>
            </div>
          ))
        )}

        <Link to="/profile">View all</Link>
      </div>
    </div>
  );
}
