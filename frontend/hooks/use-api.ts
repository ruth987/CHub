import { useAuth } from "@/components/providers/auth-provider"

export function useApi() {
  const { user } = useAuth()

  const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const headers = {
      "Content-Type": "application/json",
      ...(user && { Authorization: `Bearer ${user.accessToken}` }),
      ...options.headers,
    }

    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error("API request failed")
    }

    return response.json()
  }

  return { fetchApi }
}