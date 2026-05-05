import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

// Simple API (replace with your backend)
const api = {
  getUser: async () => {
    const res = await fetch('/api/me');
    return res.json();
  },

  getMyProducts: async (email) => {
    const res = await fetch(`/api/products?user=${email}`);
    return res.json();
  },

  getMyServices: async (email) => {
    const res = await fetch(`/api/services?user=${email}`);
    return res.json();
  },

  getMyOrders: async (email) => {
    const res = await fetch(`/api/orders?buyer=${email}`);
    return res.json();
  },

  getMyBookings: async (email) => {
    const res = await fetch(`/api/bookings?customer=${email}`);
    return res.json();
  },

  logout: async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.reload();
  },
};

export default function Profile() {
  // Get user
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: api.getUser,
  });

  // Get user data
  const { data: products = [] } = useQuery({
    queryKey: ['products', user?.email],
    queryFn: () => api.getMyProducts(user.email),
    enabled: !!user?.email,
  });

  const { data: services = [] } = useQuery({
    queryKey: ['services', user?.email],
    queryFn: () => api.getMyServices(user.email),
    enabled: !!user?.email,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['orders', user?.email],
    queryFn: () => api.getMyOrders(user.email),
    enabled: !!user?.email,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['bookings', user?.email],
    queryFn: () => api.getMyBookings(user.email),
    enabled: !!user?.email,
  });

  if (isLoading) return <p>Loading...</p>;

  // Stats
  const activeProducts = products.filter(p => p.status === 'active');
  const soldProducts = products.filter(p => p.status === 'sold');
  const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
      {/* Profile Header */}
      <div style={{ border: '1px solid #ddd', padding: 20, borderRadius: 10 }}>
        <h2>{user?.full_name}</h2>
        <p>{user?.email}</p>

        <button onClick={api.logout} style={{ marginTop: 10 }}>
          Logout
        </button>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
          <div>
            <strong>{activeProducts.length}</strong>
            <p>Active</p>
          </div>
          <div>
            <strong>{soldProducts.length}</strong>
            <p>Sold</p>
          </div>
          <div>
            <strong>{services.length}</strong>
            <p>Services</p>
          </div>
          <div>
            <strong>{totalViews}</strong>
            <p>Views</p>
          </div>
        </div>
      </div>

      {/* Products */}
      <section style={{ marginTop: 30 }}>
        <h3>My Products</h3>
        <Link to="/create">+ Add Product</Link>

        {products.length === 0 ? (
          <p>No products yet</p>
        ) : (
          products.map((p) => (
            <div key={p.id} style={{ borderBottom: '1px solid #eee', padding: 10 }}>
              <strong>{p.title}</strong>
              <p>R{p.price}</p>
            </div>
          ))
        )}
      </section>

      {/* Services */}
      <section style={{ marginTop: 30 }}>
        <h3>My Services</h3>
        <Link to="/create?type=service">+ Add Service</Link>

        {services.length === 0 ? (
          <p>No services yet</p>
        ) : (
          services.map((s) => (
            <div key={s.id} style={{ borderBottom: '1px solid #eee', padding: 10 }}>
              <strong>{s.title}</strong>
              <p>{s.description}</p>
            </div>
          ))
        )}
      </section>

      {/* Orders */}
      <section style={{ marginTop: 30 }}>
        <h3>My Orders</h3>

        {orders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          orders.map((o) => (
            <div key={o.id} style={{ borderBottom: '1px solid #eee', padding: 10 }}>
              <strong>{o.product_title}</strong>
              <p>R{o.amount}</p>
              <p>Status: {o.status}</p>
            </div>
          ))
        )}
      </section>

      {/* Bookings */}
      <section style={{ marginTop: 30 }}>
        <h3>My Bookings</h3>

        {bookings.length === 0 ? (
          <p>No bookings yet</p>
        ) : (
          bookings.map((b) => (
            <div key={b.id} style={{ borderBottom: '1px solid #eee', padding: 10 }}>
              <strong>{b.service_title}</strong>
              <p>{b.date}</p>
              <p>Status: {b.status}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
