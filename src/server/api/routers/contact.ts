import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ContactInputSchema } from "~/modules/contact/logic/ContactSchema";
import { submitContact } from "~/modules/contact/logic/submitContact";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";

export const contactRouter = createTRPCRouter({
  submit: publicProcedure
    .input(ContactInputSchema)
    .mutation(async ({ input }) => {
      try {
        // submitContact(input, "prisma") => use for prisma
        // submitContact(input, "notion") => use for notion
        return await submitContact(input, "notion"); // notion | prisma
      } catch (error) {
        if (
          (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") || // For Prisma UNIQUE constraint
          (error instanceof TRPCError && error.code === "CONFLICT") // For Notion UNIQUE constraint
        ) {
          // This error means a unique constraint failed
          throw new TRPCError({
            code: "CONFLICT",
            message: "Already exists user",
          });
        }

        // console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to submit contact form",
        });
      }
    }),
});
