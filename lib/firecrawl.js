import Firecrawl from "@mendable/firecrawl-js";

const firecrawl = new Firecrawl({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

export async function scrapeProduct(url) {
  try {
    if (!url || typeof url !== "string") {
      throw new Error("Invalid URL");
    }

    const result = await firecrawl.scrape(
      url.trim(),
      {
        formats: [
          {
            type: "json",
            schema: {
              type: "object",
              required: ["productName", "currentPrice"],
              properties: {
                productName: { type: "string" },
                currentPrice: { type: "string" },
                currencyCode: { type: "string" },
                productImageUrl: { type: "string" },
              },
            },
            prompt:
              "Extract the product name as 'productName', current price as 'currentPrice', currency code as 'currencyCode', and product image URL as 'productImageUrl' if available",
          },
        ],
      }
    );

    const extractedData = result.json;

    if (!extractedData?.productName) {
      throw new Error("No product data extracted");
    }

    return extractedData;
  } catch (error) {
    console.error("Firecrawl scrape error:", error);
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}
