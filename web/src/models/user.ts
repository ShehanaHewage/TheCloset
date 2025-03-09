import { z } from 'zod';

export type UserDto = {
  id: string;
  firstName: string;
  lastName: string;
  mobile: string;
  address: string;
  username: string;
  type?: 'regular' | 'admin';
  createdAt?: string;
  updatedAt?: string;
};

export type LoginDto = {
  token: string;
  user: UserDto;
};

export const loginFormSchema = z.object({
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});
export type LoginFormDto = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z
  .object({
    firstName: z.string().min(2, {
      message: 'First name must be at least 2 characters.',
    }),
    lastName: z.string().min(2, {
      message: 'Last name must be at least 2 characters.',
    }),
    mobile: z.string().min(10, {
      message: 'Mobile number must be at least 10 digits.',
    }),
    address: z.string().min(10, {
      message: 'Address must be at least 10 characters.',
    }),
    username: z.string().email({
      message: 'Username must be a valid email address.',
    }),
    password: z.string().min(6, {
      message: 'Password must be at least 6 characters.',
    }),
    confirmPassword: z.string().min(6, {
      message: 'Confirm password must be at least 6 characters.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type RegisterFormDto = Omit<z.infer<typeof registerFormSchema>, 'confirmPassword'>;

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, {
      message: 'First name must be at least 2 characters.',
    })
    .optional(),
  lastName: z
    .string()
    .min(2, {
      message: 'Last name must be at least 2 characters.',
    })
    .optional(),
  mobile: z
    .string()
    .min(10, {
      message: 'Mobile number must be at least 10 digits.',
    })
    .optional(),
  address: z
    .string()
    .min(10, {
      message: 'Address must be at least 10 characters.',
    })
    .optional(),
});
export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, {
      message: 'Current password must be at least 6 characters.',
    }),
    newPassword: z.string().min(6, {
      message: 'New password must be at least 6 characters.',
    }),
    confirmNewPassword: z.string().min(6, {
      message: 'Confirm new password must be at least 6 characters.',
    }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match",
    path: ['confirmNewPassword'],
  });
export type ChangePasswordDto = Omit<z.infer<typeof changePasswordSchema>, 'confirmNewPassword'>;

export const updateUserSchema = z.object({
  firstName: z
    .string()
    .min(2, {
      message: 'First name must be at least 2 characters.',
    })
    .optional(),
  lastName: z
    .string()
    .min(2, {
      message: 'Last name must be at least 2 characters.',
    })
    .optional(),
  mobile: z
    .string()
    .min(10, {
      message: 'Mobile number must be at least 10 digits.',
    })
    .optional(),
  address: z
    .string()
    .min(10, {
      message: 'Address must be at least 10 characters.',
    })
    .optional(),
  type: z.enum(['regular', 'admin']).optional(),
});
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
