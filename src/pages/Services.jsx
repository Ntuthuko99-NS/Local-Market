import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { Search, SlidersHorizontal, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import ServiceCard from "@/components/shared/ServiceCard";

/* ---------------- SERVICE TYPES ---------------- */

const serviceTypes = [
  { value: "all", label: "All Services" },
  { value: "plumbing", label: "🔧 Plumbing" },
  { value: "electrical", label: "⚡ Electrical" },
  { value: "cleaning", label: "🧹 Cleaning" },
  { value: "gardening", label: "🌿 Gardening" },
  { value: "painting", label: "🎨 Painting" },
  { value: "carpentry", label: "🪚 Carpentry" },
  { value: "transport", label: "🚚 Transport" },
  { value: "tutoring", label: "📚 Tutoring" },
  { value: "beauty", label: "💅 Beauty" },
  { value: "cooking", label: "🍳 Cooking" },
  { value: "childcare", label: "👶 Childcare" },
  { value: "security", label: "🛡️ Security" },
  { value: "it_services", label: "💻 IT Services" },
  { value: "handyman", label: "🔨 Handyman" },
  { value: "other", label: "Other" },
];

/* ---------------- API FUNCTION ---------------- */

const fetchServices = async () => {
  const res = await fetch("/api/services"); // replace with your backend
  const data = await res.json();
  return data || [];
};

/* ---------------- MAIN COMPONENT ---------------- */

export default function Services() {
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  /* ---------------- FETCH DATA ---------------- */

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  /* ---------------- FILTER LOGIC ---------------- */

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch =
        !searchText ||
        service.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchText.toLowerCase());

      const matchesType =
        selectedType === "all" || service.service_type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [services, searchText, selectedType]);

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">🧰 Services</h1>

        <Link to="/create?type=service">
          <Button size="sm">+ Post Service</Button>
        </Link>
      </div>

      {/* Search + Filter Button */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <Input
            placeholder="Search services..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-9"
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {serviceTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Active Filter Badge */}
      {selectedType !== "all" && (
        <Badge variant="secondary" className="gap-1">
          {serviceTypes.find((t) => t.value === selectedType)?.label}

          <X
            className="w-3 h-3 cursor-pointer"
            onClick={() => setSelectedType("all")}
          />
        </Badge>
      )}

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        {filteredServices.length}{" "}
        {filteredServices.length === 1 ? "service" : "services"} available
      </p>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

        {isLoading
          ? Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))
          : filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}

      </div>

      {/* Empty State */}
      {!isLoading && filteredServices.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl">🔍</p>
          <p className="text-muted-foreground">No services found</p>
        </div>
      )}

    </div>
  );
}
