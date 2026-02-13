'use client'

import Link from 'next/link'

/**
 * WistaClinic Homepage
 *
 * Main landing page showing services and offerings
 */
export default function HomePage() {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

        * {
          font-family: 'Poppins', sans-serif;
        }

        .wista-logo-text {
          font-family: 'Poppins', cursive;
          font-weight: 700;
          font-style: italic;
        }
      `}</style>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="/images/logo/logo-gold-no-title.webp"
                  alt="WistaClinic Logo"
                  className="h-10 w-auto"
                  draggable={false}
                />
              </div>

              <nav className="hidden md:flex items-center gap-8 text-sm">
                <Link
                  href="/"
                  className="text-gray-700 hover:text-gray-900 transition"
                >
                  Home
                </Link>
                <Link
                  href="/coffee-menu"
                  className="text-gray-700 hover:text-gray-900 transition"
                >
                  Coffee & Bar
                </Link>
                <Link
                  href="/new-year-offer"
                  className="text-gray-700 hover:text-gray-900 transition"
                >
                  Offers
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <h1 className="text-6xl font-bold text-gray-800 leading-tight">
                Welcome to <span style={{ color: "#D4AF37" }}>WistaClinic</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Your premier destination for dental care, beauty treatments,
                weight loss solutions, and precision laboratory services.
              </p>
              <div className="flex flex-wrap gap-4 justify-center pt-6">
                <Link
                  href="/new-year-offer"
                  style={{ backgroundColor: "#D4AF37" }}
                  className="text-white px-8 py-6 rounded-full text-lg font-semibold hover:opacity-90 transition inline-block"
                >
                  View New Year Offer
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Our Services
              </h2>
              <p className="text-gray-600 text-lg">
                Comprehensive healthcare and beauty solutions under one roof
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  name: "DentaWista",
                  description:
                    "Professional dental care and cosmetic treatments",
                  icon: "🦷",
                  color: "from-blue-100 to-blue-50",
                },
                {
                  name: "Wista Beauty",
                  description: "Expert beauty treatments and rejuvenation",
                  icon: "✨",
                  color: "from-pink-100 to-pink-50",
                },
                {
                  name: "Weight Loss Surgery",
                  description: "Transformative surgical weight loss solutions",
                  icon: "⚕️",
                  color: "from-teal-100 to-teal-50",
                },
                {
                  name: "Wista Lab",
                  description: "High-quality dental laboratory services",
                  icon: "🔬",
                  color: "from-purple-100 to-purple-50",
                },
              ].map((service) => (
                <div
                  key={service.name}
                  className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-shadow"
                >
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center text-3xl mb-4`}
                  >
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Discover our exclusive New Year offer - unlock $50 worth of
              premium services
            </p>
            <Link
              href="/new-year-offer"
              style={{ backgroundColor: "#D4AF37" }}
              className="text-white px-12 py-6 rounded-full text-lg font-semibold hover:opacity-90 transition inline-block"
            >
              Get Your $50 Voucher
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center mb-4">
                  <img
                    src="/images/logo/logo-gold-no-title.webp"
                    alt="WistaClinic Logo"
                    className="h-10 w-auto"
                    draggable={false}
                  />
                </div>
                <p className="text-gray-400 text-sm">
                  Discover the pinnacle of healthcare and beauty at WistaClinic,
                  where every detail is meticulously crafted for your well-being
                  and confidence. Enjoy personalized treatments, innovative
                  technology, and a discreet, luxurious experience—because you
                  deserve only the finest.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Quick Links</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link
                      href="/coffee-menu"
                      className="hover:text-white transition"
                    >
                      Coffee & Bar Menu
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/new-year-offer"
                      className="hover:text-white transition"
                    >
                      New Year Offer
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Contact</h3>
                <p className="text-sm text-gray-400">
                  Merkez, Cendere Cad. No:9
                  <br />
                  34406 Kağıthane/İstanbul, Türkiye
                  <br />
                  +90 507 080 8888
                </p>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
              © 2025 WistaClinic. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
