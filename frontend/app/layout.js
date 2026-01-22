import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'Multi-Step Form Application',
  description: 'Production-ready multi-step form with clean architecture',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}


