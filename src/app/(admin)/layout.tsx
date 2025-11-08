import Layout from "@/components/Layout/Layout"
import PageWithTopBar from "@/components/PageWithTopBar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      
      <body>
        <Layout children = {children}/>
        
      </body>
      
    </html>
  )
}