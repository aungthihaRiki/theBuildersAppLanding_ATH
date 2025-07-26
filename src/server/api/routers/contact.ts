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
        return await submitContact(input);
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          // This error means a unique constraint failed
          throw new TRPCError({
            code: "CONFLICT",
            message: "Already exists user",
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user",
        });
      }
    }),
});
