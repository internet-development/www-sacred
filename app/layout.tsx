import Script from 'next/script';

import Providers from '@components/Providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-us">
      <body className="theme-light">
        <Providers>{children}</Providers>
        <Script
          src="https://api.internet.dev/analytics/v1.js"
          data-site-id="77b81b4c-77f7-4a4d-8dd7-fbf2a66912eb"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
