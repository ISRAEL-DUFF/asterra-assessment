import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, hobbyService } from '@/services/user.service';
import { useToast } from '@/hooks/use-toast';
import type { CreateUserInput, CreateHobbyInput } from '@/types/user';

// Query keys for cache management
export const userKeys = {
  all: ['users'] as const,
  list: () => [...userKeys.all, 'list'] as const,
  withHobbies: () => [...userKeys.all, 'with-hobbies'] as const,
};

export function useUsers() {
  const { toast } = useToast();

  return useQuery({
    queryKey: userKeys.list(),
    queryFn: async () => {
      const response = await userService.getUsers();
      if (!response.success) {
        toast({
          variant: 'destructive',
          title: 'Error fetching users',
          description: response.error?.message || 'An unexpected error occurred',
        });
        throw new Error(response.error?.message);
      }
      return response.data ?? [];
    },
  });
}

export function useUsersWithHobbies() {
  const { toast } = useToast();

  return useQuery({
    queryKey: userKeys.withHobbies(),
    queryFn: async () => {
      const response = await userService.getUsersWithHobbies();
      if (!response.success) {
        toast({
          variant: 'destructive',
          title: 'Error fetching data',
          description: response.error?.message || 'An unexpected error occurred',
        });
        throw new Error(response.error?.message);
      }
      return response.data ?? [];
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateUserInput) => {
      const response = await userService.createUser(data);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to create user');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast({
        title: 'Success!',
        description: 'User has been created successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error creating user',
        description: error.message,
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userId: number) => {
      const response = await userService.deleteUser(userId);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete user');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast({
        title: 'Success!',
        description: 'User has been deleted successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error deleting user',
        description: error.message,
      });
    },
  });
}

export function useCreateHobby() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateHobbyInput) => {
      const response = await hobbyService.createHobby(data);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to add hobby');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.withHobbies() });
      toast({
        title: 'Success!',
        description: 'Hobby has been added successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error adding hobby',
        description: error.message,
      });
    },
  });
}

export function useDeleteHobby() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, hobby }: { userId: number; hobby: string }) => {
      const response = await hobbyService.deleteHobby(userId, hobby);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete hobby');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.withHobbies() });
      toast({
        title: 'Success!',
        description: 'Hobby has been deleted successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error deleting hobby',
        description: error.message,
      });
    },
  });
}
