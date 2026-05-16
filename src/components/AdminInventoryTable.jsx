import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Plus, MoreVertical, X, Trash2 } from 'lucide-react';

export default function AdminInventoryTable() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', sku: '', category: '', price: '', stock_count: '', care_light: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('plants_inventory')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching inventory:', error);
    } else {
      setInventory(data || []);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    let uploadedImageUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAagpKdsMtdqczM7yJg3-6mjJNcLiRI4VeMue0z3CF0-yC7lYa8uQf5XCU4No5hiXjLtnfaIOY8DBhDyfxaTUYuDImVdQXIqg75tElP4GdhOWiazPdcs4lqrMYZqhG8sQ5ZbxCeLnMiTvpKtoOkop_dgfmT-W_zr3tPyMS-MNP-ZBoOG_unPONe4NE6mYKnDjVIFuX8a_9H5xibV7fFIr-rhbFi6OVfJR8OM72CmRG1_vo79OG2GE6f20EBeoODzY-4G-jnMylegq8';

    // 1. Upload image if a file was selected
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `inventory/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        alert('Failed to upload image. Check permissions.');
        setIsUploading(false);
        return;
      }

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
        
      uploadedImageUrl = publicUrl;
    }

    // 3. Save to database
    const { data, error } = await supabase
      .from('plants_inventory')
      .insert([{
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        price: parseFloat(formData.price),
        stock_count: parseInt(formData.stock_count, 10),
        care_light: formData.care_light,
        image_url: uploadedImageUrl
      }])
      .select();

    if (error) {
      console.error('Error adding plant:', error);
      alert('Failed to save plant data.');
    } else {
      setInventory(prev => [data[0], ...prev]);
      setIsAddModalOpen(false);
      setFormData({ name: '', sku: '', category: '', price: '', stock_count: '', care_light: '' });
      setImageFile(null);
    }
    setIsUploading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this plant?')) return;
    const { error } = await supabase.from('plants_inventory').delete().eq('id', id);
    if (!error) {
      setInventory(prev => prev.filter(p => p.id !== id));
    }
  };

  const filteredInventory = inventory.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-container-max mx-auto">
      {/* Actions Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-on-surface-variant">
            <Search className="w-5 h-5" />
          </span>
          <input 
            type="text" 
            placeholder="Search inventory by name or SKU..." 
            className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-sm py-3 pl-10 rounded-t-lg transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary text-on-primary px-6 py-3 rounded-full flex items-center gap-2 hover:shadow-lg transition-all active:scale-95 group"
        >
          <Plus className="w-5 h-5" />
          <span className="font-label-md text-label-md uppercase tracking-wider">Add New Plant</span>
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-surface rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low border-b border-outline-variant">
            <tr>
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Thumbnail</th>
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">SKU</th>
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Price</th>
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-center">Stock</th>
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-center">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {loading ? (
              <tr><td colSpan="7" className="text-center py-8">Loading inventory...</td></tr>
            ) : filteredInventory.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-8 text-on-surface-variant">No plants found.</td></tr>
            ) : (
              filteredInventory.map(plant => (
                <tr key={plant.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="px-6 py-4">
                    <img src={plant.image_url || 'https://via.placeholder.com/48'} alt={plant.name} className="w-12 h-12 rounded-lg object-cover" />
                  </td>
                  <td className="px-6 py-4 font-semibold text-on-surface">{plant.name}</td>
                  <td className="px-6 py-4 text-on-surface-variant text-sm">{plant.sku}</td>
                  <td className="px-6 py-4 text-right font-semibold">${plant.price.toFixed(2)}</td>
                  <td className={`px-6 py-4 text-center ${plant.stock_count === 0 ? 'text-error' : ''}`}>{plant.stock_count}</td>
                  <td className="px-6 py-4 text-center">
                    {plant.stock_count > 10 ? (
                      <span className="text-primary flex items-center justify-center gap-1 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>In Stock
                      </span>
                    ) : plant.stock_count > 0 ? (
                      <span className="text-tertiary-container flex items-center justify-center gap-1 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>Low Stock
                      </span>
                    ) : (
                      <span className="text-error flex items-center justify-center gap-1 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-error"></span>Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(plant.id)} className="text-on-surface-variant hover:text-error transition-colors p-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
          <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="px-8 py-6 border-b border-outline-variant flex items-center justify-between bg-white">
              <h3 className="font-headline-md text-headline-md text-primary">New Plant Entry</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-on-surface-variant hover:text-primary p-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <form id="add-plant-form" onSubmit={handleAddSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest block">Plant Name</label>
                    <input name="name" value={formData.name} onChange={handleInputChange} required className="w-full bg-surface-container-low border-0 border-b border-outline focus:border-primary focus:ring-0 text-body-md" placeholder="e.g. Bird of Paradise" type="text" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest block">SKU Code</label>
                    <input name="sku" value={formData.sku} onChange={handleInputChange} required className="w-full bg-surface-container-low border-0 border-b border-outline focus:border-primary focus:ring-0 text-body-md" placeholder="VERD-000" type="text" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest block">Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} required className="w-full bg-surface-container-low border-0 border-b border-outline focus:border-primary focus:ring-0 text-body-md">
                      <option value="">Select Category</option>
                      <option value="Indoor Trees">Indoor Trees</option>
                      <option value="Foliage">Foliage</option>
                      <option value="Succulents">Succulents</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest block">Base Price ($)</label>
                    <input name="price" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" className="w-full bg-surface-container-low border-0 border-b border-outline focus:border-primary focus:ring-0 text-body-md" placeholder="0.00" type="number" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest block">Initial Stock</label>
                    <input name="stock_count" value={formData.stock_count} onChange={handleInputChange} required min="0" className="w-full bg-surface-container-low border-0 border-b border-outline focus:border-primary focus:ring-0 text-body-md" placeholder="0" type="number" />
                  </div>
                </div>
                <div className="space-y-1 mt-6">
                  <label className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest block">Product Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange} 
                    className="w-full bg-surface-container-low border-0 border-b border-outline focus:border-primary focus:ring-0 text-body-md py-2 px-3 rounded-t-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-on-primary hover:file:bg-primary-fixed" 
                  />
                  <p className="text-xs text-on-surface-variant mt-1">Select an image from your computer.</p>
                </div>
              </form>
            </div>
            <div className="px-8 py-6 bg-surface-container-low border-t border-outline-variant flex items-center justify-end gap-4">
              <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-2 rounded-full border border-outline text-on-surface-variant font-label-md text-label-md hover:bg-white transition-colors">Discard</button>
              <button type="submit" form="add-plant-form" disabled={isUploading} className="bg-primary text-on-primary px-8 py-2 rounded-full font-label-md text-label-md shadow-md hover:shadow-xl transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center gap-2">
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : 'Save & Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
