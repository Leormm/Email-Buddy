import './globals.css'

export const metadata = {
  title: 'Email Buddy',
  description: 'Your sending sidekick for cold outreach and follow-ups',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
