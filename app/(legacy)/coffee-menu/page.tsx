'use client'

import Image from "next/image";
import { Coffee, Droplets, Leaf } from "lucide-react";
import { motion } from "framer-motion";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  iconType: 'coffee' | 'leaf' | 'droplets';
}

const menuItems: MenuItem[] = [
  // Hot Coffee
  {
    id: "turkish-coffee",
    name: "Turkish Coffee",
    description: "Traditional Turkish coffee, rich and aromatic",
    category: "Hot Coffee",
    image: "https://images.pexels.com/photos/28468263/pexels-photo-28468263.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    iconType: 'coffee',
  },
  {
    id: "espresso",
    name: "Espresso",
    description: "Pure, intense coffee shot",
    category: "Hot Coffee",
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop",
    iconType: 'coffee',
  },
  {
    id: "americano",
    name: "Americano",
    description: "Smooth espresso with hot water",
    category: "Hot Coffee",
    image: "https://images.pexels.com/photos/908331/pexels-photo-908331.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    iconType: 'coffee',
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    description: "Espresso with steamed milk and foam",
    category: "Hot Coffee",
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop",
    iconType: 'coffee',
  },
  {
    id: "latte",
    name: "Latte",
    description: "Smooth espresso with steamed milk",
    category: "Hot Coffee",
    image: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400&h=300&fit=crop",
    iconType: 'coffee',
  },
  {
    id: "mocha",
    name: "Mocha",
    description: "Rich chocolate with espresso",
    category: "Hot Coffee",
    image: "https://images.pexels.com/photos/350478/pexels-photo-350478.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    iconType: 'coffee',
  },
  {
    id: "hot-chocolate",
    name: "Hot Chocolate",
    description: "Rich and creamy hot chocolate",
    category: "Hot Coffee",
    image: "https://images.pexels.com/photos/7994278/pexels-photo-7994278.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    iconType: 'coffee',
  },
  // Tea Selection
  {
    id: "turkish-tea",
    name: "Turkish Tea",
    description: "Classic Turkish çay",
    category: "Tea Selection",
    image: "https://images.pexels.com/photos/7393900/pexels-photo-7393900.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    iconType: 'leaf',
  },
  {
    id: "green-tea",
    name: "Green Tea",
    description: "Light and refreshing",
    category: "Tea Selection",
    image: "https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    iconType: 'leaf',
  },
  {
    id: "herbal-tea",
    name: "Herbal Tea",
    description: "Soothing herbal infusion",
    category: "Tea Selection",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=400&h=300&fit=crop",
    iconType: 'leaf',
  },
  {
    id: "mint-tea",
    name: "Mint Tea",
    description: "Fresh and cooling",
    category: "Tea Selection",
    image: "https://images.pexels.com/photos/7565515/pexels-photo-7565515.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    iconType: 'leaf',
  },
  // Cold Beverages
  {
    id: "iced-coffee",
    name: "Iced Coffee",
    description: "Refreshing cold brew",
    category: "Cold Beverages",
    image: "https://images.pexels.com/photos/12900860/pexels-photo-12900860.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    iconType: 'coffee',
  },
  {
    id: "iced-tea",
    name: "Iced Tea",
    description: "Chilled tea with ice",
    category: "Cold Beverages",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop",
    iconType: 'leaf',
  },
  // Water
  {
    id: "still-water",
    name: "Still Water",
    description: "Pure spring water",
    category: "Water",
    image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop",
    iconType: 'droplets',
  },
  {
    id: "sparkling-water",
    name: "Sparkling Water",
    description: "Effervescent mineral water",
    category: "Water",
    image: "https://images.pexels.com/photos/4612341/pexels-photo-4612341.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    iconType: 'droplets',
  },
];

const categories = ["Hot Coffee", "Tea Selection", "Cold Beverages", "Water"];

// Helper function to render icon based on type
const renderIcon = (iconType: 'coffee' | 'leaf' | 'droplets') => {
  const iconClass = "w-5 h-5";
  switch (iconType) {
    case 'coffee':
      return <Coffee className={iconClass} />;
    case 'leaf':
      return <Leaf className={iconClass} />;
    case 'droplets':
      return <Droplets className={iconClass} />;
  }
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function CoffeeMenu() {
  return (
    <div className="fixed inset-0 overflow-y-auto bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 dark:opacity-10 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative w-full z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center pt-16 pb-12 px-4"
        >
          <div className="inline-flex items-center justify-center mb-6">
            <Image
              src="/images/logo/wista-logo-gold.webp"
              alt="WistaClinic"
              width={240}
              height={128}
              priority
              className="h-24 md:h-32 w-auto object-contain drop-shadow-lg"
            />
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-amber-800 via-orange-700 to-amber-800 dark:from-amber-400 dark:via-orange-400 dark:to-amber-400 bg-clip-text text-transparent mb-4">
            Complimentary Coffee Bar
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light max-w-2xl mx-auto">
            Welcome to our coffee lounge. All beverages are complimentary for our valued guests.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-amber-700 dark:text-amber-400">
            <div className="h-px w-12 bg-amber-300 dark:bg-amber-700" />
            <span className="text-sm uppercase tracking-widest">Enjoy Your Visit</span>
            <div className="h-px w-12 bg-amber-300 dark:bg-amber-700" />
          </div>
        </motion.div>

        {/* Menu Grid */}
        <div className="max-w-7xl mx-auto px-4 pb-20">
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: categoryIndex * 0.2 }}
              className="mb-16"
            >
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 dark:via-amber-700 to-transparent" />
                <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
                  {category}
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 dark:via-amber-700 to-transparent" />
              </div>

              {/* Items Grid */}
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {menuItems
                  .filter((item) => item.category === category)
                  .map((menuItem) => (
                    <motion.div
                      key={menuItem.id}
                      variants={item}
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                      className="group"
                    >
                      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                          <Image
                            src={menuItem.image}
                            alt={menuItem.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {/* Icon Badge */}
                          <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                            {renderIcon(menuItem.iconType)}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                            {menuItem.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {menuItem.description}
                          </p>
                        </div>

                        {/* Bottom Accent */}
                        <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Review Request Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="max-w-2xl mx-auto px-4 pb-12"
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-3xl shadow-xl border border-amber-200 dark:border-amber-700 p-8">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-300/20 dark:bg-amber-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-300/20 dark:bg-orange-600/20 rounded-full blur-3xl" />

            <div className="relative text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 mb-4 shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                Enjoying Your Visit?
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                While your beverage is being prepared, we&apos;d love to hear about your experience at WistaClinic. Your feedback helps us serve you better!
              </p>

              <a
                href={`https://search.google.com/local/writereview?placeid=${process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || 'ChIJa4cBYZa7yhQRXXELf19KbAU'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>Leave a Google Review</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>

              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Takes less than a minute • Opens in a new tab
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center pb-12 px-4"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg border border-amber-200 dark:border-amber-700">
            <Coffee className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              All items complimentary • Enjoy your visit
            </span>
            <Coffee className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
