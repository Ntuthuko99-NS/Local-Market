import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// Simple API functions (replace with your backend)
const api = {
  getProducts: async () => {
    const res = await fetch('/api/products');
    return res.json();
  },

  getUrgentProducts: async () => {
    const res = await fetch('/api/products?urgent=true');
    return res.json();
  },

  getServices: async () => {
    const res = await fetch('/api/services');
    return res.json();
  },
};

// Simple section header
function SectionHeader({ title, link }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
      <h2>{title}</h2>
      {link && <Link to={link}>View All →</Link>}
    </div>
  );
}

// Simple product card
function ProductCard({ product }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 10, borderRadius: 10 }}>
      <img src={product.image} alt="" width="100%" />
      <h4>{product.title}</h4>
      <p>R{product.price}</p>
    </div>
  );
}

// Simple service card
function ServiceCard({ service }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 10, borderRadius: 10 }}>
      <h4>{service.title}</h4>
      <p>{service.description}</p>
    </div>
  );
}

export default function Home() {
  // Fetch data
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: api.getProducts,
  });

  const { data: urgentProducts = [], isLoading: loadingUrgent } = useQuery({
    queryKey: ['urgent-products'],
    queryFn: api.getUrgentProducts,
  });

  const { data: services = [], isLoading: loadingServices } = useQuery({
    queryKey: ['services'],
    queryFn: api.getServices,
  });

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 20 }}>
      <h1>Marketplace</h1>

      {/* Urgent Products */}
      <section>
        <SectionHeader title="🔥 Urgent Sales" link="/products?urgent=true" />

        {loadingUrgent ? (
          <p>Loading...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {urgentProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Latest Products */}
      <section style={{ marginTop: 30 }}>
        <SectionHeader title="✨ Latest Listings" link="/products" />

        {loadingProducts ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <div>
            <p>No products yet.</p>
            <Link to="/create">Start Selling</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Services */}
      <section style={{ marginTop: 30 }}>
        <SectionHeader title="🧰 Services" link="/services" />

        {loadingServices ? (
          <p>Loading...</p>
        ) : services.length === 0 ? (
          <div>
            <p>No services yet.</p>
            <Link to="/create">Post a Service</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section style={{ marginTop: 40, textAlign: 'center' }}>
        <h2>Start Earning Today 💰</h2>
        <p>Post your product or service in minutes</p>
        <Link to="/create">
          <button style={{ marginTop: 10 }}>Quick Sell</button>
        </Link>
      </section>
    </div>
  );
}
