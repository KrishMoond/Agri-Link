import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  location: z.array(z.string()).min(1, 'Location is required'),
  gender: z.enum(['male', 'female', 'non-binary', 'prefer-not-to-say']),
  dob: z.string().min(1, 'Date of birth is required'),
  role: z.enum(['buyer', 'seller']),
  gstNumber: z.string().optional(),
  farmerCardNumber: z.string().optional()
});

export const auctionSchema = z.object({
  itemName: z.string().min(1, 'Item name is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unit: z.string().min(1, 'Unit is required'),
  pricePerUnit: z.number().min(1, 'Price must be at least 1'),
  auctionEndDate: z.date().refine(
    (date) => date > new Date(),
    'End date must be in the future'
  )
});

export const bidSchema = z.object({
  bidAmount: z.number().min(1, 'Bid amount must be positive'),
  userId: z.string().min(1, 'User ID is required')
});
