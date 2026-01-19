import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userFormSchema, type UserFormData } from '@/lib/validation';
import { useCreateUser } from '@/hooks/useUsers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { UserPlus } from 'lucide-react';
import type { CreateUserInput } from '@/types/user';

export function UserForm() {
  const createUser = useCreateUser();
  
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      address: '',
      phone_number: '',
    },
  });

  const onSubmit = async (data: UserFormData) => {
    const input: CreateUserInput = {
      first_name: data.first_name,
      last_name: data.last_name,
      address: data.address || undefined,
      phone_number: data.phone_number || undefined,
    };
    await createUser.mutateAsync(input);
    form.reset();
  };

  return (
    <Card className="shadow-card animate-slide-up">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-accent p-2">
            <UserPlus className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <CardTitle>Add New User</CardTitle>
            <CardDescription>Create a new user profile</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="123 Main Street, City, Country" 
                      className="resize-none min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full sm:w-auto"
              disabled={createUser.isPending}
            >
              {createUser.isPending ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2 text-primary-foreground" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
