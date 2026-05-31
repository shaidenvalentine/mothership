import { Attribution } from "@/components/analytics/Attribution";
import { Footer } from "@/components/footer/Footer";
import { Nav } from "@/components/nav/Nav";
import { LenisProvider } from "@/components/providers/LenisProvider";

/**
 * Marketing-site chrome: the public Nav, Footer and Lenis smooth scroll wrap
 * every route in the (site) group. The admin portal and the customer build
 * tracker deliberately live outside this group so they get a clean shell.
 */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LenisProvider>
      <Attribution />
      <Nav />
      {children}
      <Footer />
    </LenisProvider>
  );
}
