import { z } from "zod";

/** Reservation enquiry (the /configure page). */
export const reserveFields = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  timeline: z.string().min(1, "Select a timeline"),
  useCase: z.string().min(1, "Tell us how you'll use it"),
  message: z.string().max(2000).optional(),
});
export type ReserveInput = z.infer<typeof reserveFields>;

/** Consultation / discovery-call request (the /contact page). */
export const consultationFields = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.email("Enter a valid email"),
  phone: z.string().optional(),
  message: z.string().min(1, "Add a short message").max(2000),
});
export type ConsultationInput = z.infer<typeof consultationFields>;

/** Newsletter signup (footer). */
export const newsletterFields = z.object({
  email: z.email("Enter a valid email"),
});
export type NewsletterInput = z.infer<typeof newsletterFields>;

/** Creator / influencer demo-van application (the /creators page). */
export const creatorFields = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.email("Enter a valid email"),
  instagram: z.string().min(2, "Instagram handle required"),
  youtube: z.string().optional(),
  totalFollowing: z
    .string()
    .max(80)
    .optional(),
  pickupDate: z.string().min(1, "Pick a pickup date"),
  returnDate: z.string().min(1, "Pick a return date"),
  destination: z.string().min(2, "Where are you heading?"),
  contentPlan: z
    .string()
    .min(10, "Tell us a bit about what you'll create")
    .max(2000),
  agreeRules: z.literal(true, {
    message: "Please agree to the house rules",
  }),
});
export type CreatorInput = z.infer<typeof creatorFields>;

export type LeadType =
  | "reserve"
  | "consultation"
  | "newsletter"
  | "creator";
