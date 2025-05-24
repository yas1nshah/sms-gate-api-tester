"use server"

interface LocalSMSPayload {
  endpoint: string;
  username: string;
  password: string;
  phoneNumbers: string[];
  message: string;
}

export async function sendSMSLocal({
  endpoint,
  username,
  password,
  phoneNumbers,
  message,
}: LocalSMSPayload) {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
      },
      body: JSON.stringify({ phoneNumbers, message }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to send SMS");
    }
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || String(error) };
  }
}
