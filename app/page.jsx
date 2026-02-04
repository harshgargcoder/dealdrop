import AddProductForm from "@/components/AddProductForm";
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import { BellIcon, RabbitIcon, ShieldIcon, TrendingDown } from "lucide-react";
import Image from "next/image";
import React from "react";
import { getProducts } from "./actions";
import ProductCard from "@/components/ProductCard";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const products = user ? await getProducts() : [];

  const FEATURES = [
    {
      icon: RabbitIcon,
      title: "Lightning Fast",
      description:
        "Deal Drop extracts prices in seconds, handling JavaScript and dynamic content with ease",
    },
    {
      icon: ShieldIcon,
      title: "Always Reliable",
      description:
        "Compatible with all major e-commerce sites and equipped with anti-bot protection",
    },
    {
      icon: BellIcon,
      title: "Smart Alerts",
      description:
        "Receive instant notifications when prices fall below your target",
    },
  ];

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-100">

      {/* Soft Glow Background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-300 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-300 rounded-full blur-3xl opacity-30"></div>

      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image
              src={"/deal-drop-logo.jpeg"}
              alt="DealDrop Logo"
              width={400}
              height={200}
              className="h-10 w-auto hover:scale-105 transition-transform duration-300"
            />
          </div>

          <AuthButton user={user} />
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">

          <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-600
">
            Never Miss a Deal Again
          </h2>

          <p className="mt-6 text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Track prices from any e-commerce site and get instant alerts when
            prices drop. Save money effortlessly with Deal Drop!
          </p>

          {/* Add Product Card */}
          <div className="bg-white shadow-xl border border-gray-100 rounded-2xl p-6 max-w-3xl mx-auto hover:shadow-2xl transition duration-300">
            <AddProductForm user={user} />
          </div>

          {/* Features */}
          {products.length === 0 && (
            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto mt-20">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="group bg-white border border-gray-200 rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-600 rounded-full p-4 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Products Section */}
      {user && products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-24 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Your Tracked Products
            </h3>

            <span className="text-gray-600 text-sm">
              {products.length}{" "}
              {products.length === 1 ? "product" : "products"}
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="transition-transform duration-300 hover:scale-[1.02]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {user && products.length === 0 && (
        <section className="max-w-2xl mx-auto px-4 pb-24 text-center relative z-10">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 hover:shadow-md transition">
            <TrendingDown className="w-16 h-16 text-gray-400 mx-auto mb-4" />

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products yet
            </h3>

            <p className="text-gray-600">
              Add your first product above to start tracking prices!
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
