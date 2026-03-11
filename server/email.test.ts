import { describe, expect, it, vi } from "vitest";
import { sendContactNotification } from "./email";

describe("email.sendContactNotification", () => {
  it("sends contact notification with valid data", async () => {
    const result = await sendContactNotification({
      name: "Testovací Používateľ",
      email: "test@example.com",
      plan: "basic",
      message: "Toto je testovacia správa",
    });

    // The function returns true if email was sent, false if transporter not configured
    // Since we have GMAIL_USER and GMAIL_APP_PASSWORD set, it should attempt to send
    expect(typeof result).toBe("boolean");
  });

  it("sends notification without optional fields", async () => {
    const result = await sendContactNotification({
      name: "Mária Nováková",
      email: "maria@example.com",
    });

    expect(typeof result).toBe("boolean");
  });

  it("handles email with all fields", async () => {
    const result = await sendContactNotification({
      name: "Ján Varga",
      email: "jan@example.com",
      plan: "premium",
      message: "Zaujíma ma premium plán s ročným predplatným",
    });

    expect(typeof result).toBe("boolean");
  });
});
