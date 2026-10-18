'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  Plus, Edit2, Trash2, Upload, RefreshCw, CheckCircle, 
  AlertCircle, Utensils, Star, Flame, Sparkles, X, Image as ImageIcon 
} from 'lucide-react';
import { MenuItem, DEFAULT_MENU_ITEMS } from '@/lib/data';

export default function AdminMenuPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'Starters' | 'Mains' | 'Sweets' | 'Catering'>('Starters');
  const [dishes, setDishes] = useState<MenuItem[]>(DEFAULT_MENU_ITEMS);
  const [loading, setLoading] = useState(true);

  // Form Modal State (Add / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [dishName, setDishName] = useState('');
  const [hindiName, setHindiName] = useState('');
  const [category, setCategory] = useState<'Starters' | 'Mains' | 'Sweets' | 'Catering'>('Starters');
  const [price, setPrice] = useState('');
  const [spicy, setSpicy] = useState('Mild');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [isJain, setIsJain] = useState(true);
  const [isChefSpecial, setIsChefSpecial] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Check auth
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('satvik_admin_auth') || localStorage.getItem('satvik_admin_auth');
      if (auth !== 'true') {
        router.push('/admin');
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [router]);

  // Load dishes from API
  const loadDishes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/menu');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setDishes(data);
        }
      }
    } catch (err) {
      console.warn('Failed to load menu dishes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDishes();
    }
  }, [isAuthenticated]);

  // Handle image upload to Cloudinary
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhotoToCloudinary = async (base64Data: string): Promise<string | null> => {
    try {
      setUploadingImage(true);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: base64Data, folder: 'satvik_dishes' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return data.url;
      }
      return null;
    } catch (e) {
      console.error('Cloudinary upload error:', e);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingDish(null);
    setDishName('');
    setHindiName('');
    setCategory(activeTab);
    setPrice('');
    setSpicy('Mild');
    setDescription('');
    setImageUrl('');
    setImageFile(null);
    setIsJain(true);
    setIsChefSpecial(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (dish: MenuItem) => {
    setEditingDish(dish);
    setDishName(dish.name);
    setHindiName('');
    setCategory((dish.category as any) || activeTab);
    setPrice(dish.price.toString());
    setSpicy(dish.spicy || 'Mild');
    setDescription(dish.description || '');
    setImageUrl(dish.image || '');
    setImageFile(null);
    setIsJain(true);
    setIsChefSpecial(false);
    setIsModalOpen(true);
  };

  const handleSubmitDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName || !price) return;
    setSubmitting(true);
    setNotification(null);

    try {
      let finalImageUrl = imageUrl;
      // If photo file was selected, upload directly to Cloudinary
      if (imageFile) {
        const uploadedUrl = await uploadPhotoToCloudinary(imageFile);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }

      if (!finalImageUrl) {
        finalImageUrl = '/images/satvik_royal_thali_1783699368595.jpg';
      }

      const payload = {
        name: dishName,
        hindi_name: hindiName,
        category,
        price: Number(price),
        spicy,
        description,
        image: finalImageUrl,
        is_jain: isJain,
        is_chef_special: isChefSpecial,
      };

      if (editingDish) {
        // Edit existing dish
        const res = await fetch(`/api/menu/${editingDish.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setDishes((prev) =>
            prev.map((d) => (d.id === editingDish.id ? { ...d, ...payload } : d))
          );
          setNotification({ type: 'success', message: 'Dish updated successfully!' });
          setIsModalOpen(false);
        } else {
          setNotification({ type: 'error', message: 'Failed to update dish.' });
        }
      } else {
        // Add new dish
        const res = await fetch('/api/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setDishes((prev) => [data.dish, ...prev]);
          setNotification({ type: 'success', message: 'Dish saved to Supabase & Cloudinary!' });
          setIsModalOpen(false);
        } else {
          setNotification({ type: 'error', message: data.error || 'Failed to save dish.' });
        }
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Error saving dish.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDish = async (dishId: string) => {
    if (!confirm('Are you sure you want to delete this dish?')) return;
    try {
      const res = await fetch(`/api/menu/${dishId}`, { method: 'DELETE' });
      if (res.ok) {
        setDishes((prev) => prev.filter((d) => d.id !== dishId));
        setNotification({ type: 'success', message: 'Dish removed successfully.' });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredDishes = dishes.filter((dish) => {
    if (activeTab === 'Starters') {
      return dish.category === 'Starters' || dish.category === 'Starter';
    }
    return dish.category === activeTab;
  });

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-800">
            <div>
              <h1 className="text-2xl font-bold text-white">Menu & Dishes Manager</h1>
              <p className="text-xs text-stone-400 mt-1">
                Add, edit, and delete dishes with Cloudinary media hosting and Supabase real-time storage.
              </p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Dish</span>
            </button>
          </div>

          {/* Toast Notification */}
          {notification && (
            <div
              className={`p-3.5 rounded-lg text-xs flex items-center justify-between animate-fade-in ${
                notification.type === 'success'
                  ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                  : 'bg-red-950/60 border border-red-800 text-red-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {notification.type === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-400" />
                )}
                <span>{notification.message}</span>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-stone-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Category Tabs: Starter, Mains, Sweets, Catering */}
          <div className="flex border-b border-stone-800 space-x-2 sm:space-x-4">
            {(['Starters', 'Mains', 'Sweets', 'Catering'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                  activeTab === tab
                    ? 'border-amber-500 text-amber-400 font-extrabold'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                {tab === 'Starters' ? 'Starter' : tab === 'Catering' ? 'Catering Packages' : tab}
              </button>
            ))}
          </div>

          {/* Dish Cards Grid */}
          {loading ? (
            <div className="p-16 text-center text-xs text-stone-400 flex flex-col items-center gap-2">
              <RefreshCw className="h-5 w-5 animate-spin text-amber-500" />
              <span>Loading dishes from Supabase...</span>
            </div>
          ) : filteredDishes.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
              <p className="text-sm font-semibold text-stone-300">No dishes in {activeTab} yet.</p>
              <p className="text-xs text-stone-500">
                Click "Add New Dish" above to create and publish a dish directly to the website!
              </p>
              <button
                onClick={handleOpenAddModal}
                className="py-2 px-4 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/30 cursor-pointer"
              >
                Add Dish to {activeTab}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDishes.map((dish) => (
                <div
                  key={dish.id}
                  className="rounded-xl bg-stone-900 border border-stone-800 overflow-hidden flex flex-col justify-between hover:border-stone-700 transition-all shadow-md group"
                >
                  <div>
                    {/* Dish Image */}
                    <div className="relative h-44 w-full bg-stone-950 overflow-hidden">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-amber-400 border border-amber-500/30">
                        ₹{dish.price}
                      </div>
                      <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                        {dish.spicy || 'Mild'}
                      </div>
                    </div>

                    {/* Dish Info */}
                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-sm text-white">{dish.name}</h3>
                      <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                        {dish.description}
                      </p>
                    </div>
                  </div>

                  {/* Admin Actions Bar */}
                  <div className="p-3 bg-stone-950/70 border-t border-stone-800/80 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-stone-500 uppercase">
                      Category: {dish.category}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleOpenEditModal(dish)}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Dish"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDish(dish.id)}
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                        title="Delete Dish"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Add / Edit Dish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative my-8">
            <div className="flex justify-between items-center pb-4 border-b border-stone-800">
              <h3 className="text-lg font-bold text-white">
                {editingDish ? 'Edit Dish' : 'Add New Dish'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitDish} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase mb-1">
                    Dish Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                    placeholder="e.g. Satvik Paneer Tikka"
                    className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase mb-1">
                    Hindi Subtitle (Optional)
                  </label>
                  <input
                    type="text"
                    value={hindiName}
                    onChange={(e) => setHindiName(e.target.value)}
                    placeholder="e.g. सात्विक पनीर टिक्का"
                    className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Starters">Starter</option>
                    <option value="Mains">Mains</option>
                    <option value="Sweets">Sweets</option>
                    <option value="Catering">Catering Packages</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="249"
                    className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase mb-1">
                    Spiciness Level
                  </label>
                  <select
                    value={spicy}
                    onChange={(e) => setSpicy(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Mild">Mild</option>
                    <option value="Medium">Medium</option>
                    <option value="Hot">Hot</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ingredients, preparation with pure A2 ghee, ayurvedic healing notes..."
                  className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Photo Upload to Cloudinary */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-300 uppercase">
                  Dish Photo (Saves to Cloudinary)
                </label>
                <div className="p-3 rounded-lg bg-stone-950/60 border border-dashed border-stone-700 flex flex-col gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="text-xs text-stone-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-stone-800 file:text-amber-400 hover:file:bg-stone-700 cursor-pointer"
                  />
                  <div className="text-[11px] text-stone-500 flex items-center gap-1">
                    <span>Or enter an existing image URL below:</span>
                  </div>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://res.cloudinary.com/... or /images/..."
                    className="w-full px-3 py-1.5 rounded bg-stone-800 border border-stone-700 text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6 pt-1">
                <label className="flex items-center space-x-2 text-xs text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isJain}
                    onChange={(e) => setIsJain(e.target.checked)}
                    className="rounded bg-stone-800 border-stone-700 text-amber-500"
                  />
                  <span>100% Jain (No Onion & Garlic)</span>
                </label>
                <label className="flex items-center space-x-2 text-xs text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChefSpecial}
                    onChange={(e) => setIsChefSpecial(e.target.checked)}
                    className="rounded bg-stone-800 border-stone-700 text-amber-500"
                  />
                  <span>Chef Special</span>
                </label>
              </div>

              <div className="pt-4 border-t border-stone-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-stone-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  {submitting || uploadingImage ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving to Supabase & Cloudinary...</span>
                    </>
                  ) : (
                    <span>{editingDish ? 'Save Changes' : 'Publish Dish'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
