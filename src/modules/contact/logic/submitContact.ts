import { databaseId, notion } from "~/server/notion";
import type { ContactInput } from "../logic/ContactSchema";
import { db } from "~/server/db";
import { create } from "domain";
export const submitContact = async (data: ContactInput, type: string) => {
  if (type === "prisma") {
    return db.contact.create({
      data,
    });
  } else if (type === "notion") {
    try {

        const response = await notion.pages.create({
          parent: { database_id: databaseId as string },
          properties: {
            "First Name": {
              rich_text: [{ text: { content: data.firstName, }, }, ],
            },
            "Last Name": {
              rich_text: [{ text: { content: data.lastName, }, }, ],
            },
            "Phone": { phone_number: data.phone },
            "Email": { email: data.email },
            // "createdAt": { date: { start: new Date().toISOString() } },
          },
        });
        console.log("✅ Notion response:", response);
        console.log(response);
        return response;
    } catch (error) {
        console.error("❌ Notion error:", JSON.stringify(error, null, 2));
        console.log(error)
        throw error;
    }
  }
};
