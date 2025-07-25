import type { ContactInput } from "../logic/ContactSchema";
import { db } from "~/server/db";
export const submitContact = async (data: ContactInput) => {
    return db.contact.create({
        data
    })
}