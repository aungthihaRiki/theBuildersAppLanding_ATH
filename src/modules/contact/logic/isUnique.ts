import { databaseId, notion } from "~/server/notion";

export async function isUnique(field: "Phone" | "Email", value: string) {
  const response = await notion.databases.query({
    database_id: databaseId as string,
    filter: {
      property: field,
      rich_text: { equals: value },
    },
  });

  return response.results.length === 0;
}
