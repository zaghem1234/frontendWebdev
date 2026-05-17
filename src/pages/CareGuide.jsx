import React from 'react';
import TopNavBar from '../components/TopNavBar';
import CheckoutDrawer from '../components/CheckoutDrawer';
import WhatsAppButton from '../components/WhatsAppButton';
import PromoPopup from '../components/PromoPopup';
import Footer from '../components/Footer';

export default function CareGuide() {
  const guides = [
    {
      category: 'Succulents & Cacti',
      icon: 'wb_sunny',
      light: 'Direct or very bright indirect sunlight. 6+ hours per day.',
      water: 'Water thoroughly only when the soil is completely bone dry. Reduce in winter.',
      tips: [
        'Use well-draining sandy soil mixed with perlite.',
        'Never let water sit in the center of the rosette.',
        'Choose pots with ample drainage holes.'
      ],
      bgGrad: 'from-[#fefce8] to-[#fef08a]'
    },
    {
      category: 'Foliage & Ferns',
      icon: 'opacity',
      light: 'Medium to bright indirect light. Avoid direct midday rays.',
      water: 'Keep soil consistently moist but never soggy. Loves high humidity.',
      tips: [
        'Mist the leaves regularly or use a pebble tray.',
        'Wipe leaves with a damp cloth to remove dust.',
        'Keep away from drafty doorways or AC vents.'
      ],
      bgGrad: 'from-[#f0fdf4] to-[#bbf7d0]'
    },
    {
      category: 'Indoor Trees',
      icon: 'park',
      light: 'Bright indirect light near a south or west-facing window.',
      water: 'Water when the top 2 inches of soil are dry. Water deeply until it runs out.',
      tips: [
        'Rotate the tree 90 degrees every month for even growth.',
        'Prune dead or yellowing leaves to encourage fresh sprouts.',
        'Repot every 2 years into a slightly larger premium planter.'
      ],
      bgGrad: 'from-[#f0fdfa] to-[#99f6e4]'
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
        <section className="text-center mb-16">
          <span className="bg-primary-container text-on-primary-container font-label-md text-[10px] px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block">
            Green Thumb Tips
          </span>
          <h1 className="font-headline-xl text-headline-xl text-primary mb-4">Nursery Care Manual</h1>
          <p className="text-on-surface-variant font-body-md max-w-xl mx-auto leading-relaxed">
            Essential care tips to help your new houseplants thrive in their new home.
          </p>
        </section>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {guides.map((guide) => (
            <div key={guide.category} className="glass-card rounded-2xl overflow-hidden long-shadow flex flex-col p-8 bg-white border border-outline-variant/20 relative">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 bg-gradient-to-tr ${guide.bgGrad}`}>
                <span className="material-symbols-outlined text-primary text-[28px]">{guide.icon}</span>
              </div>
              
              <h2 className="font-headline-md text-headline-md text-primary mb-6">{guide.category}</h2>

              <div className="space-y-4 mb-8">
                <div>
                  <h4 className="text-xs uppercase font-label-md text-on-surface-variant tracking-wider mb-1">☀️ Sunlight Requirement</h4>
                  <p className="text-sm font-body-md text-on-surface leading-relaxed">{guide.light}</p>
                </div>
                <div>
                  <h4 className="text-xs uppercase font-label-md text-on-surface-variant tracking-wider mb-1">💧 Watering Routine</h4>
                  <p className="text-sm font-body-md text-on-surface leading-relaxed">{guide.water}</p>
                </div>
              </div>

              <div className="border-t border-outline-variant/10 pt-6 mt-auto">
                <h4 className="text-xs uppercase font-label-md text-primary tracking-wider mb-3">Expert Care Tips</h4>
                <ul className="space-y-2">
                  {guide.tips.map((tip, idx) => (
                    <li key={idx} className="flex gap-2 items-start text-xs font-body-md text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">check_circle</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Interactive Box */}
        <section className="mt-20 glass-card p-8 md:p-12 rounded-3xl bg-primary/5 border border-primary/10 text-center max-w-3xl mx-auto">
          <span className="material-symbols-outlined text-primary text-5xl mb-4">chat</span>
          <h2 className="font-headline-md text-headline-md text-primary mb-3">Still Unsure? Talk to a Botanist</h2>
          <p className="text-on-surface-variant font-body-md mb-6 max-w-lg mx-auto">
            Each plant is unique and environmental factors like humidity and pot sizes vary. Message us on WhatsApp for tailored advice!
          </p>
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-3 rounded-full font-label-md hover:shadow-lg transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">chat_bubble</span>
            Consult a specialist
          </a>
        </section>
      </main>

      {/* Shared Footer component */}
      <Footer />
    </div>
  );
}
