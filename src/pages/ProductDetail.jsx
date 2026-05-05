import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Simple API (replace with your backend)
const api = {
  getProduct: async (id) => {
    const res = await fetch(`/api/products/${id}`);
    return res.json();
  },

  getUser: async () => {
    const res = await fetch('/api/me');
    return res.json();
  },

  createOrder: async (data) => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

export default function ProductDetail() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const queryClient = useQueryClient();

  // Fetch product
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.getProduct(id),
  });

  // Fetch user
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: api.getUser,
  });

  // Create order
  const orderMutation = useMutation({
    mutationFn: api.createOrder,
    onSuccess: () => {
      alert('Order placed successfully!');
      queryClient.invalidateQueries(['orders']);
    },
  });

  if (isLoading) return <p>Loading...</p>;

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <p>Product not found</p>
        <Link to="/products">Go back</Link>
      </div>
    );
  }

  const images = product.images?.length
    ? product.images
    : ['https://via.placeholder.com/400'];

  const handleBuy = () => {
    orderMutation.mutate({
      product_id: product.id,
      seller_email: product.created_by,
      buyer_email: user?.email,
      amount: product.price,
    });
  };

  const whatsappLink = product.seller_phone
    ? `https://wa.me/${product.seller_phone}?text=Hi, I am interested in ${product.title}`
    : null;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
      <Link to="/products">← Back</Link>

      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        {/* Images */}
        <div style={{ flex: 1 }}>
          <img
            src={images[selectedImage]}
            alt=""
            style={{ width: '100%', borderRadius: 10 }}
          />

          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                width={60}
                style={{
                  cursor: 'pointer',
                  border: i === selectedImage ? '2px solid blue' : '1px solid #ddd',
                }}
                onClick={() => setSelectedImage(i)}
              />
            ))}
          </div>
        </div>

        {/* Details */}
        <div style={{ flex: 1 }}>
          <h1>{product.title}</h1>
          <h2>R{product.price}</h2>

          {product.city && <p>📍 {product.city}</p>}

          {product.description && (
            <p style={{ marginTop: 10 }}>{product.description}</p>
          )}

          {/* Seller */}
          {product.seller_name && (
            <p style={{ marginTop: 10 }}>
              Seller: {product.seller_name}
            </p>
          )}

          {/* Actions */}
          <div style={{ marginTop: 20 }}>
            <button onClick={handleBuy}>
              {orderMutation.isPending ? 'Processing...' : 'Buy Now'}
            </button>

            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                style={{ marginLeft: 10 }}
              >
                Contact Seller
              </a>
            )}
          </div>

          {/* Share */}
          <div style={{ marginTop: 10 }}>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied!');
              }}
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
