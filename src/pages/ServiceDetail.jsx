import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  ArrowLeft,
  MapPin,
  Star,
  CheckCircle,
  Briefcase,
  MessageCircle,
  Calendar,
  Share2,
  Clock,
} from "lucide-react";

import { toast } from "sonner";

/* ---------------- API FUNCTIONS (replace with your backend) ---------------- */

const fetchService = async (id) => {
  const res = await fetch(`/api/services/${id}`);
  return res.json();
};

const fetchUser = async () => {
  const res = await fetch(`/api/me`);
  return res.json();
};

const fetchReviews = async (id) => {
  const res = await fetch(`/api/reviews?serviceId=${id}`);
  return res.json();
};

const createBooking = async (bookingData) => {
  const res = await fetch(`/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingData),
  });
  return res.json();
};

/* ---------------- MAIN COMPONENT ---------------- */

export default function ServiceDetail() {
  const { id } = useParams();

  const [selectedDate, setSelectedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);

  /* ---------------- DATA FETCHING ---------------- */

  const { data: service, isLoading } = useQuery({
    queryKey: ["service", id],
    queryFn: () => fetchService(id),
  });

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => fetchReviews(id),
    enabled: !!id,
  });

  /* ---------------- BOOKING ---------------- */

  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      toast.success("Booking request sent!");
      setShowBookingModal(false);
      setSelectedDate("");
      setNotes("");
    },
  });

  const handleBooking = () => {
    bookingMutation.mutate({
      service_id: service.id,
      service_title: service.title,
      provider_email: service.created_by,
      customer_email: user?.email,
      customer_name: user?.full_name,
      date: selectedDate,
      notes: notes,
    });
  };

  /* ---------------- LOADING ---------------- */

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  /* ---------------- NOT FOUND ---------------- */

  if (!service) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl">😕</p>
        <p className="text-muted-foreground">Service not found</p>
        <Link to="/services">
          <Button className="mt-4">Browse Services</Button>
        </Link>
      </div>
    );
  }

  /* ---------------- HELPER DATA ---------------- */

  const image =
    service.images?.[0] ||
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e";

  const whatsappLink = service.provider_phone
    ? `https://wa.me/${service.provider_phone.replace(
        /[^0-9]/g,
        ""
      )}?text=${encodeURIComponent(
        `Hi, I'm interested in your service: "${service.title}"`
      )}`
    : null;

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">

      {/* Back button */}
      <Link to="/services" className="flex items-center gap-1 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      {/* Main Card */}
      <div className="border rounded-xl overflow-hidden">

        {/* Image */}
        <img src={image} className="w-full h-60 object-cover" />

        <div className="p-5 space-y-4">

          {/* Title + Price */}
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {service.title}
                {service.is_verified && (
                  <CheckCircle className="w-5 h-5 text-primary" />
                )}
              </h1>

              <p className="text-sm text-muted-foreground">
                {service.service_type}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xl font-bold text-primary">
                {service.price_from ? `R${service.price_from}` : "Get Quote"}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 text-sm">

            {service.rating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                {service.rating}
              </span>
            )}

            {service.jobs_completed > 0 && (
              <span className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                {service.jobs_completed} jobs
              </span>
            )}

            {service.experience_years > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {service.experience_years} years
              </span>
            )}

            {service.city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {service.city}
              </span>
            )}
          </div>

          {/* Description */}
          {service.description && (
            <p className="text-sm text-muted-foreground">
              {service.description}
            </p>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2">

            {/* Booking */}
            <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
              <DialogTrigger asChild>
                <Button>
                  <Calendar className="w-4 h-4" /> Book
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Book Service</DialogTitle>
                </DialogHeader>

                <div className="space-y-3">

                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />

                  <Textarea
                    placeholder="Describe your request..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />

                  <Button
                    onClick={handleBooking}
                    disabled={!selectedDate || bookingMutation.isPending}
                  >
                    {bookingMutation.isPending
                      ? "Booking..."
                      : "Confirm Booking"}
                  </Button>

                </div>
              </DialogContent>
            </Dialog>

            {/* WhatsApp or Share */}
            {whatsappLink ? (
              <a href={whatsappLink} target="_blank">
                <Button variant="outline">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </Button>
              </a>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied!");
                }}
              >
                <Share2 className="w-4 h-4" /> Share
              </Button>
            )}

          </div>
        </div>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-2">Reviews</h2>

          {reviews.map((r) => (
            <div key={r.id} className="border rounded-xl p-3 mb-2">
              <p className="font-medium">
                {r.reviewer_name || "Anonymous"}
              </p>
              <p className="text-sm text-muted-foreground">
                {r.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
