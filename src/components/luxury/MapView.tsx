import { APIProvider, Map, AdvancedMarker, Pin, useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";
import { MapPin } from "lucide-react";

const KEY = (import.meta as { env?: Record<string, string | undefined> }).env?.VITE_GOOGLE_MAPS_API_KEY ?? "";
const MAP_ID = "mybarber_beige";

type Marker = { id: string; lat: number; lng: number; label: string };

function Recenter({ center, activeId, markers }: { center: { lat: number; lng: number } | null; activeId: string | null; markers: Marker[] }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    if (activeId) {
      const m = markers.find((x) => x.id === activeId);
      if (m) map.panTo({ lat: m.lat, lng: m.lng });
    } else if (center) {
      map.panTo(center);
    }
  }, [map, center, activeId, markers]);
  return null;
}

export function MapView({
  center,
  markers,
  activeId,
  onMarkerClick,
  radiusKm,
}: {
  center: { lat: number; lng: number } | null;
  markers: Marker[];
  activeId: string | null;
  onMarkerClick: (id: string) => void;
  radiusKm: number;
}) {
  if (!KEY) {
    return (
      <div className="grid h-full place-items-center bg-gradient-to-br from-muted to-secondary p-6 text-center">
        <div>
          <MapPin className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-semibold text-foreground">Xarita kalitini sozlash kerak</p>
          <p className="mt-1 text-xs text-muted-foreground">VITE_GOOGLE_MAPS_API_KEY o'rnatilmagan. Ro'yxat pastda ko'rsatilmoqda.</p>
        </div>
      </div>
    );
  }
  const fallback = center ?? { lat: 41.3111, lng: 69.2797 };
  return (
    <APIProvider apiKey={KEY}>
      <Map
        defaultCenter={fallback}
        defaultZoom={radiusKm === 1 ? 15 : radiusKm === 2 ? 14 : 13}
        mapId={MAP_ID}
        gestureHandling="greedy"
        disableDefaultUI
        clickableIcons={false}
        style={{ width: "100%", height: "100%" }}
      >
        <Recenter center={center} activeId={activeId} markers={markers} />
        {center && (
          <AdvancedMarker position={center}>
            <span className="block h-4 w-4 rounded-full bg-teal ring-4 ring-teal/30" aria-label="Sizning joylashuvingiz" />
          </AdvancedMarker>
        )}
        {markers.map((m) => (
          <AdvancedMarker key={m.id} position={{ lat: m.lat, lng: m.lng }} onClick={() => onMarkerClick(m.id)}>
            <Pin
              background={activeId === m.id ? "#0A0A0A" : "#D4AF37"}
              borderColor="#0A0A0A"
              glyphColor="#F3EFE6"
              scale={activeId === m.id ? 1.2 : 1}
            />
          </AdvancedMarker>
        ))}
      </Map>
    </APIProvider>
  );
}
