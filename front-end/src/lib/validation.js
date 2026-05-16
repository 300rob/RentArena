import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(20, "Name must be at most 20 characters"),
  email: z.string().email("Please provide a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const applySchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Please provide a valid email"),
  phoneNumber: z.string().min(8, "Please provide a valid phone number"),
  placeName: z.string().min(3, "Facility name must be at least 3 characters"),
  placeAddress: z.string().min(5, "Please provide a complete address"),
  category: z.string().min(1, "Please select a category"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  description: z.string().min(10, "Description should be at least 10 characters long"),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms" }),
  }),
});
