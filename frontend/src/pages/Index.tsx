import { Layout } from '@/components/layout/Layout';
import { UsersTable } from '@/components/users/UsersTable';

export default function IndexPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all users and their hobbies
          </p>
        </div>

        <UsersTable />
      </div>
    </Layout>
  );
}
