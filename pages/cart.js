import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart');
      if (!response.ok) {
        if (response.status === 401) {
          alert('请先登录');
          window.location.href = '/login';
          return;
        }
        throw new Error('Failed to fetch cart');
      }
      
      const data = await response.json();
      setCartItems(data);
      calculateTotal(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (items) => {
    const sum = items.reduce((total, item) => total + item.subtotal, 0);
    setTotal(sum);
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    
    try {
      const response = await fetch(`/api/cart/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) throw new Error('Failed to update cart');
      
      fetchCart();
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    if (!confirm('确定要从购物车中移除这个商品吗？')) return;
    
    try {
      const response = await fetch(`/api/cart/remove?productId=${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove from cart');
      
      fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const checkout = () => {
    alert('感谢您的购买！本示例不包含实际支付功能。');
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
                <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                  {cartItems.length}
                </span>
              </Link>
              <Link href="/login" className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-12">
              <i className="fa fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
              <p className="text-lg text-gray-500">Your cart is empty</p>
              <Link href="/" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <i className="fa fa-arrow-left mr-2"></i> Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex">
                      <div className="flex-shrink-0 h-20 w-20">
                        <img src={item.product.image} alt={item.product.name} className="h-20 w-20 object-center object-cover rounded-md" />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-sm font-medium text-gray-900">
                            <Link href={`/products/${item.product.id}`}>{item.product.name}</Link>
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </div>
                        <div className="mt-1 flex justify-between">
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                            >
                              <i className="fa fa-minus"></i>
                            </button>
                            <span className="mx-3 text-sm text-gray-700">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                            >
                              <i className="fa fa-plus"></i>
                            </button>
                          </div>
                          <p className="text-sm font-medium text-gray-900">${item.subtotal}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Subtotal</span>
                      <span className="text-sm font-medium text-gray-900">${total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Shipping</span>
                      <span className="text-sm font-medium text-gray-900">Free</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-base font-medium text-gray-900">Total</span>
                        <span className="text-base font-semibold text-gray-900">${total}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={checkout}
                      className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <i className="fa fa-credit-card mr-2"></i> Proceed to Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CartPage;  