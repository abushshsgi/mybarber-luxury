export type Service = {
  id: string;
  name: string;
  durationMin: number;
  price: number;
  category: "haircut" | "beard" | "kids" | "premium" | "color";
};

export type Review = {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  text: string;
  date: string;
};

export type Barber = {
  id: string;
  name: string;
  avatar: string;
  salonId?: string;
  salonName?: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  bio: string;
  lat: number;
  lng: number;
  distanceKm?: number;
  portfolio: string[];
  services: Service[];
};

export type Salon = {
  id: string;
  name: string;
  cover: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  address: string;
  lat: number;
  lng: number;
  distanceKm?: number;
  about: string;
  hours: string;
  open: boolean;
  services: Service[];
  staff: Barber[];
  reviews: Review[];
  tags: string[];
};

export type BookingStatus = "upcoming" | "completed" | "cancelled";

export type Booking = {
  id: string;
  salonId: string;
  salonName: string;
  salonCover: string;
  barberId: string;
  barberName: string;
  service: Service;
  date: string; // ISO
  status: BookingStatus;
  createdAt: string;
};

export type ChatMessage = {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
};

export type Conversation = {
  id: string;
  peerName: string;
  peerAvatar: string;
  salonName: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: ChatMessage[];
};

export type Notification = {
  id: string;
  kind: "booking" | "chat" | "promo";
  title: string;
  body: string;
  time: string;
  read: boolean;
};

export type User = {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  role: "customer" | "barber";
};
