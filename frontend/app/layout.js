import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'Multi-Step Form',
  description: 'Multi-step form application',
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
