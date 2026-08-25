import { PackagesPricing } from "@/components/packages-pricing";
import type { Package } from "@/lib/projects";

export function ManagementPricing({ packages }: { packages: Package[] }) {
  return (
    <PackagesPricing
      packages={packages}
      namespace="management.pricing"
      sectionClassName="pt-16 pb-16 lg:pt-32 lg:pb-32"
    />
  );
}
