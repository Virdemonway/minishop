import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to add to cart');
      }

      alert('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 font-bold text-xl text-gray-800">
                Ecommerce Store
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/cart" className="relative p-2 rounded-md text-gray-600 hover:text-gray-900">
                <i className="fa fa-shopping-cart text-xl"></i>
                <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">0</span>
              </Link>
              <Link href="/login" className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                Login
              </Link>
              <Link href="/register" className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h1>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No products available
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-w-1 aspect-h-1 bg-gray-200 overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-center object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                    <p className="mt-1 text-sm text-gray-600">{product.description}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">${product.price}</span>
                      <button
                        onClick={() => addToCart(product.id)}
                        className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;  