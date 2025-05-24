"use server"

import Client from "android-sms-gateway";

const httpFetchClient = {
  get: async (url: string, headers?: Record<string, string>) => {
    const res = await fetch(url, { method: "GET", headers });
    return res.json();
  },
  post: async (url: string, body: any, headers?: Record<string, string>) => {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    return res.json();
  },
  delete: async (url: string, headers?: Record<string, string>) => {
    const res = await fetch(url, { method: "DELETE", headers });
    return res.json();
  },
};

interface CloudSMSPayload {
  username: string;
  password: string;
  phoneNumbers: string[];
  message: string;
}

export async function sendSMSCloud({
  username,
  password,
  phoneNumbers,
  message,
}: CloudSMSPayload) {
  const client = new Client(username, password, httpFetchClient);
  try {
    const messageState = await client.send({ phoneNumbers, message });
    return { success: true, data: messageState };
  } catch (error: any) {
    return { success: false, error: error.message || String(error) };
  }
}
