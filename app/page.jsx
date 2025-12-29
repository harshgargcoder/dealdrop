import AddProductForm from "@/components/AddProductForm";
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import { BellIcon, RabbitIcon, ShieldIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

export default async function Home() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const products = [];

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
    <main className="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          {/*  Left Side Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Image
              src={"/deal-drop-logo.jpeg"}
              alt="DealDrop Logo"
              width={400}
              height={200}
              className="h-10 w-auto"
            />
          </div>
          {/* Auth Button */}
          <AuthButton user={user} />
        </div>
      </header>

      <section className="text-center py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold font-serif mb-5 tracking-tight transition-colors text-transparent bg-clip-text bg-linear-to-r from-orange-300 to-red-500 sm:text-5xl">
            Never Miss a Deal Again
          </h2>

          <p className="mt-4 text-xl text-gray-600 sm:text-xl mb-12 max-w-2xl mx-auto">
            Track prices from any e-commerce site and get instant alerts when
            prices drop. Save money effortlessly with Deal Drop!
          </p>

          {/*Add Product */}
          <AddProductForm user={user} />

          {/*Features */}
          {products.length === 0 && (
            <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto mt-16">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
                >
                  <div className="bg-orange-100 text-orange-500 rounded-full p-3 mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{title}</h3>
                  <p className="text-gray-600">{description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
