import { describe, it, expect } from "vitest";
import { submitContact } from "./submitContact";
import type { ContactInput } from "./ContactSchema";

function generateTestPhoneNumber() {
  const len = [7, 8, 9][Math.floor(Math.random() * 3)];
  const suffix = [...Array(len)]
    .map(() => Math.floor(Math.random() * 10))
    .join("");
  const phone = `09${suffix}`;
  return phone;
}

function generateTestEmail() {
  const timestamp = Date.now()
  return `test-${timestamp}@example.com`
}

describe("submitContact()", () => {
  it("should handle successful contact submission", async () => {
    const testData: ContactInput = {
      firstName: "John",
      lastName: "Doe",
      phone: generateTestPhoneNumber(),
      email: generateTestEmail(),        
    };

    const result = await submitContact(testData);
    expect(result).toHaveProperty("id");
    expect(result.email).toBe(testData.email);  
  });
});
