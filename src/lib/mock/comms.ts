import type { Conversation, Notification } from "../types";

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    peerName: "Javohir (Style & Cut)",
    peerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=75",
    salonName: "Style & Cut Salon",
    lastMessage: "Salom, ertaga 18:00 ga yozib qo'ydim 👌",
    lastTime: "10:24",
    unread: 2,
    messages: [
      { id: "m1", from: "them", text: "Salom! Bandlovingiz tasdiqlandi.", time: "10:20" },
      { id: "m2", from: "me", text: "Rahmat! Vaqtni biroz keyinroqqa surish mumkinmi?", time: "10:22" },
      { id: "m3", from: "them", text: "Albatta. 18:00 bo'ladi.", time: "10:23" },
      { id: "m4", from: "them", text: "Salom, ertaga 18:00 ga yozib qo'ydim 👌", time: "10:24" },
    ],
  },
  {
    id: "c2",
    peerName: "Sherzod (Royal Cut)",
    peerAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=75",
    salonName: "Royal Cut Studio",
    lastMessage: "Yaxshi, kutamiz!",
    lastTime: "Kecha",
    unread: 0,
    messages: [
      { id: "m1", from: "me", text: "Assalomu alaykum, ertangi vaqtga yozilsam bo'ladimi?", time: "21:10" },
      { id: "m2", from: "them", text: "Albatta, soat necha?", time: "21:11" },
      { id: "m3", from: "me", text: "16:30", time: "21:11" },
      { id: "m4", from: "them", text: "Yaxshi, kutamiz!", time: "21:12" },
    ],
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", kind: "booking", title: "Bandlov tasdiqlandi", body: "Style & Cut Salon — ertaga 18:00", time: "10 daq oldin", read: false },
  { id: "n2", kind: "chat", title: "Yangi xabar", body: "Javohir: Salom, ertaga 18:00 ga yozib qo'ydim", time: "12 daq oldin", read: false },
  { id: "n3", kind: "promo", title: "Premium chegirma", body: "Royal Cut Studio'da -20% premium fade'larga", time: "2 soat oldin", read: true },
  { id: "n4", kind: "booking", title: "Eslatma", body: "Ertaga sizning bandlovingiz bor", time: "Kecha", read: true },
];
