import { databaseId, notion } from "~/server/notion";
import { env } from "~/env";

export async function isUnique(field: "Phone" | "Email", value: string) {
  const response = await notion.databases.query({
    database_id: env.NOTION_DATABASE_ID,
    filter: {
      property: field,
      rich_text: { equals: value },
    },
  });

  return response.results.length === 0;
}
