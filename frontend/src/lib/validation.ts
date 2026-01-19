import { z } from 'zod';

/**
 * User form validation schema
 */
export const userFormSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  last_name: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  address: z
    .string()
    .trim()
    .max(200, 'Address must be less than 200 characters')
    .optional()
    .or(z.literal('')),
  phone_number: z
    .string()
    .trim()
    .max(20, 'Phone number must be less than 20 characters')
    .optional()
    .or(z.literal('')),
});

export type UserFormData = z.infer<typeof userFormSchema>;

/**
 * Hobby form validation schema
 */
export const hobbyFormSchema = z.object({
  user_id: z
    .string()
    .min(1, 'Please select a user'),
  hobbies: z
    .string()
    .trim()
    .min(1, 'Hobby is required')
    .max(100, 'Hobby must be less than 100 characters'),
});

export type HobbyFormData = z.infer<typeof hobbyFormSchema>;
