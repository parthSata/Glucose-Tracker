import { z } from 'zod'
import {
  loginPasswordSchema,
  registerPasswordSchema,
} from '@/lib/password-schema'

export const registerFormSchema = z
  .object({
    name: z
      .string({ error: 'Please enter your name.' })
      .trim()
      .min(1, 'Please enter your name.'),
    email: z
      .string({ error: 'Please enter your email.' })
      .trim()
      .min(1, 'Please enter your email.')
      .email('Please enter a valid email address.'),
    password: registerPasswordSchema,
    confirmPassword: z
      .string({ error: 'Please confirm your password.' })
      .superRefine((value, ctx) => {
        if (value.length === 0) {
          ctx.addIssue({
            code: 'custom',
            message: 'Please confirm your password.',
          })
          return
        }

        if (value.includes('\0')) {
          ctx.addIssue({
            code: 'custom',
            message: 'Password cannot contain null characters.',
          })
        }
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export const loginFormSchema = z.object({
  email: z
    .string({ error: 'Please enter your email.' })
    .trim()
    .min(1, 'Please enter your email.')
    .email('Please enter a valid email address.'),
  password: loginPasswordSchema,
})

export type RegisterFormValues = z.infer<typeof registerFormSchema>
export type LoginFormValues = z.infer<typeof loginFormSchema>
