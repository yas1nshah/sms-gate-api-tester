# SMS API Tester Component

A React component with server actions to send SMS messages via either a **cloud SMS gateway** using the [`android-sms-gateway`](https://www.npmjs.com/package/android-sms-gateway) library or a **local SMS gateway API** with Basic Auth.

---

## Features

* Toggle between **Cloud SMS API** and **Local SMS API** modes.
* Enter credentials (username/password) directly in the UI.
* Customize the local API endpoint URL.
* Send SMS messages to multiple phone numbers.
* Server-side API calls eliminate CORS issues.
* Uses Shadcn/UI components for a clean and accessible UI.
* Displays live success/error responses.
* Loading state feedback with spinner icon.

---

## Installation

1. Install dependencies (if not already):

```bash
npm install android-sms-gateway lucide-react
```

2. Ensure you have the Shadcn/UI components installed or adjust imports accordingly.

---

## Usage

### How to use in your Next.js app
Import the server actions (sendCloudSMS, sendLocalSMS) into your page.

Use them inside client components by calling the async server action functions to send SMS.

Use the provided SMSApiTester component or create your own page that uses these server actions.

---

### Notes

* `sendCloudSMS` and `sendLocalSMS` are server actions exported from your server code.
* Client components can call these server actions via async functions.
* Use React state and UI to manage form inputs and display responses.
* This approach helps avoid CORS issues by running API calls server-side.


---

### Server Actions

* **Cloud SMS**: Uses `android-sms-gateway` client with basic auth internally.
* **Local SMS**: Sends a POST request with basic auth header to your local API.

Make sure your server supports server actions (Next.js 13+ app directory recommended).

---

## Props

This component manages all state internally and does not accept any props.

---

## How it Works

1. **Toggle mode** to select cloud or local SMS API.
2. Fill in **username** and **password** credentials.
3. If local, enter your local API endpoint URL.
4. Enter **one or more phone numbers** to send SMS to.
5. Enter the **SMS message text**.
6. Click **Send SMS**.
7. See success or error response below the form.

---

## Notes

* This component uses server actions (`"use server"`) for API calls to avoid CORS issues.
* Cloud SMS mode relies on the `android-sms-gateway` npm package.
* Local SMS mode expects a REST API endpoint that accepts POST with Basic Auth and JSON `{ phoneNumbers, message }`.
* Adjust styles or imports if you are not using Shadcn/UI.

---

## License

MIT

---

If you want me to help with deploying or customizing this component further, just ask!
