import { PackagesPricing } from "@/components/packages-pricing";
import type { Package } from "@/lib/projects";

export function DigitalPricing({ packages }: { packages: Package[] }) {
  return (
    <PackagesPricing
      packages={packages}
      namespace="digital.pricing"
      sectionClassName="pt-16 pb-0 lg:pt-32"
    />
  );
}
