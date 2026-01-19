import { Layout } from '@/components/layout/Layout';
import { UserForm } from '@/components/forms/UserForm';
import { HobbyForm } from '@/components/forms/HobbyForm';

export default function FormsPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold tracking-tight">Add Data</h1>
          <p className="text-muted-foreground mt-1">
            Create new users and assign hobbies
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <UserForm />
          <HobbyForm />
        </div>
      </div>
    </Layout>
  );
}
