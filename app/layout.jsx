import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustStrip from "@/components/TrustStrip";



export const metadata = {
  title: "QuickPayBooks — Fiction, Science, Story & Mystery",
  description:
    "A small online bookstore. Browse fiction, science, folktales and mystery — order with a Razorpay test-mode checkout.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "QuickPayBooks",
    description:
      "Four shelves, chosen with care — fiction, science, folktales and mystery.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#1F2D27",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <CartProvider>
          <TrustStrip />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
