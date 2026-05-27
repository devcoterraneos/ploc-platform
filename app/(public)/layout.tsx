import { SettingsProvider } from "@/lib/settings-context";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SettingsProvider>
      <div className="min-h-screen flex flex-col bg-white text-gray-900">
        <LandingHeader />
        <main className="flex-1">{children}</main>
        <LandingFooter />
      </div>
    </SettingsProvider>
  );
}
