"use server";

import { scrapeProduct } from "@/lib/firecrawl";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
  redirect("/");
}

export async function addProduct(formData) {
  const url = formData.get("url");

  if (!url || typeof url !== "string") {
    return { error: "URL is required" };
  }

  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "User not authenticated" };
    }

    const productData = await scrapeProduct(url);

    if (!productData?.productName || !productData?.currentPrice) {
      return { error: "Failed to extract product data" };
    }

    const rawPrice = productData.currentPrice;
    const newPrice = Number(rawPrice.replace(/[^0-9.]/g, ""));

    if (!newPrice || Number.isNaN(newPrice)) {
      return { error: "Invalid price extracted" };
    }

    const currency = productData.currencyCode || "INR";

    const { data: existingProduct } = await supabase
      .from("products")
      .select("id, current_price")
      .eq("user_id", user.id)
      .eq("url", url)
      .maybeSingle();

    const { data: product, error } = await supabase
      .from("products")
      .upsert(
        {
          user_id: user.id,
          url,
          name: productData.productName,
          current_price: newPrice,
          currency,
          image_url: productData.productImageUrl || null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,url",
        }
      )
      .select()
      .single();

    if (error) throw error;

    if (!existingProduct || existingProduct.current_price !== newPrice) {
      await supabase.from("price_history").insert({
        product_id: product.id,
        price: newPrice,
        currency,
      });
    }

    revalidatePath("/");

    return {
      success: true,
      product,
    };
  } catch (error) {
    return { error: error.message || "Failed to add product" };
  }
}

export async function deleteProduct(productId) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) throw error;

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

export async function getProducts() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch {
    return [];
  }
}

export async function getPriceHistory(productId) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("price_history")
      .select("*")
      .eq("product_id", productId)
      .order("checked_at", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch {
    return [];
  }
}
