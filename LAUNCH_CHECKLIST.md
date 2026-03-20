# 🔧 Unconnected Features & Launch Checklist
### Hofherr Meat Co. — March 2026

---

## 🔴 Not Hooked Up (Won't Work in Production)

| # | Feature | What's Missing | Files / Env Vars Needed |
|---|---------|---------------|------------------------|
| 1 | **Stripe Payments** | Test placeholder keys in `.env.local` (`pk_test_...`, `sk_test_...`) | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY` |
| 2 | **Stripe Webhook** | No `STRIPE_WEBHOOK_SECRET` set — order confirmation after payment won't fire | `STRIPE_WEBHOOK_SECRET` |
| 3 | **Google OAuth** | `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` are empty | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| 4 | **Apple OAuth** | `AUTH_APPLE_ID` and `AUTH_APPLE_SECRET` are empty | [Apple Developer](https://developer.apple.com/account) |
| 5 | **Facebook OAuth** | `AUTH_FACEBOOK_ID` and `AUTH_FACEBOOK_SECRET` are empty | [Meta for Developers](https://developers.facebook.com) |
| 6 | **Microsoft OAuth** | Button wired to `signIn('azure-ad')` but no Azure AD provider configured in `auth.ts` | Needs both provider + env vars |
| 7 | **Google Analytics** | Component exists but `NEXT_PUBLIC_GA_MEASUREMENT_ID` not in `.env.local` | `NEXT_PUBLIC_GA_MEASUREMENT_ID` |
| 8 | **Email (SMTP)** | No `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` set — password reset emails won't send, just logs to console | `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_PORT` |
| 9 | **Twilio SMS** | No Twilio credentials — SMS signup, chat widget texts, and order SMS notifications all stub/log only | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` |
| 10 | **Newsletter API** | No `/api/newsletter` route exists — newsletter forms on the homepage and `/newsletter` page don't submit anywhere | Need API route + email service (Mailchimp, SendGrid, etc.) |

---

## 🟡 Partially Working / Needs Attention

| # | Feature | Status | Action Needed |
|---|---------|--------|--------------|
| 11 | **Restock Notifications** | Email sending has TODO comment — logs to console | Connect to email service (line 111 of `stock-check/route.ts`) |
| 12 | **Catering Quote Form** | UI exists in `QuotesSection.tsx` | Verify form submits to a real endpoint |
| 13 | **Chat Widget** | Works but texts go nowhere without Twilio | Connect Twilio or switch to email-based |
| 14 | **SMS Signup** | Returns simulated success without Twilio | Connect Twilio credentials |
| 15 | **Team Photos** | Falls back to `/team/placeholder.jpg` if Sanity has no photo | Upload real team photos to Sanity |
| 16 | **Gallery Strip** | Comment says *"Placeholder tiles — swap with real photos"* | Replace with actual shop photos |

---

## 🟢 Needs Before Go-Live (Config/SEO)

| # | Item | Status | Action |
|---|------|--------|--------|
| 17 | **Production URLs** | `NEXTAUTH_URL` and `AUTH_URL` point to `localhost:3000` | Change to `https://hofherrmeatco.com` |
| 18 | **`NEXT_PUBLIC_SITE_URL`** | Not set — reset links may use localhost | Add to `.env.local` |
| 19 | **`NEXT_PUBLIC_BASE_URL`** | Used in checkout CSRF check — needs production domain | Add to `.env.local` |
| 20 | **Sitemap** | Exists at `/sitemap.ts` — references `hofherrmeatco.com` | ✅ Ready — verify after deploy |
| 21 | **Robots.txt** | Exists at `/robots.ts` | ✅ Ready |
| 22 | **Admin passwords** | ✅ Now in env vars (just fixed) | Change from defaults before launch |

---

## 📋 Env Vars You Need to Add to `.env.local`

```bash
# ── Stripe (REQUIRED for payments) ──
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxx
STRIPE_SECRET_KEY=sk_live_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx

# ── Google Analytics ──
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# ── Email (SMTP) for password resets ──
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your@email.com
SMTP_PASS=app-specific-password

# ── Twilio (for SMS features) ──
TWILIO_ACCOUNT_SID=ACxxxx
TWILIO_AUTH_TOKEN=xxxx
TWILIO_FROM_NUMBER=+1xxxxxxxxxx

# ── OAuth Providers ──
AUTH_GOOGLE_ID=xxxx.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=xxxx

AUTH_APPLE_ID=com.hofherr.auth
AUTH_APPLE_SECRET=xxxx

AUTH_FACEBOOK_ID=xxxx
AUTH_FACEBOOK_SECRET=xxxx

# ── Production URLs ──
NEXTAUTH_URL=https://hofherrmeatco.com
AUTH_URL=https://hofherrmeatco.com
NEXT_PUBLIC_SITE_URL=https://hofherrmeatco.com
NEXT_PUBLIC_BASE_URL=https://hofherrmeatco.com
```

---

## Priority Order for Connecting

1. **Stripe** — Can't take payments without it
2. **SMTP Email** — Password resets don't work without it  
3. **Google Analytics** — You want tracking from day one
4. **Production URLs** — Critical for auth redirects
5. **OAuth Providers** — Nice-to-have, credentials login works fine
6. **Twilio** — Nice-to-have, site works without SMS
7. **Newsletter** — Need to pick a provider (Mailchimp, etc.)
