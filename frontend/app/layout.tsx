import { Providers } from "./providers"
import "./globals.css"  
import GoogleAnalytics from '@/components/GoogleAnalytics'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <GoogleAnalytics />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}