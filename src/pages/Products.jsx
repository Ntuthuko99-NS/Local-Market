import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

// Simple API (replace with your backend)
const api = {
  getProducts: async () => {
    const res = await fetch('/api/products');
    return res.json();
  },
};

export default function Products() {
  const params = new URLSearchParams(window.location.search);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(params.get('category') || 'all');
  const [province, setProvince] = useState('all');

  const isUrgent = params.get('urgent') === 'true';

  // Fetch products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: api.getProducts,
  });

  // Filter products
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !search ||
        p.title?.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        category === 'all' || p.category === category;

      const matchProvince =
        province === 'all' || p.province === province;

      const matchUrgent =
        !isUrgent || p.is_urgent;

      return (
        matchSearch &&
        matchCategory &&
        matchProvince &&
        matchUrgent
      );
    });
  }, [products, search, category, province, isUrgent]);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 20 }}>
      <h1>
        {isUrgent ? '🔥 Urgent Products' : '🛍️ Products'}
      </h1>

      <Link to="/create">+ Sell Product</Link>

      {/* Search */}
      <div style={{ marginTop: 10 }}>
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div style={{ marginTop: 10 }}>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="furniture">Furniture</option>
          <option value="phones">Phones</option>
          <option value="vehicles">Vehicles</option>
        </select>

        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          style={{ marginLeft: 10 }}
        >
          <option value="all">All Provinces</option>
          <option value="gauteng">Gauteng</option>
          <option value="western_cape">Western Cape</option>
          <option value="kwazulu_natal">KwaZulu-Natal</option>
        </select>

        {(category !== 'all' || province !== 'all') && (
          <button
            onClick={() => {
              setCategory('all');
              setProvince('all');
            }}
            style={{ marginLeft: 10 }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Results count */}
      <p style={{ marginTop: 10 }}>
        {filtered.length} products found
      </p>

      {/* Product list */}
      {isLoading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
            marginTop: 10,
          }}
        >
          {filtered.map((p) => (
            <div
              key={p.id}
              style={{
                border: '1px solid #ddd',
                padding: 10,
                borderRadius: 10,
              }}
            >
              <img
                src={p.image}
                alt=""
                width="100%"
              />
              <h4>{p.title}</h4>
              <p>R{p.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
