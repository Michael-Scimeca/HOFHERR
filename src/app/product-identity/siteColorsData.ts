export type SiteColorFamily = "reds" | "golds" | "greens" | "blues" | "purples" | "browns" | "neutrals";

export interface SiteColorEntry {
  hex: string;
  count: number;
  family: SiteColorFamily;
  token?: string;
  files: string;
  routes: string[];
}

export const ALL_SITE_COLORS: SiteColorEntry[] = [
  {
    "hex": "#FFFFFF",
    "count": 648,
    "family": "neutrals",
    "token": "--border / --border-soft",
    "files": "admin/admin.module.css, admin/inventory/inventory.module.css, admin/login/login.module.css (+89)",
    "routes": [
      "/admin",
      "/admin/inventory",
      "/admin/login"
    ]
  },
  {
    "hex": "#8B0A10",
    "count": 127,
    "family": "reds",
    "files": "admin/social/page.tsx, admin/social/social.module.css, bbq/page.module.css (+24)",
    "routes": [
      "/admin/social",
      "/bbq",
      "/checkout"
    ]
  },
  {
    "hex": "#CC0E1D",
    "count": 121,
    "family": "reds",
    "token": "--red / --accent",
    "files": "admin/AdminDashboardClient.tsx, admin/admin.module.css, admin/social/social.module.css (+35)",
    "routes": [
      "/admin",
      "/admin/social",
      "/catering"
    ]
  },
  {
    "hex": "#16A34A",
    "count": 100,
    "family": "greens",
    "token": "--green-ready",
    "files": "admin/admin.module.css, admin/inventory/inventory.module.css, api/catering/preview/route.ts (+30)",
    "routes": [
      "/admin",
      "/admin/inventory",
      "/catering"
    ]
  },
  {
    "hex": "#000000",
    "count": 99,
    "family": "neutrals",
    "token": "--dark",
    "files": "api/email/template.ts, bbq/BBQHub.tsx, bbq/page.module.css (+39)",
    "routes": [
      "/debug-email/preview",
      "/bbq",
      "/catering"
    ]
  },
  {
    "hex": "#F59B1A",
    "count": 91,
    "family": "golds",
    "files": "admin/social/page.tsx, admin/social/social.module.css, bbq/page.module.css (+22)",
    "routes": [
      "/admin/social",
      "/bbq",
      "/gift-cards"
    ]
  },
  {
    "hex": "#F3EAD8",
    "count": 87,
    "family": "golds",
    "files": "admin/admin.module.css, admin/login/login.module.css, admin/social/page.tsx (+26)",
    "routes": [
      "/admin",
      "/admin/login",
      "/admin/social"
    ]
  },
  {
    "hex": "#800020",
    "count": 86,
    "family": "reds",
    "files": "(legal)/legal.module.css, admin/admin.module.css, api/auth/forgot-password/route.ts (+16)",
    "routes": [
      "/privacy",
      "/admin",
      "/"
    ]
  },
  {
    "hex": "#111111",
    "count": 62,
    "family": "neutrals",
    "files": "admin/admin.module.css, api/catering/preview/route.ts, api/catering/route.ts (+18)",
    "routes": [
      "/admin",
      "/catering",
      "/debug-email/preview"
    ]
  },
  {
    "hex": "#1C1614",
    "count": 55,
    "family": "reds",
    "files": "admin/social/page.tsx, admin/social/social.module.css, api/social/image/route.ts (+17)",
    "routes": [
      "/admin/social",
      "/",
      "/product-identity"
    ]
  },
  {
    "hex": "#888888",
    "count": 52,
    "family": "neutrals",
    "token": "--fg-muted",
    "files": "admin/AdminDashboardClient.tsx, admin/admin.module.css, admin/login/login.module.css (+14)",
    "routes": [
      "/admin",
      "/admin/login",
      "/catering"
    ]
  },
  {
    "hex": "#666666",
    "count": 41,
    "family": "neutrals",
    "token": "--text-muted",
    "files": "admin/admin.module.css, api/auth/forgot-password/route.ts, api/catering/preview/route.ts (+17)",
    "routes": [
      "/admin",
      "/",
      "/catering"
    ]
  },
  {
    "hex": "#A8905F",
    "count": 34,
    "family": "golds",
    "token": "--gold / --accent-2",
    "files": "admin/AdminDashboardClient.tsx, admin/admin.module.css, admin/login/login.module.css (+12)",
    "routes": [
      "/admin",
      "/admin/login",
      "/catering"
    ]
  },
  {
    "hex": "#F2F2F2",
    "count": 34,
    "family": "neutrals",
    "token": "--light / --text / --cream / --fg",
    "files": "admin/login/login.module.css, api/email/template.ts, debug-email/preview/page.tsx (+10)",
    "routes": [
      "/admin/login",
      "/debug-email/preview",
      "/design-system"
    ]
  },
  {
    "hex": "#1A1A1A",
    "count": 32,
    "family": "neutrals",
    "files": "admin/admin.module.css, api/catering/preview/route.ts, checkout/checkout.module.css (+11)",
    "routes": [
      "/admin",
      "/catering",
      "/checkout"
    ]
  },
  {
    "hex": "#C5A255",
    "count": 31,
    "family": "golds",
    "files": "catering/page.module.css, debug-email/preview/page.tsx, online-orders/page.module.css (+5)",
    "routes": [
      "/catering",
      "/debug-email/preview",
      "/online-orders"
    ]
  },
  {
    "hex": "#0A0A0A",
    "count": 29,
    "family": "neutrals",
    "files": "(legal)/legal.module.css, admin/admin.module.css, admin/login/login.module.css (+10)",
    "routes": [
      "/privacy",
      "/admin",
      "/admin/login"
    ]
  },
  {
    "hex": "#2A2A2A",
    "count": 29,
    "family": "neutrals",
    "files": "admin/admin.module.css, bbq/AccordionServices.module.css, dashboard/dashboard.module.css (+4)",
    "routes": [
      "/admin",
      "/bbq",
      "/dashboard"
    ]
  },
  {
    "hex": "#999999",
    "count": 29,
    "family": "neutrals",
    "token": "--text-3 / --fg-3",
    "files": "admin/admin.module.css, api/catering/preview/route.ts, api/catering/route.ts (+11)",
    "routes": [
      "/admin",
      "/catering",
      "/"
    ]
  },
  {
    "hex": "#333333",
    "count": 27,
    "family": "neutrals",
    "files": "admin/admin.module.css, api/catering/preview/route.ts, api/catering/route.ts (+8)",
    "routes": [
      "/admin",
      "/catering",
      "/debug-email/preview"
    ]
  },
  {
    "hex": "#6B070B",
    "count": 26,
    "family": "reds",
    "files": "admin/admin.module.css, api/butcher-cut-piece/route.ts, dashboard/dashboard.module.css (+4)",
    "routes": [
      "/admin",
      "/",
      "/dashboard"
    ]
  },
  {
    "hex": "#A3A3A3",
    "count": 25,
    "family": "neutrals",
    "files": "admin/AdminDashboardClient.tsx, admin/admin.module.css, recipes-test/page.module.css",
    "routes": [
      "/admin",
      "/recipes-test"
    ]
  },
  {
    "hex": "#F8FAFC",
    "count": 25,
    "family": "blues",
    "files": "admin/inventory/inventory.module.css, dashboard/dashboard.module.css, shared/Pagination.tsx",
    "routes": [
      "/admin/inventory",
      "/dashboard",
      "/"
    ]
  },
  {
    "hex": "#1E1E1E",
    "count": 24,
    "family": "neutrals",
    "files": "admin/admin.module.css, bbq/AccordionServices.module.css, checkout/checkout.module.css (+2)",
    "routes": [
      "/admin",
      "/bbq",
      "/checkout"
    ]
  },
  {
    "hex": "#555555",
    "count": 24,
    "family": "neutrals",
    "files": "api/catering/preview/route.ts, api/email/template.ts, checkout/checkout.module.css (+4)",
    "routes": [
      "/catering",
      "/debug-email/preview",
      "/checkout"
    ]
  },
  {
    "hex": "#94A3B8",
    "count": 24,
    "family": "blues",
    "files": "admin/inventory/inventory.module.css, shared/Pagination.tsx",
    "routes": [
      "/admin/inventory",
      "/"
    ]
  },
  {
    "hex": "#334155",
    "count": 23,
    "family": "blues",
    "files": "admin/inventory/inventory.module.css, specials/page.module.css, specials/page.tsx (+2)",
    "routes": [
      "/admin/inventory",
      "/specials",
      "/"
    ]
  },
  {
    "hex": "#64748B",
    "count": 23,
    "family": "blues",
    "files": "admin/inventory/inventory.module.css",
    "routes": [
      "/admin/inventory"
    ]
  },
  {
    "hex": "#222222",
    "count": 22,
    "family": "neutrals",
    "files": "admin/AdminDashboardClient.tsx, admin/admin.module.css, checkout/checkout.module.css (+5)",
    "routes": [
      "/admin",
      "/checkout",
      "/dashboard"
    ]
  },
  {
    "hex": "#142A1E",
    "count": 21,
    "family": "greens",
    "token": "--green-depot / --green-depot-surface",
    "files": "admin/admin.module.css, dashboard/dashboard.module.css, globals.css (+7)",
    "routes": [
      "/admin",
      "/dashboard",
      "/"
    ]
  },
  {
    "hex": "#F0ECE4",
    "count": 21,
    "family": "browns",
    "files": "checkout/checkout.module.css, online-orders/page.module.css",
    "routes": [
      "/checkout",
      "/online-orders"
    ]
  },
  {
    "hex": "#3A312D",
    "count": 20,
    "family": "browns",
    "files": "admin/social/social.module.css",
    "routes": [
      "/admin/social"
    ]
  },
  {
    "hex": "#FBBF24",
    "count": 19,
    "family": "golds",
    "files": "admin/admin.module.css, admin/inventory/inventory.module.css, dashboard/dashboard.module.css (+1)",
    "routes": [
      "/admin",
      "/admin/inventory",
      "/dashboard"
    ]
  },
  {
    "hex": "#C8A47E",
    "count": 18,
    "family": "golds",
    "files": "admin/login/login.module.css, bbq/page.module.css, gift-cards/page.module.css (+11)",
    "routes": [
      "/admin/login",
      "/bbq",
      "/gift-cards"
    ]
  },
  {
    "hex": "#CDBFA8",
    "count": 18,
    "family": "browns",
    "files": "admin/social/social.module.css, product-identity/social/SocialKit.tsx, lib/social/render.tsx",
    "routes": [
      "/admin/social",
      "/product-identity/social",
      "/"
    ]
  },
  {
    "hex": "#EF4444",
    "count": 17,
    "family": "reds",
    "files": "admin/AdminDashboardClient.tsx, admin/inventory/inventory.module.css, checkout/checkout.module.css (+4)",
    "routes": [
      "/admin",
      "/admin/inventory",
      "/checkout"
    ]
  },
  {
    "hex": "#FAF0E6",
    "count": 17,
    "family": "golds",
    "files": "admin/admin.module.css, api/butcher-cut-piece/route.ts, dashboard/dashboard.module.css (+3)",
    "routes": [
      "/admin",
      "/",
      "/dashboard"
    ]
  },
  {
    "hex": "#F7941D",
    "count": 16,
    "family": "golds",
    "files": "admin/admin.module.css, api/butcher-cut-piece/route.ts, dashboard/dashboard.module.css (+2)",
    "routes": [
      "/admin",
      "/",
      "/dashboard"
    ]
  },
  {
    "hex": "#D4845A",
    "count": 16,
    "family": "golds",
    "files": "specials/page.module.css, CateringCalendar.module.css, Navbar.module.css",
    "routes": [
      "/specials",
      "/catering",
      "/"
    ]
  },
  {
    "hex": "#C4AE82",
    "count": 16,
    "family": "golds",
    "token": "--gold-light",
    "files": "admin/inventory/inventory.module.css, admin/login/login.module.css, design-system/page.tsx (+7)",
    "routes": [
      "/admin/inventory",
      "/admin/login",
      "/design-system"
    ]
  },
  {
    "hex": "#D4BC8B",
    "count": 16,
    "family": "golds",
    "files": "admin/admin.module.css",
    "routes": [
      "/admin"
    ]
  },
  {
    "hex": "#0D0D0D",
    "count": 15,
    "family": "neutrals",
    "files": "admin/admin.module.css, bbq/CateringCalculator.module.css, bbq/page.module.css (+5)",
    "routes": [
      "/admin",
      "/bbq",
      "/checkout"
    ]
  },
  {
    "hex": "#1E3A5F",
    "count": 15,
    "family": "blues",
    "token": "--depot-blue-bg",
    "files": "admin/admin.module.css, checkout/checkout.module.css, dashboard/dashboard.module.css (+8)",
    "routes": [
      "/admin",
      "/checkout",
      "/dashboard"
    ]
  },
  {
    "hex": "#2563EB",
    "count": 15,
    "family": "blues",
    "token": "--depot-blue-border",
    "files": "admin/admin.module.css, checkout/checkout.module.css, cut-guide/CutGuideClient.tsx (+11)",
    "routes": [
      "/admin",
      "/checkout",
      "/cut-guide"
    ]
  },
  {
    "hex": "#F87171",
    "count": 15,
    "family": "reds",
    "files": "admin/admin.module.css, admin/inventory/inventory.module.css, checkout/checkout.module.css (+1)",
    "routes": [
      "/admin",
      "/admin/inventory",
      "/checkout"
    ]
  },
  {
    "hex": "#CCCCCC",
    "count": 15,
    "family": "neutrals",
    "token": "--text-2 / --fg-2",
    "files": "admin/social/page.tsx, api/email/template.ts, design-system/page.tsx (+9)",
    "routes": [
      "/admin/social",
      "/debug-email/preview",
      "/design-system"
    ]
  },
  {
    "hex": "#18120E",
    "count": 14,
    "family": "browns",
    "files": "gift-cards/page.module.css, order/success/page.module.css, selections/page.module.css (+1)",
    "routes": [
      "/gift-cards",
      "/order/success",
      "/selections"
    ]
  },
  {
    "hex": "#E85222",
    "count": 14,
    "family": "reds",
    "files": "bbq/page.module.css, our-story/page.module.css, product-identity/ProductIdentityClient.tsx (+2)",
    "routes": [
      "/bbq",
      "/our-story",
      "/product-identity"
    ]
  },
  {
    "hex": "#FF5014",
    "count": 14,
    "family": "reds",
    "files": "AddToOrderAnimStudio.module.css, AddToOrderAnimStudio.tsx, context/CartContext.tsx (+1)",
    "routes": [
      "/online-orders",
      "/"
    ]
  },
  {
    "hex": "#E5E5E5",
    "count": 14,
    "family": "neutrals",
    "files": "admin/admin.module.css, dashboard/dashboard.module.css, globals.css",
    "routes": [
      "/admin",
      "/dashboard",
      "/"
    ]
  },
  {
    "hex": "#444444",
    "count": 13,
    "family": "neutrals",
    "files": "admin/admin.module.css, admin/social/page.tsx, cut-guide/CutGuideClient.tsx (+8)",
    "routes": [
      "/admin",
      "/admin/social",
      "/cut-guide"
    ]
  },
  {
    "hex": "#10B981",
    "count": 12,
    "family": "greens",
    "files": "admin/AdminDashboardClient.tsx, admin/admin.module.css, dashboard/dashboard.module.css",
    "routes": [
      "/admin",
      "/dashboard"
    ]
  },
  {
    "hex": "#3B82F6",
    "count": 12,
    "family": "blues",
    "token": "--depot-blue-light",
    "files": "admin/inventory/inventory.module.css, checkout/checkout.module.css, globals.css (+4)",
    "routes": [
      "/admin/inventory",
      "/checkout",
      "/"
    ]
  },
  {
    "hex": "#60A5FA",
    "count": 12,
    "family": "blues",
    "files": "admin/inventory/inventory.module.css, dashboard/dashboard.module.css, inventory/inventory.module.css (+1)",
    "routes": [
      "/admin/inventory",
      "/dashboard",
      "/inventory"
    ]
  },
  {
    "hex": "#22C55E",
    "count": 11,
    "family": "greens",
    "files": "admin/admin.module.css, checkout/checkout.module.css, dashboard/dashboard.module.css (+3)",
    "routes": [
      "/admin",
      "/checkout",
      "/dashboard"
    ]
  },
  {
    "hex": "#9A8F86",
    "count": 11,
    "family": "neutrals",
    "files": "admin/social/social.module.css, lib/social/notify.ts",
    "routes": [
      "/admin/social",
      "/"
    ]
  },
  {
    "hex": "#FFD27D",
    "count": 11,
    "family": "golds",
    "files": "AddToOrderAnimStudio.tsx, dashboard/CutCollector.module.css, context/CartContext.tsx",
    "routes": [
      "/online-orders",
      "/dashboard",
      "/"
    ]
  },
  {
    "hex": "#120E0D",
    "count": 10,
    "family": "reds",
    "files": "inventory/inventory.module.css, product-identity/AppBrandIdentitySection.module.css, selections/page.module.css",
    "routes": [
      "/inventory",
      "/product-identity",
      "/selections"
    ]
  },
  {
    "hex": "#D4A853",
    "count": 10,
    "family": "golds",
    "files": "checkout/checkout.module.css, online-orders/page.module.css",
    "routes": [
      "/checkout",
      "/online-orders"
    ]
  },
  {
    "hex": "#E2E8F0",
    "count": 10,
    "family": "blues",
    "files": "admin/inventory/inventory.module.css, dashboard/dashboard.module.css, featured/FeaturedUserOrder.tsx (+1)",
    "routes": [
      "/admin/inventory",
      "/dashboard",
      "/featured"
    ]
  },
  {
    "hex": "#FDE68A",
    "count": 9,
    "family": "golds",
    "files": "admin/admin.module.css, admin/inventory/inventory.module.css, inventory/inventory.module.css",
    "routes": [
      "/admin",
      "/admin/inventory",
      "/inventory"
    ]
  },
  {
    "hex": "#0B0B0B",
    "count": 8,
    "family": "neutrals",
    "files": "admin/admin.module.css, map-test/MapTestClient.tsx, FooterMap.module.css (+2)",
    "routes": [
      "/admin",
      "/map-test",
      "/visit"
    ]
  },
  {
    "hex": "#1E293B",
    "count": 8,
    "family": "blues",
    "files": "admin/inventory/inventory.module.css",
    "routes": [
      "/admin/inventory"
    ]
  },
  {
    "hex": "#D97706",
    "count": 8,
    "family": "golds",
    "files": "admin/AdminDashboardClient.tsx, admin/admin.module.css, cut-guide/CutGuideClient.tsx (+4)",
    "routes": [
      "/admin",
      "/cut-guide",
      "/dashboard"
    ]
  },
  {
    "hex": "#AAAAAA",
    "count": 8,
    "family": "neutrals",
    "files": "admin/AdminDashboardClient.tsx, dashboard/dashboard.module.css, online-orders/OnlineOrdersClient.tsx (+4)",
    "routes": [
      "/admin",
      "/dashboard",
      "/online-orders"
    ]
  },
  {
    "hex": "#6EE7B7",
    "count": 8,
    "family": "greens",
    "files": "admin/admin.module.css, dashboard/dashboard.module.css",
    "routes": [
      "/admin",
      "/dashboard"
    ]
  },
  {
    "hex": "#93C5FD",
    "count": 8,
    "family": "blues",
    "token": "--depot-blue-text",
    "files": "admin/admin.module.css, globals.css, inventory/inventory.module.css (+1)",
    "routes": [
      "/admin",
      "/",
      "/inventory"
    ]
  },
  {
    "hex": "#D4D4D4",
    "count": 8,
    "family": "neutrals",
    "files": "admin/admin.module.css, dashboard/dashboard.module.css",
    "routes": [
      "/admin",
      "/dashboard"
    ]
  },
  {
    "hex": "#0D0A09",
    "count": 7,
    "family": "reds",
    "files": "bbq/page.module.css, our-story/page.module.css, product-identity/WebsiteIdentitySection.module.css (+3)",
    "routes": [
      "/bbq",
      "/our-story",
      "/product-identity"
    ]
  },
  {
    "hex": "#141210",
    "count": 7,
    "family": "browns",
    "files": "dashboard/dashboard.module.css, inventory/inventory.module.css, login/login.module.css (+2)",
    "routes": [
      "/dashboard",
      "/inventory",
      "/login"
    ]
  },
  {
    "hex": "#475569",
    "count": 7,
    "family": "blues",
    "files": "admin/inventory/inventory.module.css, specials/page.module.css, specials/page.tsx (+2)",
    "routes": [
      "/admin/inventory",
      "/specials",
      "/"
    ]
  },
  {
    "hex": "#F59E0B",
    "count": 7,
    "family": "golds",
    "files": "admin/AdminDashboardClient.tsx, admin/inventory/inventory.module.css, bbq/BBQHub.tsx (+2)",
    "routes": [
      "/admin",
      "/admin/inventory",
      "/bbq"
    ]
  },
  {
    "hex": "#D4AF37",
    "count": 7,
    "family": "golds",
    "files": "admin/admin.module.css, dashboard/dashboard.module.css",
    "routes": [
      "/admin",
      "/dashboard"
    ]
  },
  {
    "hex": "#FACC15",
    "count": 7,
    "family": "golds",
    "files": "admin/inventory/inventory.module.css",
    "routes": [
      "/admin/inventory"
    ]
  },
  {
    "hex": "#FF6B78",
    "count": 7,
    "family": "reds",
    "files": "admin/admin.module.css, dashboard/dashboard.module.css",
    "routes": [
      "/admin",
      "/dashboard"
    ]
  },
  {
    "hex": "#D6C7B8",
    "count": 7,
    "family": "browns",
    "files": "admin/admin.module.css, dashboard/dashboard.module.css, dashboard/CutCollector.module.css (+1)",
    "routes": [
      "/admin",
      "/dashboard",
      "/debug-email/preview"
    ]
  },
  {
    "hex": "#FCA5A5",
    "count": 7,
    "family": "reds",
    "files": "dashboard/dashboard.module.css, inventory/inventory.module.css",
    "routes": [
      "/dashboard",
      "/inventory"
    ]
  },
  {
    "hex": "#100C0B",
    "count": 6,
    "family": "reds",
    "files": "admin/social/social.module.css",
    "routes": [
      "/admin/social"
    ]
  },
  {
    "hex": "#141414",
    "count": 6,
    "family": "neutrals",
    "files": "admin/admin.module.css, dashboard/dashboard.module.css, NewsletterInline.module.css",
    "routes": [
      "/admin",
      "/dashboard",
      "/"
    ]
  },
  {
    "hex": "#241C19",
    "count": 6,
    "family": "browns",
    "files": "bbq/page.module.css, our-story/page.module.css, online-orders/HelpOrdering.module.css",
    "routes": [
      "/bbq",
      "/our-story",
      "/"
    ]
  },
  {
    "hex": "#262626",
    "count": 6,
    "family": "neutrals",
    "files": "admin/admin.module.css, dashboard/dashboard.module.css, inventory/inventory.module.css",
    "routes": [
      "/admin",
      "/dashboard",
      "/inventory"
    ]
  },
  {
    "hex": "#5C0018",
    "count": 6,
    "family": "purples",
    "files": "debug-email/preview/page.tsx, lib/email-templates.ts",
    "routes": [
      "/debug-email/preview"
    ]
  },
  {
    "hex": "#8B5E3C",
    "count": 6,
    "family": "golds",
    "files": "online-orders/page.module.css",
    "routes": [
      "/online-orders"
    ]
  },
  {
    "hex": "#C7843A",
    "count": 6,
    "family": "golds",
    "files": "catering/page.module.css, home/AwardsSection.module.css, home/CateringCTA.module.css (+1)",
    "routes": [
      "/catering",
      "/"
    ]
  },
  {
    "hex": "#E01E2E",
    "count": 6,
    "family": "reds",
    "token": "--red-light",
    "files": "design-system/page.tsx, fire-test/FireTestClient.tsx, globals.css (+2)",
    "routes": [
      "/design-system",
      "/fire-test",
      "/"
    ]
  },
  {
    "hex": "#E0242B",
    "count": 6,
    "family": "reds",
    "files": "product-identity/MasterVectorLibrary.tsx, product-identity/ProductIdentityClient.tsx, product-identity/WrappingPaperColorways.tsx",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#34D399",
    "count": 6,
    "family": "greens",
    "files": "admin/admin.module.css, dashboard/dashboard.module.css",
    "routes": [
      "/admin",
      "/dashboard"
    ]
  },
  {
    "hex": "#FF3B4E",
    "count": 6,
    "family": "reds",
    "files": "admin/admin.module.css, dashboard/dashboard.module.css",
    "routes": [
      "/admin",
      "/dashboard"
    ]
  },
  {
    "hex": "#DCDCDC",
    "count": 6,
    "family": "neutrals",
    "files": "recipes-test/page.module.css",
    "routes": [
      "/recipes-test"
    ]
  },
  {
    "hex": "#F4EBD9",
    "count": 6,
    "family": "golds",
    "files": "dashboard/CutCollector.module.css, home/Process.module.css",
    "routes": [
      "/dashboard",
      "/"
    ]
  },
  {
    "hex": "#0C0C0C",
    "count": 5,
    "family": "neutrals",
    "files": "admin/admin.module.css, bbq/page.module.css, notifications/page.module.css",
    "routes": [
      "/admin",
      "/bbq",
      "/notifications"
    ]
  },
  {
    "hex": "#0F0F10",
    "count": 5,
    "family": "neutrals",
    "files": "recipes-test/page.module.css",
    "routes": [
      "/recipes-test"
    ]
  },
  {
    "hex": "#1A1210",
    "count": 5,
    "family": "reds",
    "files": "online-orders/page.module.css",
    "routes": [
      "/online-orders"
    ]
  },
  {
    "hex": "#0F172A",
    "count": 5,
    "family": "blues",
    "files": "admin/inventory/inventory.module.css, inventory/inventory.module.css",
    "routes": [
      "/admin/inventory",
      "/inventory"
    ]
  },
  {
    "hex": "#1F1F1F",
    "count": 5,
    "family": "neutrals",
    "files": "admin/admin.module.css",
    "routes": [
      "/admin"
    ]
  },
  {
    "hex": "#3B0508",
    "count": 5,
    "family": "reds",
    "files": "product-identity/MasterVectorLibrary.tsx, product-identity/ProductIdentityClient.tsx, product-identity/WrappingPaperColorways.tsx",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#27272A",
    "count": 5,
    "family": "neutrals",
    "files": "design-system/responsive.module.css, product-identity/ChicagoLockupsSection.module.css",
    "routes": [
      "/design-system",
      "/product-identity"
    ]
  },
  {
    "hex": "#234775",
    "count": 5,
    "family": "blues",
    "files": "checkout/checkout.module.css, visit/page.module.css, FooterMap.module.css",
    "routes": [
      "/checkout",
      "/visit"
    ]
  },
  {
    "hex": "#34A853",
    "count": 5,
    "family": "greens",
    "files": "checkout/CheckoutClient.tsx, online-orders/OnlineOrdersClient.tsx, AuthModal.tsx",
    "routes": [
      "/checkout",
      "/online-orders",
      "/"
    ]
  },
  {
    "hex": "#B53D2E",
    "count": 5,
    "family": "reds",
    "files": "online-orders/page.module.css, ChatWidget.module.css, Footer.module.css",
    "routes": [
      "/online-orders",
      "/"
    ]
  },
  {
    "hex": "#3FB950",
    "count": 5,
    "family": "greens",
    "files": "admin/social/social.module.css, product-identity/social/social.module.css",
    "routes": [
      "/admin/social",
      "/product-identity/social"
    ]
  },
  {
    "hex": "#FBBC05",
    "count": 5,
    "family": "golds",
    "files": "checkout/CheckoutClient.tsx, online-orders/OnlineOrdersClient.tsx, AuthModal.tsx",
    "routes": [
      "/checkout",
      "/online-orders",
      "/"
    ]
  },
  {
    "hex": "#FF4500",
    "count": 5,
    "family": "golds",
    "files": "fire-test/FireTestClient.tsx, product-identity/WrappingPaperColorways.tsx, EmberFlare.tsx (+1)",
    "routes": [
      "/fire-test",
      "/product-identity",
      "/"
    ]
  },
  {
    "hex": "#D49B2A",
    "count": 5,
    "family": "golds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#EA4335",
    "count": 5,
    "family": "reds",
    "files": "checkout/CheckoutClient.tsx, online-orders/OnlineOrdersClient.tsx, AuthModal.tsx",
    "routes": [
      "/checkout",
      "/online-orders",
      "/"
    ]
  },
  {
    "hex": "#E74C3C",
    "count": 5,
    "family": "reds",
    "files": "online-orders/page.module.css, CateringCalendar.module.css",
    "routes": [
      "/online-orders",
      "/catering"
    ]
  },
  {
    "hex": "#4285F4",
    "count": 5,
    "family": "blues",
    "files": "checkout/CheckoutClient.tsx, online-orders/OnlineOrdersClient.tsx, AuthModal.tsx",
    "routes": [
      "/checkout",
      "/online-orders",
      "/"
    ]
  },
  {
    "hex": "#86EFAC",
    "count": 5,
    "family": "greens",
    "files": "admin/admin.module.css, inventory/inventory.module.css",
    "routes": [
      "/admin",
      "/inventory"
    ]
  },
  {
    "hex": "#C9C9C9",
    "count": 5,
    "family": "neutrals",
    "files": "recipes-test/page.module.css",
    "routes": [
      "/recipes-test"
    ]
  },
  {
    "hex": "#120F0D",
    "count": 4,
    "family": "browns",
    "files": "dashboard/dashboard.module.css, login/login.module.css, register/register.module.css (+1)",
    "routes": [
      "/dashboard",
      "/login",
      "/register"
    ]
  },
  {
    "hex": "#121212",
    "count": 4,
    "family": "neutrals",
    "files": "admin/login/login.module.css, reset-password/page.module.css, lib/mapTheme.ts",
    "routes": [
      "/admin/login",
      "/reset-password",
      "/visit"
    ]
  },
  {
    "hex": "#140F10",
    "count": 4,
    "family": "reds",
    "files": "recipes-test/page.module.css",
    "routes": [
      "/recipes-test"
    ]
  },
  {
    "hex": "#181311",
    "count": 4,
    "family": "browns",
    "files": "bbq/page.module.css, our-story/page.module.css, selections/page.module.css (+1)",
    "routes": [
      "/bbq",
      "/our-story",
      "/selections"
    ]
  },
  {
    "hex": "#171717",
    "count": 4,
    "family": "neutrals",
    "files": "admin/admin.module.css",
    "routes": [
      "/admin"
    ]
  },
  {
    "hex": "#181818",
    "count": 4,
    "family": "neutrals",
    "files": "admin/admin.module.css, admin/login/login.module.css, dashboard/dashboard.module.css (+1)",
    "routes": [
      "/admin",
      "/admin/login",
      "/dashboard"
    ]
  },
  {
    "hex": "#0D1425",
    "count": 4,
    "family": "blues",
    "files": "admin/inventory/inventory.module.css",
    "routes": [
      "/admin/inventory"
    ]
  },
  {
    "hex": "#18181B",
    "count": 4,
    "family": "neutrals",
    "files": "design-system/responsive.module.css, dev-nav.module.css",
    "routes": [
      "/design-system",
      "/"
    ]
  },
  {
    "hex": "#282828",
    "count": 4,
    "family": "neutrals",
    "files": "admin/admin.module.css, checkout/checkout.module.css, online-orders/page.module.css",
    "routes": [
      "/admin",
      "/checkout",
      "/online-orders"
    ]
  },
  {
    "hex": "#2B2B2B",
    "count": 4,
    "family": "neutrals",
    "files": "admin/admin.module.css, dashboard/dashboard.module.css, online-orders/page.module.css",
    "routes": [
      "/admin",
      "/dashboard",
      "/online-orders"
    ]
  },
  {
    "hex": "#A00B17",
    "count": 4,
    "family": "reds",
    "token": "--red-dark",
    "files": "design-system/page.tsx, globals.css, product-identity/ExtendedIdentityBoards.tsx (+1)",
    "routes": [
      "/design-system",
      "/",
      "/product-identity"
    ]
  },
  {
    "hex": "#B8860B",
    "count": 4,
    "family": "golds",
    "files": "cut-guide/CutGuideClient.tsx, home/CutGuide.tsx",
    "routes": [
      "/cut-guide"
    ]
  },
  {
    "hex": "#B80F1A",
    "count": 4,
    "family": "reds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#8A7349",
    "count": 4,
    "family": "golds",
    "token": "--gold-dark",
    "files": "design-system/page.tsx, globals.css, product-identity/ExtendedIdentityBoards.tsx (+1)",
    "routes": [
      "/design-system",
      "/",
      "/product-identity"
    ]
  },
  {
    "hex": "#9E7348",
    "count": 4,
    "family": "golds",
    "files": "product-identity/page.module.css",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#DC2626",
    "count": 4,
    "family": "reds",
    "files": "admin/admin.module.css, admin/inventory/inventory.module.css, dashboard/dashboard.module.css (+1)",
    "routes": [
      "/admin",
      "/admin/inventory",
      "/dashboard"
    ]
  },
  {
    "hex": "#E8501A",
    "count": 4,
    "family": "reds",
    "files": "cut-guide/CutGuideClient.tsx, home/CutGuide.tsx",
    "routes": [
      "/cut-guide"
    ]
  },
  {
    "hex": "#1877F2",
    "count": 4,
    "family": "blues",
    "files": "online-orders/OnlineOrdersClient.tsx, online-orders/page.module.css, AuthModal.tsx",
    "routes": [
      "/online-orders",
      "/"
    ]
  },
  {
    "hex": "#C59B6D",
    "count": 4,
    "family": "golds",
    "files": "product-identity/page.module.css",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#9E9E9E",
    "count": 4,
    "family": "neutrals",
    "files": "admin/admin.module.css",
    "routes": [
      "/admin"
    ]
  },
  {
    "hex": "#FFD24C",
    "count": 4,
    "family": "golds",
    "files": "home/Process.module.css",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#7FD18F",
    "count": 4,
    "family": "greens",
    "files": "admin/social/social.module.css",
    "routes": [
      "/admin/social"
    ]
  },
  {
    "hex": "#7EE787",
    "count": 4,
    "family": "greens",
    "files": "admin/social/social.module.css, product-identity/social/social.module.css",
    "routes": [
      "/admin/social",
      "/product-identity/social"
    ]
  },
  {
    "hex": "#C8C0B4",
    "count": 4,
    "family": "browns",
    "files": "checkout/checkout.module.css",
    "routes": [
      "/checkout"
    ]
  },
  {
    "hex": "#FFD27F",
    "count": 4,
    "family": "golds",
    "files": "fire-test/FireTestClient.tsx, EmbersBackground.tsx",
    "routes": [
      "/fire-test",
      "/"
    ]
  },
  {
    "hex": "#DDDDDD",
    "count": 4,
    "family": "neutrals",
    "files": "debug-email/preview/page.tsx, lib/email-templates.ts",
    "routes": [
      "/debug-email/preview"
    ]
  },
  {
    "hex": "#F0F0F0",
    "count": 4,
    "family": "neutrals",
    "files": "dashboard/dashboard.module.css, debug-email/page.tsx, debug-email/preview/page.tsx",
    "routes": [
      "/dashboard",
      "/debug-email/preview"
    ]
  },
  {
    "hex": "#F5F5F4",
    "count": 4,
    "family": "neutrals",
    "files": "admin/admin.module.css",
    "routes": [
      "/admin"
    ]
  },
  {
    "hex": "#0E0C0A",
    "count": 3,
    "family": "browns",
    "files": "inventory/inventory.module.css, login/login.module.css, register/register.module.css",
    "routes": [
      "/inventory",
      "/login",
      "/register"
    ]
  },
  {
    "hex": "#14100D",
    "count": 3,
    "family": "browns",
    "files": "admin/admin.module.css, dashboard/dashboard.module.css, order/success/page.module.css",
    "routes": [
      "/admin",
      "/dashboard",
      "/order/success"
    ]
  },
  {
    "hex": "#0D0F11",
    "count": 3,
    "family": "blues",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#121110",
    "count": 3,
    "family": "neutrals",
    "files": "checkout/checkout.module.css",
    "routes": [
      "/checkout"
    ]
  },
  {
    "hex": "#121214",
    "count": 3,
    "family": "neutrals",
    "files": "design-system/responsive.module.css, product-identity/ChicagoLockupsSection.module.css",
    "routes": [
      "/design-system",
      "/product-identity"
    ]
  },
  {
    "hex": "#17130F",
    "count": 3,
    "family": "browns",
    "files": "inventory/inventory.module.css",
    "routes": [
      "/inventory"
    ]
  },
  {
    "hex": "#171210",
    "count": 3,
    "family": "browns",
    "files": "admin/social/social.module.css",
    "routes": [
      "/admin/social"
    ]
  },
  {
    "hex": "#161616",
    "count": 3,
    "family": "neutrals",
    "files": "admin/admin.module.css, reset-password/page.module.css",
    "routes": [
      "/admin",
      "/reset-password"
    ]
  },
  {
    "hex": "#1C1C1C",
    "count": 3,
    "family": "neutrals",
    "files": "admin/admin.module.css, checkout/checkout.module.css, online-orders/page.module.css",
    "routes": [
      "/admin",
      "/checkout",
      "/online-orders"
    ]
  },
  {
    "hex": "#131C31",
    "count": 3,
    "family": "blues",
    "files": "admin/inventory/inventory.module.css",
    "routes": [
      "/admin/inventory"
    ]
  },
  {
    "hex": "#383838",
    "count": 3,
    "family": "neutrals",
    "files": "admin/admin.module.css, api/email/template.ts, page.module.css",
    "routes": [
      "/admin",
      "/debug-email/preview",
      "/"
    ]
  },
  {
    "hex": "#8B0000",
    "count": 3,
    "family": "reds",
    "files": "admin/admin.module.css",
    "routes": [
      "/admin"
    ]
  },
  {
    "hex": "#7FBB00",
    "count": 3,
    "family": "greens",
    "files": "online-orders/OnlineOrdersClient.tsx, AuthModal.tsx",
    "routes": [
      "/online-orders",
      "/"
    ]
  },
  {
    "hex": "#B91C1C",
    "count": 3,
    "family": "reds",
    "files": "dashboard/dashboard.module.css, online-orders/page.module.css, specials/page.tsx",
    "routes": [
      "/dashboard",
      "/online-orders",
      "/specials"
    ]
  },
  {
    "hex": "#CC0D1D",
    "count": 3,
    "family": "reds",
    "files": "Navbar.module.css",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#C0392B",
    "count": 3,
    "family": "reds",
    "files": "api/restock-request/route.ts, cut-guide/CutGuideClient.tsx, home/CutGuide.tsx",
    "routes": [
      "/",
      "/cut-guide"
    ]
  },
  {
    "hex": "#777777",
    "count": 3,
    "family": "neutrals",
    "files": "admin/admin.module.css, home/HeroAssetEditor.tsx",
    "routes": [
      "/admin",
      "/"
    ]
  },
  {
    "hex": "#00A1F1",
    "count": 3,
    "family": "blues",
    "files": "online-orders/OnlineOrdersClient.tsx, AuthModal.tsx",
    "routes": [
      "/online-orders",
      "/"
    ]
  },
  {
    "hex": "#D98A16",
    "count": 3,
    "family": "golds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#4CAF50",
    "count": 3,
    "family": "greens",
    "files": "roadmap/page.module.css, showcase/page.module.css",
    "routes": [
      "/roadmap",
      "/showcase"
    ]
  },
  {
    "hex": "#FF8C00",
    "count": 3,
    "family": "golds",
    "files": "fire-test/FireTestClient.tsx, EmberFlare.tsx, EmbersBackground.tsx",
    "routes": [
      "/fire-test",
      "/"
    ]
  },
  {
    "hex": "#FFA500",
    "count": 3,
    "family": "golds",
    "files": "fire-test/FireTestClient.tsx, EmberFlare.tsx, EmbersBackground.tsx",
    "routes": [
      "/fire-test",
      "/"
    ]
  },
  {
    "hex": "#FF6600",
    "count": 3,
    "family": "golds",
    "files": "fire-test/FireTestClient.tsx, EmberFlare.tsx, EmbersBackground.tsx",
    "routes": [
      "/fire-test",
      "/"
    ]
  },
  {
    "hex": "#FFBB00",
    "count": 3,
    "family": "golds",
    "files": "online-orders/OnlineOrdersClient.tsx, AuthModal.tsx",
    "routes": [
      "/online-orders",
      "/"
    ]
  },
  {
    "hex": "#F39C12",
    "count": 3,
    "family": "golds",
    "files": "CateringCalendar.module.css",
    "routes": [
      "/catering"
    ]
  },
  {
    "hex": "#F25022",
    "count": 3,
    "family": "reds",
    "files": "online-orders/OnlineOrdersClient.tsx, AuthModal.tsx",
    "routes": [
      "/online-orders",
      "/"
    ]
  },
  {
    "hex": "#FF5B1F",
    "count": 3,
    "family": "golds",
    "files": "home/Process.module.css",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#7C3AED",
    "count": 3,
    "family": "purples",
    "files": "cut-guide/CutGuideClient.tsx, dashboard/dashboard.module.css, home/CutGuide.tsx",
    "routes": [
      "/cut-guide",
      "/dashboard"
    ]
  },
  {
    "hex": "#A49F90",
    "count": 3,
    "family": "neutrals",
    "files": "checkout/checkout.module.css, online-orders/page.module.css",
    "routes": [
      "/checkout",
      "/online-orders"
    ]
  },
  {
    "hex": "#F5B942",
    "count": 3,
    "family": "golds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#FFB347",
    "count": 3,
    "family": "golds",
    "files": "fire-test/FireTestClient.tsx, EmberFlare.tsx, EmbersBackground.tsx",
    "routes": [
      "/fire-test",
      "/"
    ]
  },
  {
    "hex": "#FCD34D",
    "count": 3,
    "family": "golds",
    "files": "admin/admin.module.css, dashboard/dashboard.module.css, dev-nav.module.css",
    "routes": [
      "/admin",
      "/dashboard",
      "/"
    ]
  },
  {
    "hex": "#B5B5B5",
    "count": 3,
    "family": "neutrals",
    "files": "admin/admin.module.css",
    "routes": [
      "/admin"
    ]
  },
  {
    "hex": "#FF7B86",
    "count": 3,
    "family": "reds",
    "files": "admin/admin.module.css",
    "routes": [
      "/admin"
    ]
  },
  {
    "hex": "#FFD67A",
    "count": 3,
    "family": "golds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#FF8A8A",
    "count": 3,
    "family": "reds",
    "files": "admin/social/social.module.css",
    "routes": [
      "/admin/social"
    ]
  },
  {
    "hex": "#F0C9A0",
    "count": 3,
    "family": "golds",
    "files": "admin/social/social.module.css, product-identity/social/SocialKit.tsx, lib/social/render.tsx",
    "routes": [
      "/admin/social",
      "/product-identity/social",
      "/"
    ]
  },
  {
    "hex": "#E0E0E0",
    "count": 3,
    "family": "neutrals",
    "files": "api/catering/preview/route.ts, api/catering/route.ts, online-orders/OnlineOrdersClient.tsx",
    "routes": [
      "/catering",
      "/online-orders"
    ]
  },
  {
    "hex": "#FFF5CC",
    "count": 3,
    "family": "golds",
    "files": "fire-test/FireTestClient.tsx, EmberFlare.tsx, EmbersBackground.tsx",
    "routes": [
      "/fire-test",
      "/"
    ]
  },
  {
    "hex": "#E8F5E9",
    "count": 3,
    "family": "greens",
    "files": "api/catering/preview/route.ts, api/catering/route.ts, online-orders/page.module.css",
    "routes": [
      "/catering",
      "/online-orders"
    ]
  },
  {
    "hex": "#F3F3F3",
    "count": 3,
    "family": "neutrals",
    "files": "api/catering/preview/route.ts, api/catering/route.ts, api/email/template.ts",
    "routes": [
      "/catering",
      "/debug-email/preview"
    ]
  },
  {
    "hex": "#09090B",
    "count": 2,
    "family": "neutrals",
    "files": "design-system/responsive.module.css",
    "routes": [
      "/design-system"
    ]
  },
  {
    "hex": "#0B0908",
    "count": 2,
    "family": "browns",
    "files": "AddToOrderAnimStudio.module.css",
    "routes": [
      "/online-orders"
    ]
  },
  {
    "hex": "#0A0908",
    "count": 2,
    "family": "browns",
    "files": "AddToOrderAnimStudio.module.css",
    "routes": [
      "/online-orders"
    ]
  },
  {
    "hex": "#1B0F05",
    "count": 2,
    "family": "golds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#1A0507",
    "count": 2,
    "family": "reds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#14100E",
    "count": 2,
    "family": "browns",
    "files": "dashboard/dashboard.module.css, selections/page.module.css",
    "routes": [
      "/dashboard",
      "/selections"
    ]
  },
  {
    "hex": "#1A1008",
    "count": 2,
    "family": "golds",
    "files": "fire-test/FireTestClient.tsx, EmbersBackground.tsx",
    "routes": [
      "/fire-test",
      "/"
    ]
  },
  {
    "hex": "#141110",
    "count": 2,
    "family": "reds",
    "files": "jobs/page.module.css, AddToOrderAnimStudio.module.css",
    "routes": [
      "/jobs",
      "/online-orders"
    ]
  },
  {
    "hex": "#1A0A0A",
    "count": 2,
    "family": "reds",
    "files": "notifications/page.module.css",
    "routes": [
      "/notifications"
    ]
  },
  {
    "hex": "#0D1B13",
    "count": 2,
    "family": "greens",
    "token": "--green-depot-dark",
    "files": "globals.css, product-identity/ExtendedIdentityBoards.tsx",
    "routes": [
      "/",
      "/product-identity"
    ]
  },
  {
    "hex": "#1B1111",
    "count": 2,
    "family": "reds",
    "files": "recipes-test/page.module.css",
    "routes": [
      "/recipes-test"
    ]
  },
  {
    "hex": "#1D1A18",
    "count": 2,
    "family": "neutrals",
    "files": "product-identity/WrappingPaperColorways.tsx",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#1A1E22",
    "count": 2,
    "family": "blues",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#242424",
    "count": 2,
    "family": "neutrals",
    "files": "admin/admin.module.css",
    "routes": [
      "/admin"
    ]
  },
  {
    "hex": "#252525",
    "count": 2,
    "family": "neutrals",
    "files": "admin/admin.module.css, shared/CustomMap.tsx",
    "routes": [
      "/admin",
      "/visit"
    ]
  },
  {
    "hex": "#272727",
    "count": 2,
    "family": "neutrals",
    "files": "checkout/checkout.module.css",
    "routes": [
      "/checkout"
    ]
  },
  {
    "hex": "#242526",
    "count": 2,
    "family": "neutrals",
    "files": "product-identity/AppBrandIdentitySection.module.css",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#2E2E2E",
    "count": 2,
    "family": "neutrals",
    "files": "admin/admin.module.css, lib/email-templates.ts",
    "routes": [
      "/admin",
      "/debug-email/preview"
    ]
  },
  {
    "hex": "#1E3D2C",
    "count": 2,
    "family": "greens",
    "token": "--green-depot-light",
    "files": "globals.css, product-identity/ExtendedIdentityBoards.tsx",
    "routes": [
      "/",
      "/product-identity"
    ]
  },
  {
    "hex": "#4A2C18",
    "count": 2,
    "family": "golds",
    "files": "lib/email-templates.ts",
    "routes": [
      "/debug-email/preview"
    ]
  },
  {
    "hex": "#5E060B",
    "count": 2,
    "family": "reds",
    "files": "product-identity/WrappingPaperColorways.tsx",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#7A0000",
    "count": 2,
    "family": "reds",
    "files": "dashboard/dashboard.module.css, inventory/inventory.module.css",
    "routes": [
      "/dashboard",
      "/inventory"
    ]
  },
  {
    "hex": "#4A3A30",
    "count": 2,
    "family": "browns",
    "files": "order/success/page.module.css",
    "routes": [
      "/order/success"
    ]
  },
  {
    "hex": "#3C4043",
    "count": 2,
    "family": "neutrals",
    "files": "online-orders/OnlineOrdersClient.tsx, online-orders/page.module.css",
    "routes": [
      "/online-orders"
    ]
  },
  {
    "hex": "#6B4226",
    "count": 2,
    "family": "golds",
    "files": "cut-guide/CutGuideClient.tsx, home/CutGuide.tsx",
    "routes": [
      "/cut-guide"
    ]
  },
  {
    "hex": "#7C2115",
    "count": 2,
    "family": "reds",
    "files": "product-identity/WrappingPaperColorways.tsx",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#1A7F37",
    "count": 2,
    "family": "greens",
    "files": "admin/social/page.tsx, product-identity/social/SocialKit.tsx",
    "routes": [
      "/admin/social",
      "/product-identity/social"
    ]
  },
  {
    "hex": "#9A0025",
    "count": 2,
    "family": "reds",
    "files": "checkout/checkout.module.css",
    "routes": [
      "/checkout"
    ]
  },
  {
    "hex": "#059669",
    "count": 2,
    "family": "greens",
    "files": "cut-guide/CutGuideClient.tsx, home/CutGuide.tsx",
    "routes": [
      "/cut-guide"
    ]
  },
  {
    "hex": "#6B4D38",
    "count": 2,
    "family": "browns",
    "files": "order/success/page.module.css, selections/page.module.css",
    "routes": [
      "/order/success",
      "/selections"
    ]
  },
  {
    "hex": "#5A6E3A",
    "count": 2,
    "family": "greens",
    "files": "cut-guide/CutGuideClient.tsx, home/CutGuide.tsx",
    "routes": [
      "/cut-guide"
    ]
  },
  {
    "hex": "#5C5852",
    "count": 2,
    "family": "neutrals",
    "files": "admin/login/login.module.css, reset-password/page.module.css",
    "routes": [
      "/admin/login",
      "/reset-password"
    ]
  },
  {
    "hex": "#2E7D6E",
    "count": 2,
    "family": "greens",
    "files": "cut-guide/CutGuideClient.tsx, home/CutGuide.tsx",
    "routes": [
      "/cut-guide"
    ]
  },
  {
    "hex": "#0891B2",
    "count": 2,
    "family": "blues",
    "files": "cut-guide/CutGuideClient.tsx, home/CutGuide.tsx",
    "routes": [
      "/cut-guide"
    ]
  },
  {
    "hex": "#B45309",
    "count": 2,
    "family": "golds",
    "files": "admin/admin.module.css, specials/page.tsx",
    "routes": [
      "/admin",
      "/specials"
    ]
  },
  {
    "hex": "#A0522D",
    "count": 2,
    "family": "golds",
    "files": "cut-guide/CutGuideClient.tsx, home/CutGuide.tsx",
    "routes": [
      "/cut-guide"
    ]
  },
  {
    "hex": "#2EA043",
    "count": 2,
    "family": "greens",
    "files": "product-identity/social/social.module.css, sitemap-page/page.module.css",
    "routes": [
      "/product-identity/social",
      "/sitemap-page"
    ]
  },
  {
    "hex": "#A93226",
    "count": 2,
    "family": "reds",
    "files": "visit/page.module.css",
    "routes": [
      "/visit"
    ]
  },
  {
    "hex": "#C8291A",
    "count": 2,
    "family": "reds",
    "files": "product-identity/WrappingPaperColorways.tsx",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#D4281E",
    "count": 2,
    "family": "reds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#FF7F00",
    "count": 2,
    "family": "golds",
    "files": "fire-test/FireTestClient.tsx, EmbersBackground.tsx",
    "routes": [
      "/fire-test",
      "/"
    ]
  },
  {
    "hex": "#F1C40F",
    "count": 2,
    "family": "golds",
    "files": "Navbar.module.css",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#FF9900",
    "count": 2,
    "family": "golds",
    "files": "home/HeroAssetEditor.tsx",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#00FF00",
    "count": 2,
    "family": "greens",
    "files": "home/HeroAssetEditor.tsx",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#F29613",
    "count": 2,
    "family": "golds",
    "files": "home/Process.module.css",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#F97316",
    "count": 2,
    "family": "golds",
    "files": "admin/inventory/inventory.module.css, product-identity/WebsiteIdentitySection.tsx",
    "routes": [
      "/admin/inventory",
      "/product-identity"
    ]
  },
  {
    "hex": "#FFAE19",
    "count": 2,
    "family": "golds",
    "files": "product-identity/WrappingPaperColorways.tsx",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#FF6B1A",
    "count": 2,
    "family": "golds",
    "files": "home/Process.module.css",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#E63946",
    "count": 2,
    "family": "reds",
    "files": "newsletter/page.module.css, NewsletterInline.module.css",
    "routes": [
      "/newsletter",
      "/"
    ]
  },
  {
    "hex": "#D6A847",
    "count": 2,
    "family": "golds",
    "files": "product-identity/WrappingPaperColorways.tsx",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#D8A46F",
    "count": 2,
    "family": "golds",
    "files": "product-identity/ProductIdentityClient.tsx",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#9CA3AF",
    "count": 2,
    "family": "neutrals",
    "files": "Navbar.module.css, dev-nav.module.css",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#FF5A67",
    "count": 2,
    "family": "reds",
    "files": "admin/admin.module.css",
    "routes": [
      "/admin"
    ]
  },
  {
    "hex": "#B8B2A8",
    "count": 2,
    "family": "neutrals",
    "files": "admin/login/login.module.css, reset-password/page.module.css",
    "routes": [
      "/admin/login",
      "/reset-password"
    ]
  },
  {
    "hex": "#FFCC66",
    "count": 2,
    "family": "golds",
    "files": "fire-test/FireTestClient.tsx, EmbersBackground.tsx",
    "routes": [
      "/fire-test",
      "/"
    ]
  },
  {
    "hex": "#D8BA92",
    "count": 2,
    "family": "golds",
    "files": "product-identity/AppBrandIdentitySection.module.css",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#A8D890",
    "count": 2,
    "family": "greens",
    "files": "home/SeasonalBanner.module.css",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#C9BFB5",
    "count": 2,
    "family": "browns",
    "files": "dashboard/dashboard.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#D4C4A8",
    "count": 2,
    "family": "browns",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#FFE28A",
    "count": 2,
    "family": "golds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#D1C7BD",
    "count": 2,
    "family": "browns",
    "files": "dashboard/dashboard.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#FF9A9A",
    "count": 2,
    "family": "reds",
    "files": "admin/social/social.module.css, product-identity/social/social.module.css",
    "routes": [
      "/admin/social",
      "/product-identity/social"
    ]
  },
  {
    "hex": "#FFE4A0",
    "count": 2,
    "family": "golds",
    "files": "fire-test/FireTestClient.tsx, EmbersBackground.tsx",
    "routes": [
      "/fire-test",
      "/"
    ]
  },
  {
    "hex": "#D1D5DB",
    "count": 2,
    "family": "blues",
    "files": "dashboard/dashboard.module.css, dev-nav.module.css",
    "routes": [
      "/dashboard",
      "/"
    ]
  },
  {
    "hex": "#D4D4D8",
    "count": 2,
    "family": "neutrals",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#BBF7D0",
    "count": 2,
    "family": "greens",
    "files": "admin/admin.module.css",
    "routes": [
      "/admin"
    ]
  },
  {
    "hex": "#FFB4B4",
    "count": 2,
    "family": "reds",
    "files": "admin/login/login.module.css, reset-password/page.module.css",
    "routes": [
      "/admin/login",
      "/reset-password"
    ]
  },
  {
    "hex": "#F5E1C8",
    "count": 2,
    "family": "golds",
    "files": "ModelViewer.tsx, TrophyModel.tsx",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#FEF3C7",
    "count": 2,
    "family": "golds",
    "files": "admin/admin.module.css, online-orders/page.module.css",
    "routes": [
      "/admin",
      "/online-orders"
    ]
  },
  {
    "hex": "#F5EAD8",
    "count": 2,
    "family": "golds",
    "files": "product-identity/WrappingPaperColorways.module.css",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#F5EADB",
    "count": 2,
    "family": "golds",
    "files": "product-identity/WrappingPaperColorways.tsx",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#EEEEEE",
    "count": 2,
    "family": "neutrals",
    "files": "api/restock-request/route.ts, debug-email/preview/page.tsx",
    "routes": [
      "/",
      "/debug-email/preview"
    ]
  },
  {
    "hex": "#FDE8E8",
    "count": 2,
    "family": "reds",
    "files": "api/catering/preview/route.ts, api/catering/route.ts",
    "routes": [
      "/catering"
    ]
  },
  {
    "hex": "#F5F5F5",
    "count": 2,
    "family": "neutrals",
    "files": "debug-email/preview/page.tsx, Navbar.module.css",
    "routes": [
      "/debug-email/preview",
      "/"
    ]
  },
  {
    "hex": "#F8F8F8",
    "count": 2,
    "family": "neutrals",
    "files": "online-orders/page.module.css, AuthModal.module.css",
    "routes": [
      "/online-orders",
      "/"
    ]
  },
  {
    "hex": "#FAF8F5",
    "count": 2,
    "family": "browns",
    "files": "product-identity/WrappingPaperColorways.tsx",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#FAFAFA",
    "count": 2,
    "family": "neutrals",
    "files": "admin/social/page.tsx, page.module.css",
    "routes": [
      "/admin/social",
      "/"
    ]
  },
  {
    "hex": "#080707",
    "count": 1,
    "family": "neutrals",
    "files": "AddToOrderAnimStudio.module.css",
    "routes": [
      "/online-orders"
    ]
  },
  {
    "hex": "#070707",
    "count": 1,
    "family": "neutrals",
    "files": "home/QuotesSection.module.css",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#0D0B09",
    "count": 1,
    "family": "browns",
    "files": "Navbar.module.css",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#0E0C0B",
    "count": 1,
    "family": "browns",
    "files": "order/success/page.module.css",
    "routes": [
      "/order/success"
    ]
  },
  {
    "hex": "#0D0C0B",
    "count": 1,
    "family": "neutrals",
    "files": "product-identity/ChicagoLockupsSection.module.css",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#0C0D0E",
    "count": 1,
    "family": "neutrals",
    "files": "product-identity/MasterVectorLibrary.module.css",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#110B0C",
    "count": 1,
    "family": "reds",
    "files": "recipes-test/page.module.css",
    "routes": [
      "/recipes-test"
    ]
  },
  {
    "hex": "#0F0D0E",
    "count": 1,
    "family": "neutrals",
    "files": "recipes-test/page.module.css",
    "routes": [
      "/recipes-test"
    ]
  },
  {
    "hex": "#0D0B0A",
    "count": 1,
    "family": "browns",
    "files": "AddToOrderAnimStudio.module.css",
    "routes": [
      "/online-orders"
    ]
  },
  {
    "hex": "#140A07",
    "count": 1,
    "family": "reds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#140D08",
    "count": 1,
    "family": "golds",
    "files": "lib/email-templates.ts",
    "routes": [
      "/debug-email/preview"
    ]
  },
  {
    "hex": "#17120A",
    "count": 1,
    "family": "browns",
    "files": "dashboard/dashboard.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#120E0B",
    "count": 1,
    "family": "browns",
    "files": "dashboard/dashboard.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#18090B",
    "count": 1,
    "family": "reds",
    "files": "online-orders/page.module.css",
    "routes": [
      "/online-orders"
    ]
  },
  {
    "hex": "#170D08",
    "count": 1,
    "family": "golds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#1A0D05",
    "count": 1,
    "family": "golds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#101010",
    "count": 1,
    "family": "neutrals",
    "files": "lib/mapTheme.ts",
    "routes": [
      "/visit"
    ]
  },
  {
    "hex": "#170D0E",
    "count": 1,
    "family": "reds",
    "files": "admin/admin.module.css",
    "routes": [
      "/admin"
    ]
  },
  {
    "hex": "#0B1914",
    "count": 1,
    "family": "greens",
    "files": "admin/admin.module.css",
    "routes": [
      "/admin"
    ]
  },
  {
    "hex": "#14110F",
    "count": 1,
    "family": "browns",
    "files": "dashboard/dashboard.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#15120F",
    "count": 1,
    "family": "browns",
    "files": "dashboard/dashboard.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#141211",
    "count": 1,
    "family": "neutrals",
    "files": "product-identity/ChicagoLockupsSection.module.css",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#151110",
    "count": 1,
    "family": "reds",
    "files": "product-identity/WholeAnimalCutCharts.module.css",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#141212",
    "count": 1,
    "family": "neutrals",
    "files": "product-identity/WrappingPaperColorways.tsx",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#0D1117",
    "count": 1,
    "family": "blues",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#16130C",
    "count": 1,
    "family": "browns",
    "files": "lib/mapTheme.ts",
    "routes": [
      "/visit"
    ]
  },
  {
    "hex": "#1A150C",
    "count": 1,
    "family": "browns",
    "files": "lib/mapTheme.ts",
    "routes": [
      "/visit"
    ]
  },
  {
    "hex": "#151212",
    "count": 1,
    "family": "neutrals",
    "files": "admin/admin.module.css",
    "routes": [
      "/admin"
    ]
  },
  {
    "hex": "#0B1120",
    "count": 1,
    "family": "blues",
    "files": "admin/inventory/inventory.module.css",
    "routes": [
      "/admin/inventory"
    ]
  },
  {
    "hex": "#171310",
    "count": 1,
    "family": "browns",
    "files": "dashboard/dashboard.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#181310",
    "count": 1,
    "family": "browns",
    "files": "order/success/page.module.css",
    "routes": [
      "/order/success"
    ]
  },
  {
    "hex": "#181513",
    "count": 1,
    "family": "browns",
    "files": "product-identity/WrappingPaperColorways.tsx",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#250409",
    "count": 1,
    "family": "reds",
    "files": "product-identity/WrappingPaperColorways.tsx",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#171311",
    "count": 1,
    "family": "browns",
    "files": "lib/email-templates.ts",
    "routes": [
      "/debug-email/preview"
    ]
  },
  {
    "hex": "#22060A",
    "count": 1,
    "family": "reds",
    "files": "lib/mapTheme.ts",
    "routes": [
      "/visit"
    ]
  },
  {
    "hex": "#0D131F",
    "count": 1,
    "family": "blues",
    "files": "inventory/inventory.module.css",
    "routes": [
      "/inventory"
    ]
  },
  {
    "hex": "#1A1714",
    "count": 1,
    "family": "browns",
    "files": "notifications/page.module.css",
    "routes": [
      "/notifications"
    ]
  },
  {
    "hex": "#181514",
    "count": 1,
    "family": "neutrals",
    "files": "product-identity/ChicagoLockupsSection.module.css",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#1A1513",
    "count": 1,
    "family": "browns",
    "files": "product-identity/WholeAnimalCutCharts.module.css",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#211811",
    "count": 1,
    "family": "browns",
    "files": "dashboard/dashboard.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#1C1917",
    "count": 1,
    "family": "neutrals",
    "files": "design-system/responsive.module.css",
    "routes": [
      "/design-system"
    ]
  },
  {
    "hex": "#18191A",
    "count": 1,
    "family": "neutrals",
    "files": "product-identity/AppBrandIdentitySection.module.css",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#181A1B",
    "count": 1,
    "family": "neutrals",
    "files": "visit/page.module.css",
    "routes": [
      "/visit"
    ]
  },
  {
    "hex": "#24150E",
    "count": 1,
    "family": "golds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#0E1626",
    "count": 1,
    "family": "blues",
    "files": "shared/CustomMap.tsx",
    "routes": [
      "/visit"
    ]
  },
  {
    "hex": "#1B1B1B",
    "count": 1,
    "family": "neutrals",
    "files": "admin/admin.module.css",
    "routes": [
      "/admin"
    ]
  },
  {
    "hex": "#241212",
    "count": 1,
    "family": "reds",
    "files": "dashboard/dashboard.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#2D2310",
    "count": 1,
    "family": "golds",
    "files": "dashboard/dashboard.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#2D0F0F",
    "count": 1,
    "family": "reds",
    "files": "notifications/page.module.css",
    "routes": [
      "/notifications"
    ]
  },
  {
    "hex": "#2B1D14",
    "count": 1,
    "family": "browns",
    "files": "lib/email-templates.ts",
    "routes": [
      "/debug-email/preview"
    ]
  },
  {
    "hex": "#241D1A",
    "count": 1,
    "family": "browns",
    "files": "lib/social/notify.ts",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#26211E",
    "count": 1,
    "family": "browns",
    "files": "product-identity/ChicagoLockupsSection.module.css",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#2A1E17",
    "count": 1,
    "family": "browns",
    "files": "verify-email/page.module.css",
    "routes": [
      "/verify-email"
    ]
  },
  {
    "hex": "#262222",
    "count": 1,
    "family": "neutrals",
    "files": "admin/admin.module.css",
    "routes": [
      "/admin"
    ]
  },
  {
    "hex": "#332015",
    "count": 1,
    "family": "browns",
    "files": "lib/email-templates.ts",
    "routes": [
      "/debug-email/preview"
    ]
  },
  {
    "hex": "#2A2320",
    "count": 1,
    "family": "browns",
    "files": "notifications/page.module.css",
    "routes": [
      "/notifications"
    ]
  },
  {
    "hex": "#1E2E1E",
    "count": 1,
    "family": "greens",
    "files": "shared/CustomMap.tsx",
    "routes": [
      "/visit"
    ]
  },
  {
    "hex": "#4A3208",
    "count": 1,
    "family": "golds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#3A2416",
    "count": 1,
    "family": "golds",
    "files": "lib/email-templates.ts",
    "routes": [
      "/debug-email/preview"
    ]
  },
  {
    "hex": "#520609",
    "count": 1,
    "family": "reds",
    "files": "jobs/page.module.css",
    "routes": [
      "/jobs"
    ]
  },
  {
    "hex": "#2C2C2C",
    "count": 1,
    "family": "neutrals",
    "files": "shared/CustomMap.tsx",
    "routes": [
      "/visit"
    ]
  },
  {
    "hex": "#332D2B",
    "count": 1,
    "family": "neutrals",
    "files": "product-identity/WrappingPaperColorways.tsx",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#303030",
    "count": 1,
    "family": "neutrals",
    "files": "admin/admin.module.css",
    "routes": [
      "/admin"
    ]
  },
  {
    "hex": "#3E2D23",
    "count": 1,
    "family": "browns",
    "files": "selections/page.module.css",
    "routes": [
      "/selections"
    ]
  },
  {
    "hex": "#610509",
    "count": 1,
    "family": "reds",
    "files": "selections/page.module.css",
    "routes": [
      "/selections"
    ]
  },
  {
    "hex": "#3A3A3A",
    "count": 1,
    "family": "neutrals",
    "files": "dashboard/dashboard.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#6E070C",
    "count": 1,
    "family": "reds",
    "files": "product-identity/AppBrandIdentitySection.module.css",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#3D3D3D",
    "count": 1,
    "family": "neutrals",
    "files": "dashboard/dashboard.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#4A352F",
    "count": 1,
    "family": "reds",
    "files": "product-identity/page.module.css",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#1A5E2E",
    "count": 1,
    "family": "greens",
    "files": "home/HeroAssetEditor.tsx",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#3C3C3C",
    "count": 1,
    "family": "neutrals",
    "files": "shared/CustomMap.tsx",
    "routes": [
      "/visit"
    ]
  },
  {
    "hex": "#3F3F46",
    "count": 1,
    "family": "neutrals",
    "files": "design-system/responsive.module.css",
    "routes": [
      "/design-system"
    ]
  },
  {
    "hex": "#7A0B10",
    "count": 1,
    "family": "reds",
    "files": "jobs/page.module.css",
    "routes": [
      "/jobs"
    ]
  },
  {
    "hex": "#003087",
    "count": 1,
    "family": "blues",
    "files": "online-orders/OnlineOrdersClient.tsx",
    "routes": [
      "/online-orders"
    ]
  },
  {
    "hex": "#1A1F71",
    "count": 1,
    "family": "blues",
    "files": "online-orders/OnlineOrdersClient.tsx",
    "routes": [
      "/online-orders"
    ]
  },
  {
    "hex": "#1A6E3A",
    "count": 1,
    "family": "greens",
    "files": "home/HeroAssetEditor.tsx",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#2D6E2D",
    "count": 1,
    "family": "greens",
    "files": "globals.css",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#92400E",
    "count": 1,
    "family": "golds",
    "files": "online-orders/page.module.css",
    "routes": [
      "/online-orders"
    ]
  },
  {
    "hex": "#5A4F49",
    "count": 1,
    "family": "neutrals",
    "files": "admin/social/social.module.css",
    "routes": [
      "/admin/social"
    ]
  },
  {
    "hex": "#9E0B16",
    "count": 1,
    "family": "reds",
    "files": "admin/admin.module.css",
    "routes": [
      "/admin"
    ]
  },
  {
    "hex": "#9B0B16",
    "count": 1,
    "family": "reds",
    "files": "dashboard/dashboard.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#AA0018",
    "count": 1,
    "family": "reds",
    "files": "ChatWidget.module.css",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#8A6421",
    "count": 1,
    "family": "golds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#A80B17",
    "count": 1,
    "family": "reds",
    "files": "bbq/AccordionServices.module.css",
    "routes": [
      "/bbq"
    ]
  },
  {
    "hex": "#A50B17",
    "count": 1,
    "family": "reds",
    "files": "dashboard/dashboard.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#A80A18",
    "count": 1,
    "family": "reds",
    "files": "inventory/inventory.module.css",
    "routes": [
      "/inventory"
    ]
  },
  {
    "hex": "#B26A00",
    "count": 1,
    "family": "golds",
    "files": "product-identity/ChicagoLockupsSection.module.css",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#A31118",
    "count": 1,
    "family": "reds",
    "files": "product-identity/WrappingPaperColorways.module.css",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#9C6F19",
    "count": 1,
    "family": "golds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#3A7A3A",
    "count": 1,
    "family": "greens",
    "files": "home/RecipeTeasers.tsx",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#5A5A5A",
    "count": 1,
    "family": "neutrals",
    "files": "shared/CustomMap.tsx",
    "routes": [
      "/visit"
    ]
  },
  {
    "hex": "#9F6F1C",
    "count": 1,
    "family": "golds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#B4141E",
    "count": 1,
    "family": "reds",
    "files": "product-identity/social/copy.ts",
    "routes": [
      "/product-identity/social"
    ]
  },
  {
    "hex": "#2A9E5E",
    "count": 1,
    "family": "greens",
    "files": "home/HeroAssetEditor.tsx",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#3F8F4F",
    "count": 1,
    "family": "greens",
    "files": "admin/social/social.module.css",
    "routes": [
      "/admin/social"
    ]
  },
  {
    "hex": "#1E40AF",
    "count": 1,
    "family": "blues",
    "files": "inventory/inventory.module.css",
    "routes": [
      "/inventory"
    ]
  },
  {
    "hex": "#CC0000",
    "count": 1,
    "family": "reds",
    "files": "online-orders/page.module.css",
    "routes": [
      "/online-orders"
    ]
  },
  {
    "hex": "#1565C0",
    "count": 1,
    "family": "blues",
    "files": "online-orders/page.module.css",
    "routes": [
      "/online-orders"
    ]
  },
  {
    "hex": "#6B6B6B",
    "count": 1,
    "family": "neutrals",
    "files": "shared/CustomMap.tsx",
    "routes": [
      "/visit"
    ]
  },
  {
    "hex": "#4E6D8A",
    "count": 1,
    "family": "blues",
    "files": "shared/CustomMap.tsx",
    "routes": [
      "/visit"
    ]
  },
  {
    "hex": "#AA3333",
    "count": 1,
    "family": "reds",
    "files": "admin/social/social.module.css",
    "routes": [
      "/admin/social"
    ]
  },
  {
    "hex": "#009CDE",
    "count": 1,
    "family": "blues",
    "files": "online-orders/OnlineOrdersClient.tsx",
    "routes": [
      "/online-orders"
    ]
  },
  {
    "hex": "#D03910",
    "count": 1,
    "family": "reds",
    "files": "product-identity/WrappingPaperColorways.tsx",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#BF4922",
    "count": 1,
    "family": "reds",
    "files": "product-identity/WrappingPaperColorways.tsx",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#8A6A55",
    "count": 1,
    "family": "golds",
    "files": "product-identity/social/copy.ts",
    "routes": [
      "/product-identity/social"
    ]
  },
  {
    "hex": "#C88719",
    "count": 1,
    "family": "golds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#A84A3A",
    "count": 1,
    "family": "reds",
    "files": "home/RecipeTeasers.tsx",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#737373",
    "count": 1,
    "family": "neutrals",
    "files": "admin/AdminDashboardClient.tsx",
    "routes": [
      "/admin"
    ]
  },
  {
    "hex": "#E65100",
    "count": 1,
    "family": "golds",
    "files": "online-orders/page.module.css",
    "routes": [
      "/online-orders"
    ]
  },
  {
    "hex": "#B9872D",
    "count": 1,
    "family": "golds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#D3162B",
    "count": 1,
    "family": "reds",
    "files": "shared/CustomMap.module.css",
    "routes": [
      "/visit"
    ]
  },
  {
    "hex": "#28C841",
    "count": 1,
    "family": "greens",
    "files": "showcase/page.module.css",
    "routes": [
      "/showcase"
    ]
  },
  {
    "hex": "#166FE5",
    "count": 1,
    "family": "blues",
    "files": "online-orders/page.module.css",
    "routes": [
      "/online-orders"
    ]
  },
  {
    "hex": "#C8323A",
    "count": 1,
    "family": "reds",
    "files": "product-identity/social/copy.ts",
    "routes": [
      "/product-identity/social"
    ]
  },
  {
    "hex": "#E11D48",
    "count": 1,
    "family": "reds",
    "files": "admin/AdminDashboardClient.tsx",
    "routes": [
      "/admin"
    ]
  },
  {
    "hex": "#FF5500",
    "count": 1,
    "family": "golds",
    "files": "EmberFlare.tsx",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#FF7700",
    "count": 1,
    "family": "golds",
    "files": "EmberFlare.tsx",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#FF8800",
    "count": 1,
    "family": "golds",
    "files": "home/HeroAssetEditor.tsx",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#D14836",
    "count": 1,
    "family": "reds",
    "files": "ChatWidget.module.css",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#EB4F1C",
    "count": 1,
    "family": "reds",
    "files": "home/Process.module.css",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#3498DB",
    "count": 1,
    "family": "blues",
    "files": "api/catering/preview/route.ts",
    "routes": [
      "/catering"
    ]
  },
  {
    "hex": "#DCA032",
    "count": 1,
    "family": "golds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#FF2A14",
    "count": 1,
    "family": "reds",
    "files": "fire-test/FireTestClient.tsx",
    "routes": [
      "/fire-test"
    ]
  },
  {
    "hex": "#B58060",
    "count": 1,
    "family": "golds",
    "files": "product-identity/social/copy.ts",
    "routes": [
      "/product-identity/social"
    ]
  },
  {
    "hex": "#8C8C8C",
    "count": 1,
    "family": "neutrals",
    "files": "admin/admin.module.css",
    "routes": [
      "/admin"
    ]
  },
  {
    "hex": "#FF3A1A",
    "count": 1,
    "family": "reds",
    "files": "fire-test/FireTestClient.tsx",
    "routes": [
      "/fire-test"
    ]
  },
  {
    "hex": "#9C8D7E",
    "count": 1,
    "family": "golds",
    "files": "lib/email-templates.ts",
    "routes": [
      "/debug-email/preview"
    ]
  },
  {
    "hex": "#BA9265",
    "count": 1,
    "family": "golds",
    "files": "product-identity/WrappingPaperColorways.tsx",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#D8A648",
    "count": 1,
    "family": "golds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#D0605A",
    "count": 1,
    "family": "reds",
    "files": "product-identity/social/copy.ts",
    "routes": [
      "/product-identity/social"
    ]
  },
  {
    "hex": "#E05A48",
    "count": 1,
    "family": "reds",
    "files": "home/Newsletter.module.css",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#DDA74F",
    "count": 1,
    "family": "golds",
    "files": "product-identity/WebsiteIdentitySection.tsx",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#FFBD2E",
    "count": 1,
    "family": "golds",
    "files": "showcase/page.module.css",
    "routes": [
      "/showcase"
    ]
  },
  {
    "hex": "#C89D6C",
    "count": 1,
    "family": "golds",
    "files": "product-identity/page.module.css",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#FF5A36",
    "count": 1,
    "family": "reds",
    "files": "fire-test/FireTestClient.tsx",
    "routes": [
      "/fire-test"
    ]
  },
  {
    "hex": "#FF3B47",
    "count": 1,
    "family": "reds",
    "files": "order/success/page.module.css",
    "routes": [
      "/order/success"
    ]
  },
  {
    "hex": "#E8735A",
    "count": 1,
    "family": "reds",
    "files": "online-orders/page.module.css",
    "routes": [
      "/online-orders"
    ]
  },
  {
    "hex": "#FFCC44",
    "count": 1,
    "family": "golds",
    "files": "EmberFlare.tsx",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#FFBC42",
    "count": 1,
    "family": "golds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#FF4455",
    "count": 1,
    "family": "reds",
    "files": "home/HeroAssetEditor.tsx",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#4488FF",
    "count": 1,
    "family": "blues",
    "files": "home/HeroAssetEditor.tsx",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#F4C152",
    "count": 1,
    "family": "golds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#FF4D5E",
    "count": 1,
    "family": "reds",
    "files": "admin/admin.module.css",
    "routes": [
      "/admin"
    ]
  },
  {
    "hex": "#FF6A4D",
    "count": 1,
    "family": "reds",
    "files": "fire-test/FireTestClient.tsx",
    "routes": [
      "/fire-test"
    ]
  },
  {
    "hex": "#C9AB84",
    "count": 1,
    "family": "golds",
    "files": "selections/page.module.css",
    "routes": [
      "/selections"
    ]
  },
  {
    "hex": "#FF4D4F",
    "count": 1,
    "family": "reds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#4EFF9E",
    "count": 1,
    "family": "greens",
    "files": "home/HeroAssetEditor.tsx",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#B8A99A",
    "count": 1,
    "family": "golds",
    "files": "lib/email-templates.ts",
    "routes": [
      "/debug-email/preview"
    ]
  },
  {
    "hex": "#FF5F57",
    "count": 1,
    "family": "reds",
    "files": "showcase/page.module.css",
    "routes": [
      "/showcase"
    ]
  },
  {
    "hex": "#6EE7A0",
    "count": 1,
    "family": "greens",
    "files": "AuthModal.module.css",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#ED976B",
    "count": 1,
    "family": "golds",
    "files": "CateringCalendar.module.css",
    "routes": [
      "/catering"
    ]
  },
  {
    "hex": "#E8A070",
    "count": 1,
    "family": "golds",
    "files": "CateringCalendar.module.css",
    "routes": [
      "/catering"
    ]
  },
  {
    "hex": "#FF5A5A",
    "count": 1,
    "family": "reds",
    "files": "admin/social/social.module.css",
    "routes": [
      "/admin/social"
    ]
  },
  {
    "hex": "#D5B88F",
    "count": 1,
    "family": "golds",
    "files": "product-identity/social/SocialKit.tsx",
    "routes": [
      "/product-identity/social"
    ]
  },
  {
    "hex": "#FF6B6B",
    "count": 1,
    "family": "reds",
    "files": "admin/social/social.module.css",
    "routes": [
      "/admin/social"
    ]
  },
  {
    "hex": "#FF7B6B",
    "count": 1,
    "family": "reds",
    "files": "dashboard/dashboard.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#FF8A6A",
    "count": 1,
    "family": "reds",
    "files": "fire-test/FireTestClient.tsx",
    "routes": [
      "/fire-test"
    ]
  },
  {
    "hex": "#B0B3B8",
    "count": 1,
    "family": "neutrals",
    "files": "product-identity/AppBrandIdentitySection.module.css",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#FF6B70",
    "count": 1,
    "family": "reds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#BBBBBB",
    "count": 1,
    "family": "neutrals",
    "files": "Navbar.module.css",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#BDBDBD",
    "count": 1,
    "family": "neutrals",
    "files": "dashboard/dashboard.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#7CC0FF",
    "count": 1,
    "family": "blues",
    "files": "product-identity/AppBrandIdentitySection.module.css",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#A5D6A7",
    "count": 1,
    "family": "greens",
    "files": "product-identity/ChicagoLockupsSection.module.css",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#FFE082",
    "count": 1,
    "family": "golds",
    "files": "product-identity/ChicagoLockupsSection.module.css",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#7DFF7D",
    "count": 1,
    "family": "greens",
    "files": "ChatWidget.module.css",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#FFE080",
    "count": 1,
    "family": "golds",
    "files": "EmberFlare.tsx",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#D7C3A5",
    "count": 1,
    "family": "browns",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#FF8590",
    "count": 1,
    "family": "reds",
    "files": "admin/admin.module.css",
    "routes": [
      "/admin"
    ]
  },
  {
    "hex": "#9BE9A8",
    "count": 1,
    "family": "greens",
    "files": "admin/social/social.module.css",
    "routes": [
      "/admin/social"
    ]
  },
  {
    "hex": "#A78BFA",
    "count": 1,
    "family": "blues",
    "files": "dashboard/dashboard.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#D9CDB8",
    "count": 1,
    "family": "browns",
    "files": "product-identity/social/SocialKit.tsx",
    "routes": [
      "/product-identity/social"
    ]
  },
  {
    "hex": "#FF9AA3",
    "count": 1,
    "family": "reds",
    "files": "admin/admin.module.css",
    "routes": [
      "/admin"
    ]
  },
  {
    "hex": "#A7F3D0",
    "count": 1,
    "family": "greens",
    "files": "dashboard/dashboard.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#A7F3BC",
    "count": 1,
    "family": "greens",
    "files": "order-tracker-test/OrderTrackerClient.tsx",
    "routes": [
      "/order-tracker-test"
    ]
  },
  {
    "hex": "#FF999B",
    "count": 1,
    "family": "reds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#FFE299",
    "count": 1,
    "family": "golds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#FBE09C",
    "count": 1,
    "family": "golds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#E8C4C4",
    "count": 1,
    "family": "reds",
    "files": "online-orders/page.module.css",
    "routes": [
      "/online-orders"
    ]
  },
  {
    "hex": "#DEDAD4",
    "count": 1,
    "family": "browns",
    "files": "product-identity/WholeAnimalCutCharts.module.css",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#FFF2B2",
    "count": 1,
    "family": "golds",
    "files": "context/CartContext.tsx",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#E8DED1",
    "count": 1,
    "family": "browns",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#DADCE0",
    "count": 1,
    "family": "neutrals",
    "files": "online-orders/page.module.css",
    "routes": [
      "/online-orders"
    ]
  },
  {
    "hex": "#F6E7C8",
    "count": 1,
    "family": "golds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#E5DFD5",
    "count": 1,
    "family": "browns",
    "files": "home/Process.module.css",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#F2E8D2",
    "count": 1,
    "family": "golds",
    "files": "product-identity/WrappingPaperColorways.tsx",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#ECE6D8",
    "count": 1,
    "family": "browns",
    "files": "product-identity/WrappingPaperColorways.tsx",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#EDE5D8",
    "count": 1,
    "family": "browns",
    "files": "Navbar.module.css",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#F2E9D8",
    "count": 1,
    "family": "golds",
    "files": "jobs/page.module.css",
    "routes": [
      "/jobs"
    ]
  },
  {
    "hex": "#E6E6E6",
    "count": 1,
    "family": "neutrals",
    "files": "recipes-test/page.module.css",
    "routes": [
      "/recipes-test"
    ]
  },
  {
    "hex": "#FFD1D6",
    "count": 1,
    "family": "reds",
    "files": "admin/admin.module.css",
    "routes": [
      "/admin"
    ]
  },
  {
    "hex": "#F5EEDC",
    "count": 1,
    "family": "golds",
    "files": "product-identity/page.module.css",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#E5E7EB",
    "count": 1,
    "family": "blues",
    "files": "dev-nav.module.css",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#FFF4D2",
    "count": 1,
    "family": "golds",
    "files": "context/CartContext.tsx",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#EBEBEB",
    "count": 1,
    "family": "neutrals",
    "files": "page.module.css",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#EDEDED",
    "count": 1,
    "family": "neutrals",
    "files": "page.module.css",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#FFF3E0",
    "count": 1,
    "family": "golds",
    "files": "online-orders/page.module.css",
    "routes": [
      "/online-orders"
    ]
  },
  {
    "hex": "#E3F2FD",
    "count": 1,
    "family": "blues",
    "files": "online-orders/page.module.css",
    "routes": [
      "/online-orders"
    ]
  },
  {
    "hex": "#FEE2E2",
    "count": 1,
    "family": "reds",
    "files": "online-orders/page.module.css",
    "routes": [
      "/online-orders"
    ]
  },
  {
    "hex": "#F5F0EA",
    "count": 1,
    "family": "browns",
    "files": "Navbar.module.css",
    "routes": [
      "/"
    ]
  },
  {
    "hex": "#FFF6E0",
    "count": 1,
    "family": "golds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#FFF5DF",
    "count": 1,
    "family": "golds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#F7F3EC",
    "count": 1,
    "family": "browns",
    "files": "visit/page.module.css",
    "routes": [
      "/visit"
    ]
  },
  {
    "hex": "#FFF7E6",
    "count": 1,
    "family": "golds",
    "files": "dashboard/CutCollector.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#F1F5F9",
    "count": 1,
    "family": "blues",
    "files": "dashboard/dashboard.module.css",
    "routes": [
      "/dashboard"
    ]
  },
  {
    "hex": "#FDF2F2",
    "count": 1,
    "family": "reds",
    "files": "online-orders/page.module.css",
    "routes": [
      "/online-orders"
    ]
  },
  {
    "hex": "#F8F9FA",
    "count": 1,
    "family": "blues",
    "files": "online-orders/page.module.css",
    "routes": [
      "/online-orders"
    ]
  },
  {
    "hex": "#FDF6F6",
    "count": 1,
    "family": "reds",
    "files": "online-orders/page.module.css",
    "routes": [
      "/online-orders"
    ]
  },
  {
    "hex": "#FBFBFB",
    "count": 1,
    "family": "neutrals",
    "files": "product-identity/WrappingPaperColorways.tsx",
    "routes": [
      "/product-identity"
    ]
  },
  {
    "hex": "#FEFEFE",
    "count": 1,
    "family": "neutrals",
    "files": "api/email/template.ts",
    "routes": [
      "/debug-email/preview"
    ]
  }
];
