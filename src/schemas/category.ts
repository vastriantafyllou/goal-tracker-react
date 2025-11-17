import {z} from "zod";

// Category schema για read operations
export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  goalCount: z.number().optional(),
});

export type Category = z.infer<typeof categorySchema>;

// Schema για δημιουργία category
export const categoryCreateSchema = z.object({
  name: z.string().min(2, {message: "Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες"}).max(50, {message: "Το όνομα δεν μπορεί να ξεπεράσει τους 50 χαρακτήρες"}),
});

export type CategoryCreateFields = z.infer<typeof categoryCreateSchema>;
