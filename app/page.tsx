"use client"

import { useState } from "react"
import { sendSMSCloud } from "./actions/send-sms-cloud"
import { sendSMSLocal } from "./actions/send-sms-local"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Loader2, Send, Plus, Trash2 } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

export default function SMSApiTester() {
  const [credentials, setCredentials] = useState({
    username: "username",
    password: "password",
  })
  const [endpoint, setEndpoint] = useState("http://192.168.1.11:8080/message")
  const [message, setMessage] = useState("Hi! There")
  const [phoneNumbers, setPhoneNumbers] = useState(["+921234567898"])
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [useCloud, setUseCloud] = useState(true)

  const isFormValid =
    credentials.username &&
    credentials.password &&
    message.trim() &&
    phoneNumbers.some((num) => num.trim()) &&
    (useCloud || endpoint.trim())

  const handlePhoneChange = (index: number, value: string) => {
    setPhoneNumbers((prev) => {
      const copy = [...prev]
      copy[index] = value
      return copy
    })
  }

  const addPhoneNumber = () => setPhoneNumbers((prev) => [...prev, ""])

  const removePhoneNumber = (index: number) => {
    setPhoneNumbers((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResponse(null)

    try {
      const validPhoneNumbers = phoneNumbers.filter((num) => num.trim() !== "")
      if (validPhoneNumbers.length === 0)
        throw new Error("Please add at least one phone number")

      let result
      if (useCloud) {
        result = await sendSMSCloud({
          username: credentials.username,
          password: credentials.password,
          message,
          phoneNumbers: validPhoneNumbers,
        })
      } else {
        result = await sendSMSLocal({
          endpoint,
          username: credentials.username,
          password: credentials.password,
          message,
          phoneNumbers: validPhoneNumbers,
        })
      }

      if (result.success) {
        setResponse(result.data)
      } else {
        setError(result.error || "Failed to send SMS")
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <Card className="shadow-xl border-0 rounded-2xl overflow-hidde pt-0">
            <CardHeader className=" bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-t-2xl p-6">
              <CardTitle className="text-3xl flex items-center gap-3 font-bold">
                <Send className="w-7 h-7" />
                SMS API Tester
              </CardTitle>
              <CardDescription className="text-sky-100 mt-1">
                Send test SMS using your custom API
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-7 p-7 bg-white">
              <form
                onSubmit={handleSubmit}
                className="space-y-7"
                autoComplete="off"
              >
                <div className="flex items-center gap-3">
                  <input
                    id="toggle-cloud"
                    type="checkbox"
                    checked={useCloud}
                    onChange={() => setUseCloud((v) => !v)}
                    className="accent-indigo-600 w-5 h-5 transition"
                  />
                  <Label
                    htmlFor="toggle-cloud"
                    className="select-none text-lg font-medium"
                  >
                    Use Cloud API
                  </Label>
                </div>

                <AnimatePresence>
                  {!useCloud && (
                    <motion.div
                      key="endpoint"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Label
                        htmlFor="endpoint"
                        className="block text-sm font-semibold mb-1"
                      >
                        Local API Endpoint
                      </Label>
                      <Input
                        id="endpoint"
                        type="url"
                        value={endpoint}
                        onChange={(e) => setEndpoint(e.target.value)}
                        placeholder="http://localhost:8080/message"
                        required={!useCloud}
                        className="focus:ring-2 focus:ring-indigo-400 transition"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <Label
                    htmlFor="username"
                    className="block text-sm font-semibold mb-1"
                  >
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={credentials.username}
                    onChange={(e) =>
                      setCredentials((c) => ({
                        ...c,
                        username: e.target.value,
                      }))
                    }
                    required
                    className="focus:ring-2 focus:ring-indigo-400 transition"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="password"
                    className="block text-sm font-semibold mb-1"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials((c) => ({
                        ...c,
                        password: e.target.value,
                      }))
                    }
                    required
                    className="focus:ring-2 focus:ring-indigo-400 transition"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="message"
                    className="block text-sm font-semibold mb-1"
                  >
                    Message
                  </Label>
                  <Input
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="focus:ring-2 focus:ring-indigo-400 transition"
                  />
                </div>

                <div>
                  <Label className="block text-sm font-semibold mb-2">
                    Phone Numbers
                  </Label>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {phoneNumbers.map((phone, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -30 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-2"
                        >
                          <Input
                            value={phone}
                            onChange={(e) =>
                              handlePhoneChange(i, e.target.value)
                            }
                            placeholder="+1234567890"
                            required
                            className="focus:ring-2 focus:ring-indigo-400 transition"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoneNumber(i)}
                            className="p-1 rounded-full hover:bg-red-100 transition"
                            aria-label="Remove phone number"
                            tabIndex={0}
                          >
                            <Trash2 className="w-5 h-5 text-red-500" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={addPhoneNumber}
                    className="mt-2 flex items-center gap-1 text-indigo-600 hover:bg-indigo-50 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Add Phone Number
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  size="lg"
                  className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-semibold shadow-lg transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send SMS
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-4">
          <AnimatePresence>
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border border-red-400 bg-red-50 text-red-700 p-4 shadow">
                  <strong>Error:</strong> {error}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {response && (
              <motion.div
                key="response"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border border-green-400 bg-green-50 text-green-700 p-4 shadow">
                  <pre className="whitespace-pre-wrap break-all">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
