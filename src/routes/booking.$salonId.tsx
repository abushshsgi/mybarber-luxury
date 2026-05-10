import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getSalon } from "@/lib/api/catalog";
import { BookingFlow } from "@/components/luxury/BookingFlow";
import { LoadingSkeleton } from "@/components/luxury/States";

export const Route = createFileRoute("/booking/$salonId")({
  component: BookingPage,
  errorComponent: ({ error }) => <div className="p-6">{error.message}</div>,
  notFoundComponent: () => <div className="p-6 text-center">Salon topilmadi</div>,
});

function BookingPage() {
  const { salonId } = Route.useParams();
  const { data: salon, isLoading } = useQuery({
    queryKey: ["salon-booking", salonId],
    queryFn: async () => {
      const s = await getSalon(salonId);
      if (!s) throw notFound();
      return s;
    },
  });
  if (isLoading || !salon) return <div className="p-4"><LoadingSkeleton className="h-96" /></div>;
  return <BookingFlow salon={salon} />;
}
