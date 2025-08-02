import { notion } from "~/server/notion";
import type { ContactInput } from "../logic/ContactSchema";
import { db } from "~/server/db";
import { isUnique } from "./isUnique";
import { TRPCError } from "@trpc/server";
import { env } from "~/env";
export const submitContact = async (data: ContactInput, type: string) => {
  if (type === "prisma") {  // for prisma
    return db.contact.create({
      data,
    });
  } else if (type === "notion") { // for notion database
    const phoneUnique = await isUnique("Phone", data.phone);
    const emailUnique = await isUnique("Email", data.email);
    if (!phoneUnique || !emailUnique) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Already exists user",
      });
    }

    try {
      const response = await notion.pages.create({
        parent: { database_id: env.NOTION_DATABASE_ID },
        properties: {
          "First Name": {
            rich_text: [{ text: { content: data.firstName } }],
          },
          "Last Name": {
            rich_text: [{ text: { content: data.lastName } }],
          },
          Phone: { phone_number: data.phone },
          Email: { email: data.email },
        },
      });
      // console.log("✅ Notion response:", response);
      // console.log(response);
      return response;
    } catch (error) {
      // console.error("❌ Notion error:", JSON.stringify(error, null, 2));
      // console.log(error);
      throw error;
    }
  }
};
