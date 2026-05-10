import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getBarber, getSalon } from "@/lib/api/catalog";
import { BookingFlow } from "@/components/luxury/BookingFlow";
import { LoadingSkeleton } from "@/components/luxury/States";

export const Route = createFileRoute("/booking/barber/$barberId")({
  component: BarberBookingPage,
  errorComponent: ({ error }) => <div className="p-6">{error.message}</div>,
  notFoundComponent: () => <div className="p-6 text-center">Barber topilmadi</div>,
});

function BarberBookingPage() {
  const { barberId } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["barber-booking", barberId],
    queryFn: async () => {
      const b = await getBarber(barberId);
      if (!b || !b.salonId) throw notFound();
      const s = await getSalon(b.salonId);
      if (!s) throw notFound();
      return { barber: b, salon: s };
    },
  });
  if (isLoading || !data) return <div className="p-4"><LoadingSkeleton className="h-96" /></div>;
  return <BookingFlow salon={data.salon} initialBarber={data.barber} lockBarber />;
}
