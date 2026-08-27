import { ServiceForm } from "@/app/admin/(dashboard)/services/service-form";

export default function NewServicePage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-black">New Service</h1>
      <ServiceForm />
    </div>
  );
}
