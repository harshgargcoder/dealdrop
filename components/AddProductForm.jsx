"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const AddProductForm = ({ user }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {};

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-2 max-w-auto mx-auto">
          <Input
            type="url"
            value={url}
            placeholder="Enter product URL"
            className="h-9 text-base"
            onChange={(e) => setUrl(e.target.value)}
            required
            disabled={loading}
          />
          <Button
            className="h-10 bg-orange-600 hover:bg-orange-700 sm:h-9 px-8"
            type="submit"
            disabled={loading}
            size={"lg"}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Track Price"
            )}
          </Button>
        </div>
      </form>

      {/*Auth Model*/}

    </>
  );
};

export default AddProductForm;
