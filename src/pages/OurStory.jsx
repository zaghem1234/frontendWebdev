import React from 'react';
import TopNavBar from '../components/TopNavBar';
import CheckoutDrawer from '../components/CheckoutDrawer';
import WhatsAppButton from '../components/WhatsAppButton';
import PromoPopup from '../components/PromoPopup';

export default function OurStory() {
  const values = [
    {
      title: 'Botanical Integrity',
      description: 'Every plant we propagate is cared for by expert horticulturists, ensuring root systems are strong and waxy foliage is spotless.',
      icon: 'verified'
    },
    {
      title: 'Eco-Friendly Shipping',
      description: 'We pack using 100% biodegradable and recyclable materials. Our climate-controlled boxes keep plants pristine during transit.',
      icon: 'local_shipping'
    },
    {
      title: 'Greenhouse Propagation',
      description: 'We source seeds and cuttings ethically, growing them right in our solar-powered greenhouse in California.',
      icon: 'solar_power'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface-container-lowest">
      <TopNavBar />
      <CheckoutDrawer />
      <WhatsAppButton />
      <PromoPopup />

      <main className="flex-1 pt-28 pb-20 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full">
        {/* Page Header */}
        <section className="text-center mb-16 max-w-2xl mx-auto">
          <span className="bg-primary-container text-on-primary-container font-label-md text-[10px] px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block">
            Our Mission
          </span>
          <h1 className="font-headline-xl text-headline-xl text-primary mb-4">Nurturing Your Digital Forest</h1>
          <p className="text-on-surface-variant font-body-md leading-relaxed">
            Plant Beauty was founded in 2024 with a simple dream: to bridge the gap between human indoor spaces and the serene wisdom of old-growth tropical forests.
          </p>
        </section>

        {/* Story Intro / Two Column Split */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center mb-24">
          <div className="lg:col-span-6 rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl relative group">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB45jwkCwrMjzJCQanMmjlWI_1-FRkiTpBbgi7whY03_XQER9BJkzWMHaNKetavtPRxInKOr23yuRA6-DGDBWRU-Ngc-odl61AaAWXnoV4V0OuMNqmIPlBT6d1Pu4PRgDKWnVa9lNTklPWbUWzTQF7Oic6iqcKqec1JSsdAfvrNxcYA5di5CnCsOFkOKUADHDdLpcGZvBBVbOO4LC7filY8PiVW5oeMCQwEv1o08uVCC9Z0ZJCXpom9KRCsZdZAv0Y4AUdEZ8GxE4g" 
              alt="Our Greenhouse" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-8">
              <div>
                <p className="text-xs font-label-md text-secondary-fixed uppercase tracking-wider mb-1">Plant Beauty California</p>
                <h3 className="text-headline-md font-headline-md text-on-primary">The Mother Greenhouse</h3>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-6 space-y-6 lg:pl-8">
            <h2 className="font-headline-lg text-headline-lg text-primary">Born from a passion for botanical aesthetics.</h2>
            <p className="text-on-surface-variant font-body-md leading-relaxed">
              We realized that buying plants online is often stressful. Will it survive the dark box? Will it look like the photo?
            </p>
            <p className="text-on-surface-variant font-body-md leading-relaxed">
              At Plant Beauty, we redesigned the plant-parenting pipeline. We cultivate plants with extra love, pack them with custom-engineered insulation, and provide direct expert horticulturist consultation to every single order.
            </p>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="mb-24">
          <h2 className="font-headline-lg text-headline-lg text-primary text-center mb-16">The Oasis Pillars</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {values.map((v) => (
              <div key={v.title} className="glass-card p-8 rounded-2xl long-shadow border border-outline-variant/10 text-center flex flex-col bg-white">
                <div className="bg-primary/5 text-primary w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/10">
                  <span className="material-symbols-outlined text-[28px]">{v.icon}</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-primary mb-3">{v.title}</h3>
                <p className="text-on-surface-variant font-body-md leading-relaxed text-sm">{v.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-surface-container-low border-t border-outline-variant mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop max-w-container-max mx-auto gap-8">
          <div className="flex flex-col items-center md:items-start">
            <span className="font-headline-md text-headline-md text-primary mb-2">Plant Beauty</span>
            <p className="font-body-md text-on-surface-variant text-center md:text-left">© 2025 Plant Beauty. Nurturing your indoor forest.</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-on-surface-variant hover:underline hover:text-primary transition-colors font-label-md">Privacy Policy</a>
            <a href="#" className="text-on-surface-variant hover:underline hover:text-primary transition-colors font-label-md">Shipping Info</a>
            <a href="#" className="text-on-surface-variant hover:underline hover:text-primary transition-colors font-label-md">Returns</a>
            <a href="#" className="text-on-surface-variant hover:underline hover:text-primary transition-colors font-label-md">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
