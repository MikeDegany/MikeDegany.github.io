import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-8">The project you're looking for doesn't exist or has been moved.</p>
          <Link href="/#projects">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Back to Projects</Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
