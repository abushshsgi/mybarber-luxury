# MyBarber — Mijoz ilovasi (production-ready frontend)

## Eslatma — backend tanlovi

Siz "backend kerak emas" dedingiz. Bu degani:
- Barcha ma'lumotlar **mock** (TypeScript fixtures: salons, barbers, bookings, chats, notifications)
- Telefon + OTP login **vizual oqim** sifatida ishlaydi (har qanday 4 xonali kod qabul qilinadi, sessiya `localStorage`'da). Real SMS yuborish keyin Twilio + Lovable Cloud bilan ulanadi.
- Bandlash, chat va bildirishnomalar lokal state'da yashaydi (sahifa yangilanganda saqlanadi `localStorage` orqali, lekin real-time yo'q).

Agar keyinchalik real backend kerak bo'lsa — Lovable Cloud yoqamiz va mock layer'ni almashitirish oson bo'ladi (barcha ma'lumotlar bitta `src/lib/api/` papkasidan o'tadi).

## Google Maps API key

Xarita uchun **Google Maps JavaScript API key** kerak bo'ladi. Plan tasdiqlangach so'rayman va `secret` sifatida saqlanadi (server tomonda ishlatamiz yoki referrer-restricted publishable key sifatida frontend'da).

---

## 1) Brand DNA — Design tokens (`src/styles.css`)

Beige luxury + black premium. Barchasi `oklch` formatida:

- `--background`: warm beige (#F3EF66 emas — to'g'risi `#F3EFE6`)
- `--surface`: ivory white
- `--foreground`: rich charcoal (#111111)
- `--muted-foreground`: warm brown-gray (#6B6B68)
- `--border`: soft warm gray (#E5E5E5)
- `--accent` (gold): #D4AF37
- `--accent-2` (teal/olive): #14B8A6
- `--primary` (premium black): #0A0A0A
- Radius: `--radius: 1rem` (rounded-2xl default, dock 3xl)
- Shadows: `--shadow-luxury`, `--shadow-dock`, `--shadow-card`
- Gradients: `--gradient-gold`, `--gradient-beige-fade`

Shrift: **Plus Jakarta Sans** (asosiy) + **Inter** (UI), Google Fonts orqali. Sarlavha bold, body regular, label medium uppercase tracking.

Dark mode: premium black background, beige accent (teskari).

## 2) Texnologiya qo'shimchalari

`bun add` qilamiz:
- `@vis.gl/react-google-maps` — Google Maps wrapper (modern, lazy)
- `framer-motion` — animatsiyalar
- `zod` — form validatsiya
- `date-fns` — sana formatlash
- `zustand` — lightweight global state (auth, bookings, notifications)

Lucide va shadcn/ui allaqachon mavjud.

## 3) Routing arxitekturasi (TanStack Router)

```
src/routes/
  __root.tsx                    # html shell + providers
  _app.tsx                      # bottom dock layout (faqat dock'li sahifalar)
  _app/index.tsx                # / (Discover)
  _app/map.tsx                  # /map
  _app/bookings.tsx             # /bookings
  _app/chat.tsx                 # /chat
  _app/notifications.tsx        # /notifications
  _app/profile.tsx              # /profile
  salon.$id.tsx                 # /salon/:id (full-screen, dock yashirin)
  booking.$salonId.tsx          # /booking/:salonId
  booking.barber.$barberId.tsx  # /booking/barber/:barberId
  chat.$id.tsx                  # /chat/:id (thread, full-screen)
  auth.tsx                      # /auth (phone + OTP)
```

`_app` pathless layout `<Outlet />` + `<FloatingBottomDock />` render qiladi. Salon/booking/chat thread sahifalari dock'siz, full immersive.

## 4) Shared komponentlar (`src/components/luxury/`)

- `LuxurySearchBar` — beige glass, gold focus ring
- `FloatingBottomDock` — 6 ta tab, faol holat: black pill + gold dot
- `RadiusSelector` — 1/2/3 km chips
- `SalonCardPremium` — cover, ism, ⭐ rating, masofa, "Band qilish"
- `BarberCardPremium` — avatar, ism, salon, rating
- `BookingCard` — sana, vaqt, status badge, rebook
- `ProfileHeaderLuxury` — avatar + greeting
- `NotificationCardLuxury` — read/unread dot
- `EmptyStateLuxury` + `ErrorStateLuxury` + `LoadingSkeleton`
- `ServiceChip`, `CategoryChip`, `RatingStars`, `Money`
- `SectionHeader` (editorial style)
- `SafeAreaWrapper`

## 5) Sahifalar — to'liq spetsifikatsiya

### `/` Discover
Greeting → search bar → category chips (Soch, Soqol, Bola, Premium) → "Yaqin atrofda" 3 ta salon (horizontal scroll) → "Top reyting" → "Trending barberlar" → empty/skeleton/error holatlar.

### `/map` Map (eng muhim)
Sticky top: "Yaqin atrofingiz" + location status + retry. Radius chips. Google Map (lazy, custom beige style). User pin + nearby markers. Marker tap → bottom sheet card highlight. FAB "Men" (fly-to-user). Bottom sheet: Salonlar/Barberlar tab, scroll list, card↔marker sync. Filter tugmasi.

### `/salon/:id`
Cover image hero → name + rating + distance → "Ma'lumot / Xizmatlar / Staff / Sharhlar" tabs → portfolio grid → sticky bottom "Band qilish".

### `/booking/:salonId` va `/booking/barber/:barberId`
Step 1: Xizmat tanlash → Step 2: Barber (salon flow'da) → Step 3: Sana (calendar) → Step 4: Vaqt slot grid → Step 5: Summary + Confirm → Success ekran (yoki graceful failure).

### `/bookings`
Tabs: Upcoming / Completed / Cancelled. Empty CTA → Discover'ga.

### `/chat` + `/chat/:id`
Suhbatlar ro'yxati → tap → thread (mock messaging, typing indicator, attachment placeholder).

### `/notifications`
Read/unread, "Hammasini o'qilgan deb belgilash", booking + chat alerts.

### `/profile`
Avatar header → settings list (Appearance/Til/Sozlamalar) → "Open Barber Panel" CTA (agar barber rol mock'da bo'lsa) → Logout. Boshqa rollarga tegishli funksiyalar (admin, staff approval) **yo'q**.

### `/auth`
Step 1: Telefon raqam (+998 mask) → Step 2: 4 xonali OTP (har qanday qabul qilinadi mock'da) → success → `/`. Premium minimal UI.

## 6) State arxitekturasi

- `useAuthStore` (zustand) — user, session, login/logout
- `useBookingsStore` — local bookings (localStorage persist)
- `useNotificationsStore` — read state
- `useGeoStore` — user location, radius, permission state
- Mock data: `src/lib/mock/{salons,barbers,services,reviews,chats,notifications}.ts`
- Data layer: `src/lib/api/*.ts` (mock fetchers, async + delay simulatsiya, kelajakda real API'ga almashitirish oson)

## 7) Performance + UX

- Map lazy import (`React.lazy`)
- Lists: scroll smooth, image lazy
- Skeleton barcha async UI'da
- `prefers-reduced-motion` respect
- 44px+ tap targets
- Safe-area `env(safe-area-inset-bottom)` dock uchun
- Debounce search 300ms
- Geolocation timeout 5s + fallback (Toshkent markaz)

## 8) Role boundary

Customer-only. Hech qanday admin/staff/team/membership UI yo'q. Agar foydalanuvchi mock'da `role: "barber"` bo'lsa, profile'da yagona CTA: "Open Barber Panel" (link placeholder).

## 9) Definition of Done

- `npm run build` muvaffaqiyatli
- 6 ta tab dock to'g'ri ishlaydi
- Map lazy yuklanadi va marker↔card sync
- Auth flow uchidan-uchiga ishlaydi
- Booking flow Apple-like
- Beige + black hech qanday neon/cheap rang yo'q
- Mobile (375px) + tablet + desktop responsive
- Reduced-motion ishlaydi

## Texnik xulosa (developer notes)

- TanStack Start file routing, `_app` layout dock uchun
- Mock data → `src/lib/api/` async funksiyalar (TanStack Query bilan keyin real API'ga oson o'tish)
- Google Maps key: `VITE_GOOGLE_MAPS_API_KEY` sifatida — referrer-restricted publishable key (frontend ishlatishi xavfsiz)
- Zustand stores localStorage persist middleware bilan

## Ochiq risklar

1. **Real OTP yuborish yo'q** — mock OTP. Real SMS uchun keyin Lovable Cloud + Twilio kerak.
2. **Google Maps key kerak** — siz bering yoki men so'rayman.
3. **Real-time chat yo'q** — mock thread. Real chat uchun backend kerak.
4. **Geolocation HTTPS talab qiladi** — preview va prod'da ishlaydi, lokalda emas.
5. **Booking konfliktlari yo'q** — mock data, har doim "free" deb ko'rsatiladi.

Plan tasdiqlanganidan keyin Google Maps API key so'rayman va boshlaymiz.