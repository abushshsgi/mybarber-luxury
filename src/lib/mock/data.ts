import type { Salon, Barber, Service, Review } from "./types";

const TASHKENT = { lat: 41.3111, lng: 69.2797 };

const SERVICES: Service[] = [
  { id: "s1", name: "Klassik soch olish", durationMin: 40, price: 80000, category: "haircut" },
  { id: "s2", name: "Premium fade", durationMin: 50, price: 120000, category: "haircut" },
  { id: "s3", name: "Soqol shakli", durationMin: 25, price: 50000, category: "beard" },
  { id: "s4", name: "Soch + Soqol", durationMin: 70, price: 160000, category: "premium" },
  { id: "s5", name: "Bola sochi", durationMin: 30, price: 60000, category: "kids" },
  { id: "s6", name: "Royal shave", durationMin: 45, price: 140000, category: "premium" },
];

const REVIEWS: Review[] = [
  { id: "r1", author: "Akmal T.", rating: 5, text: "Eng yaxshi joy, barber juda professional.", date: "2 kun oldin" },
  { id: "r2", author: "Bekzod S.", rating: 5, text: "Premium xizmat, interer ham ajoyib.", date: "1 hafta oldin" },
  { id: "r3", author: "Doniyor R.", rating: 4, text: "Yaxshi, lekin band soatlarda kutish bor.", date: "2 hafta oldin" },
  { id: "r4", author: "Sardor M.", rating: 5, text: "Har doim shu yerga keladigan bo'ldim.", date: "3 hafta oldin" },
];

const PORTFOLIO = [
  "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=70",
  "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=70",
  "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=600&q=70",
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=70",
  "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=70",
  "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=600&q=70",
];

const COVERS = [
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200&q=75",
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=75",
  "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&q=75",
  "https://images.unsplash.com/photo-1572663459735-75425e957ab9?w=1200&q=75",
  "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=1200&q=75",
  "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=1200&q=75",
];

const AVATARS = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=75",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&q=75",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&q=75",
  "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&q=75",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&q=75",
  "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=300&q=75",
];

function jitter(base: number, range: number) {
  return base + (Math.random() - 0.5) * range;
}

const STAFF_NAMES = ["Javohir", "Sherzod", "Aziz", "Bobur", "Ulug'bek", "Otabek", "Jasur", "Akbar"];

function makeStaff(salonId: string, salonName: string, lat: number, lng: number, count: number): Barber[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: `${salonId}-b${i}`,
    name: STAFF_NAMES[(i + salonId.length) % STAFF_NAMES.length],
    avatar: AVATARS[(i + salonId.length) % AVATARS.length],
    salonId,
    salonName,
    rating: Number((4.5 + Math.random() * 0.5).toFixed(1)),
    reviewCount: 30 + Math.floor(Math.random() * 200),
    specialties: ["Fade", "Klassik", "Soqol"].slice(0, 1 + (i % 3)),
    bio: "5+ yil tajriba, premium fade va soqol mutaxassisi.",
    lat,
    lng,
    portfolio: PORTFOLIO.slice(0, 4),
    services: SERVICES.slice(0, 4),
  }));
}

const SALON_NAMES = [
  "Style & Cut Salon",
  "Premium Barber Lounge",
  "The Gentleman's Room",
  "Royal Cut Studio",
  "Noble Barber House",
  "Atelier Coiffeur",
  "Mirza Premium Cuts",
  "Chilonzor Barber Co.",
  "Black Comb Studio",
  "Beige & Gold Salon",
];

const ADDRESSES = [
  "Mirzo Ulug'bek, Toshkent",
  "Chilonzor 9, Toshkent",
  "Yunusobod 12, Toshkent",
  "Mirobod, Toshkent",
  "Yakkasaroy, Toshkent",
  "Sergeli, Toshkent",
  "Olmazor, Toshkent",
  "Shayxontohur, Toshkent",
  "Bektemir, Toshkent",
  "Uchtepa, Toshkent",
];

export const ALL_SALONS: Salon[] = SALON_NAMES.map((name, i) => {
  const lat = jitter(TASHKENT.lat, 0.06);
  const lng = jitter(TASHKENT.lng, 0.08);
  const id = `salon-${i + 1}`;
  return {
    id,
    name,
    cover: COVERS[i % COVERS.length],
    gallery: PORTFOLIO,
    rating: Number((4.4 + Math.random() * 0.55).toFixed(1)),
    reviewCount: 60 + Math.floor(Math.random() * 250),
    address: ADDRESSES[i % ADDRESSES.length],
    lat,
    lng,
    about: "Zamonaviy xizmatlar, qulay muhit va professionallar jamoasi. Premium tajriba uchun ideal joy.",
    hours: "09:00 — 21:00",
    open: true,
    services: SERVICES,
    staff: makeStaff(id, name, lat, lng, 3 + (i % 3)),
    reviews: REVIEWS,
    tags: ["Premium", "Fade", "Soqol"],
  };
});

export const ALL_BARBERS: Barber[] = ALL_SALONS.flatMap((s) => s.staff);

export const TASHKENT_FALLBACK = TASHKENT;
export { SERVICES };
