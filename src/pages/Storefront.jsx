import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { supabase } from '../lib/supabase';
import TopNavBar from '../components/TopNavBar';
import CheckoutDrawer from '../components/CheckoutDrawer';
import WhatsAppButton from '../components/WhatsAppButton';
import PromoPopup from '../components/PromoPopup';

const POT_SIZES = ['6"', '10"', '14"'];

function PlantCard({ plant, onAddToCart }) {
  const [selectedPotSize, setSelectedPotSize] = useState(POT_SIZES[0]);

  return (
    <div className="glass-card rounded-2xl overflow-hidden long-shadow flex flex-col group">
      <div className="aspect-square overflow-hidden relative">
        <img
          src={plant.image_url || 'https://placehold.co/400x400/2d4a2d/ffffff?text=Plant'}
          alt={plant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {plant.best_seller && (
          <span className="absolute top-3 left-3 bg-primary text-on-primary font-label-md text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">
            Best Seller
          </span>
        )}
        {plant.stock_count === 0 && (
          <div className="absolute inset-0 bg-surface/70 flex items-center justify-center">
            <span className="text-on-surface font-headline-md text-headline-md">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-on-surface-variant uppercase tracking-widest font-label-md">{plant.category}</span>
          <span className={`text-xs font-label-md ${plant.stock_count > 10 ? 'text-primary' : plant.stock_count > 0 ? 'text-tertiary' : 'text-error'}`}>
            {plant.stock_count > 10 ? 'In Stock' : plant.stock_count > 0 ? 'Low Stock' : 'Out of Stock'}
          </span>
        </div>
        <h3 className="font-headline-md text-headline-md text-primary mb-1">{plant.name}</h3>
        <p className="font-headline-md text-secondary mb-4">${Number(plant.price).toFixed(2)}</p>
        {plant.description && (
          <p className="text-on-surface-variant font-body-md text-sm mb-4 leading-relaxed line-clamp-2">{plant.description}</p>
        )}

        {/* Pot Size Selector */}
        <div className="mb-4 mt-auto">
          <span className="font-label-md text-on-surface text-[11px] uppercase block mb-2">Pot Size</span>
          <div className="flex gap-2">
            {POT_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedPotSize(size)}
                className={`flex-1 py-2 px-2 border-2 rounded-lg font-label-md text-xs transition-all ${selectedPotSize === size ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant hover:border-primary text-on-surface'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onAddToCart(plant, selectedPotSize)}
          disabled={plant.stock_count === 0}
          className="w-full bg-primary text-on-primary py-3 rounded-full font-label-md flex items-center justify-center gap-2 hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[18px]">shopping_basket</span>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default function Storefront() {
  const { addItem } = useCartStore();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchPlants = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('plants_inventory')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching plants:', error);
        setError('Could not load plants. Please try again later.');
      } else {
        setPlants(data || []);
      }
      setLoading(false);
    };

    fetchPlants();
  }, []);

  const handleAddToCart = (plant, potSize) => {
    addItem({
      id: plant.id,
      name: plant.name,
      price: Number(plant.price),
      image_url: plant.image_url,
      potSize,
      quantity: 1,
    });
  };

  const categories = ['All', ...new Set(plants.map((p) => p.category).filter(Boolean))];
  const filteredPlants = activeCategory === 'All' ? plants : plants.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <TopNavBar />
      <CheckoutDrawer />
      <WhatsAppButton />
      <PromoPopup />

      <main className="flex-1 pt-28 pb-20 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full">

        {/* Hero Banner */}
        <section className="text-center mb-16">
          <span className="bg-secondary-container text-on-secondary-container font-label-md text-[10px] px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block">
            Curated Collection
          </span>
          <h1 className="font-headline-xl text-headline-xl text-primary mb-4">Your Indoor Oasis Awaits</h1>
          <p className="text-on-surface-variant font-body-md max-w-xl mx-auto leading-relaxed">
            Handpicked tropical plants, expertly cared for and ready to transform your space.
          </p>
        </section>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex gap-3 flex-wrap mb-10 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full font-label-md text-sm transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-on-primary shadow-md'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border border-outline-variant'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Plant Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-on-surface-variant">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-body-md">Loading your oasis...</p>
          </div>
        ) : error ? (
          <div className="text-center py-32 text-error">
            <span className="material-symbols-outlined text-5xl mb-4 block">error</span>
            <p className="font-body-md">{error}</p>
          </div>
        ) : filteredPlants.length === 0 ? (
          <div className="text-center py-32 text-on-surface-variant">
            <span className="material-symbols-outlined text-6xl mb-4 block text-outline-variant">potted_plant</span>
            <h2 className="font-headline-md text-headline-md text-primary mb-2">No Plants Yet</h2>
            <p className="font-body-md">Check back soon — the nursery is being stocked!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
            {filteredPlants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}

        {/* Care Guide Section */}
        <section className="mt-28">
          <h2 className="font-headline-lg text-headline-lg text-primary text-center mb-12">Nurturing Your Oasis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {[
              { icon: 'wb_sunny', title: 'Sunlight', text: 'Bright, indirect light is best for most tropicals. Avoid scorching direct midday sun.' },
              { icon: 'opacity', title: 'Water', text: 'Water every 1–2 weeks, allowing soil to dry halfway between waterings. Most plants love humidity.' },
              { icon: 'pets', title: 'Toxicity', text: 'Some plants contain irritants. Always check individual care cards and keep out of reach of pets and children.' },
            ].map((card) => (
              <div key={card.title} className="glass-card p-8 rounded-xl long-shadow text-center">
                <div className="bg-secondary-container w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-primary text-[32px]">{card.icon}</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-primary mb-3">{card.title}</h3>
                <p className="text-on-surface-variant font-body-md">{card.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-surface-container-low border-t border-outline-variant mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop max-w-container-max mx-auto gap-8">
          <div className="flex flex-col items-center md:items-start">
            <span className="font-headline-md text-headline-md text-primary mb-2">Verdant Oasis</span>
            <p className="font-body-md text-on-surface-variant text-center md:text-left">© 2025 Verdant Oasis. Nurturing your indoor forest.</p>
          </div>
          <div className="flex gap-6">
            <Link to="#" className="text-on-surface-variant hover:underline hover:text-primary transition-colors font-label-md">Privacy Policy</Link>
            <Link to="#" className="text-on-surface-variant hover:underline hover:text-primary transition-colors font-label-md">Shipping Info</Link>
            <Link to="#" className="text-on-surface-variant hover:underline hover:text-primary transition-colors font-label-md">Returns</Link>
            <Link to="#" className="text-on-surface-variant hover:underline hover:text-primary transition-colors font-label-md">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
