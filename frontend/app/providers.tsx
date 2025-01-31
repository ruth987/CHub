"use client"

import { ThemeProvider } from "@/components/providers/theme-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { Toaster } from "@/components/ui/toaster"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
      >
          {children}
          <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  )
}