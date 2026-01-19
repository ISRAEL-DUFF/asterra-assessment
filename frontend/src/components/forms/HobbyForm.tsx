import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { hobbyFormSchema, type HobbyFormData } from '@/lib/validation';
import { useUsers, useCreateHobby } from '@/hooks/useUsers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Sparkles } from 'lucide-react';
import type { CreateHobbyInput } from '@/types/user';

export function HobbyForm() {
  const { data: users = [], isLoading: isLoadingUsers } = useUsers();
  console.log({
    users
  })
  const createHobby = useCreateHobby();
  
  const form = useForm<HobbyFormData>({
    resolver: zodResolver(hobbyFormSchema),
    defaultValues: {
      user_id: '',
      hobbies: '',
    },
  });

  const onSubmit = async (data: HobbyFormData) => {
    const input: CreateHobbyInput = {
      user_id: Number(data.user_id),
      hobbies: data.hobbies,
    };
    await createHobby.mutateAsync(input);
    form.reset();
  };

  return (
    <Card className="shadow-card animate-slide-up" style={{ animationDelay: '100ms' }}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-accent p-2">
            <Sparkles className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <CardTitle>Add Hobby</CardTitle>
            <CardDescription>Assign a hobby to an existing user</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="user_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select User *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={isLoadingUsers}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingUsers ? "Loading users..." : "Select a user"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={String(user.id)}>
                          {user.first_name} {user.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hobbies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hobby *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Reading, Swimming, Coding" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full sm:w-auto"
              disabled={createHobby.isPending || isLoadingUsers}
            >
              {createHobby.isPending ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2 text-primary-foreground" />
                  Adding...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Add Hobby
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
