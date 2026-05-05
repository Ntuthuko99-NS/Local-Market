import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';

// Example API helpers (replace with your real backend)
const api = {
  getCurrentUser: async () => {
    const res = await fetch('/api/me');
    return res.json();
  },

  createProduct: async (data) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  createService: async (data) => {
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    return res.json(); // should return { file_url }
  }
};

export default function CreateListing() {
  const navigate = useNavigate();

  // Get logged-in user
  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: api.getCurrentUser,
  });

  // Product form state
  const [product, setProduct] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    city: '',
    seller_name: '',
    seller_phone: '',
  });

  // Service form state
  const [service, setService] = useState({
    title: '',
    description: '',
    service_type: '',
    price_from: '',
    price_to: '',
    city: '',
    provider_name: '',
    provider_phone: '',
  });

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Create product
  const productMutation = useMutation({
    mutationFn: api.createProduct,
    onSuccess: (data) => {
      alert('Product created!');
      navigate(`/product/${data.id}`);
    },
  });

  // Create service
  const serviceMutation = useMutation({
    mutationFn: api.createService,
    onSuccess: (data) => {
      alert('Service posted!');
      navigate(`/service/${data.id}`);
    },
  });

  // Upload images
  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);

    const uploaded = [];

    for (let file of files) {
      const res = await api.uploadFile(file);
      uploaded.push(res.file_url);
    }

    setImages((prev) => [...prev, ...uploaded]);
    setUploading(false);
  };

  // Submit product
  const submitProduct = () => {
    if (!product.title || !product.price) {
      alert('Title and price are required');
      return;
    }

    productMutation.mutate({
      ...product,
      price: Number(product.price),
      images,
      seller_name: product.seller_name || user?.name,
    });
  };

  // Submit service
  const submitService = () => {
    if (!service.title || !service.service_type) {
      alert('Title and service type are required');
      return;
    }

    serviceMutation.mutate({
      ...service,
      price_from: Number(service.price_from) || null,
      price_to: Number(service.price_to) || null,
      images,
      provider_name: service.provider_name || user?.name,
    });
  };

  return (
    <div>
      <h1>Create Listing</h1>

      <h2>Product</h2>
      <input
        placeholder="Title"
        value={product.title}
        onChange={(e) => setProduct({ ...product, title: e.target.value })}
      />

      <input
        placeholder="Price"
        type="number"
        value={product.price}
        onChange={(e) => setProduct({ ...product, price: e.target.value })}
      />

      <button onClick={submitProduct}>
        {productMutation.isPending ? 'Posting...' : 'Post Product'}
      </button>

      <h2>Service</h2>
      <input
        placeholder="Title"
        value={service.title}
        onChange={(e) => setService({ ...service, title: e.target.value })}
      />

      <input
        placeholder="Service Type"
        value={service.service_type}
        onChange={(e) =>
          setService({ ...service, service_type: e.target.value })
        }
      />

      <button onClick={submitService}>
        {serviceMutation.isPending ? 'Posting...' : 'Post Service'}
      </button>

      <h3>Upload Images</h3>
      <input type="file" multiple onChange={handleUpload} />

      {uploading && <p>Uploading...</p>}

      <div>
        {images.map((img, i) => (
          <img key={i} src={img} alt="" width="80" />
        ))}
      </div>
    </div>
  );
}
