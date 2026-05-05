import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, X, ShoppingBag, Wrench } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/shared/ProductCard";
import ServiceCard from "@/components/shared/ServiceCard";

// Popular search suggestions
const popularSearches = [
  "Phones",
  "Furniture",
  "Cleaning",
  "Plumber",
  "Car Parts",
  "Tutoring",
  "Herbs",
  "Beauty",
];

// Example fetch functions (replace with your real API)
const fetchProducts = async () => {
  const res = await fetch("/api/products"); // change to your endpoint
  const data = await res.json();
  return data || [];
};

const fetchServices = async () => {
  const res = await fetch("/api/services"); // change to your endpoint
  const data = await res.json();
  return data || [];
};

export default function Search() {
  const [searchText, setSearchText] = useState("");

  // Load products
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // Load services
  const { data: services = [], isLoading: loadingServices } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!searchText) return [];

    const q = searchText.toLowerCase();

    return products.filter((item) =>
      item.title?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q) ||
      item.city?.toLowerCase().includes(q)
    );
  }, [products, searchText]);

  // Filter services based on search
  const filteredServices = useMemo(() => {
    if (!searchText) return [];

    const q = searchText.toLowerCase();

    return services.filter((item) =>
      item.title?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.service_type?.toLowerCase().includes(q) ||
      item.city?.toLowerCase().includes(q)
    );
  }, [services, searchText]);

  const totalResults = filteredProducts.length + filteredServices.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">

      {/* Search Bar */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

        <Input
          placeholder="Search products, services, locations..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="pl-10 pr-10 h-12 rounded-xl"
          autoFocus
        />

        {searchText && (
          <button
            onClick={() => setSearchText("")}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Popular Searches */}
      {!searchText && (
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Popular Searches
          </p>

          <div className="flex flex-wrap gap-2">
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => setSearchText(term)}
                className="px-3 py-1.5 bg-muted rounded-full text-sm hover:bg-muted/80"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Section */}
      {searchText && (
        <>
          <p className="text-sm text-muted-foreground">
            {totalResults} result{totalResults !== 1 ? "s" : ""} for "{searchText}"
          </p>

          <Tabs defaultValue="products">
            <TabsList className="grid grid-cols-2 w-full">
              
              <TabsTrigger value="products">
                <ShoppingBag className="w-3 h-3 mr-1" />
                Products ({filteredProducts.length})
              </TabsTrigger>

              <TabsTrigger value="services">
                <Wrench className="w-3 h-3 mr-1" />
                Services ({filteredServices.length})
              </TabsTrigger>

            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products" className="mt-4">
              {loadingProducts ? (
                <div className="grid grid-cols-2 gap-3">
                  {Array(4).fill(0).map((_, i) => (
                    <Skeleton key={i} className="aspect-square rounded-xl" />
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filteredProducts.map((item) => (
                    <ProductCard key={item.id} product={item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No products found
                </div>
              )}
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services" className="mt-4">
              {loadingServices ? (
                <div className="space-y-3">
                  {Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-28 rounded-xl" />
                  ))}
                </div>
              ) : filteredServices.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {filteredServices.map((item) => (
                    <ServiceCard key={item.id} service={item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No services found
                </div>
              )}
            </TabsContent>

          </Tabs>
        </>
      )}
    </div>
  );
}
