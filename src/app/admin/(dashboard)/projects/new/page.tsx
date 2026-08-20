import { ProjectForm } from "@/app/admin/(dashboard)/projects/project-form";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-black">New Project</h1>
      <ProjectForm />
    </div>
  );
}
