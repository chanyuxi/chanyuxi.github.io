import { Bone } from 'lucide-react'

import { Hero } from './components/Hero'

import Header from '@/layouts/Header'

export default function Index() {
  return (
    <main>
      <Header></Header>
      <Hero></Hero>

      <div className="bg-dark-900">
        <div className="main-container py-8">
          <div className="flex items-center gap-2 text-xl mb-6">
            <Bone />
            <span>Skills</span>
          </div>

          <div className="flex gap-6">
            <div className="rounded-lg bg-dark-700 w-1/4 p-4">
              Vite
              <p>Vite is a blazing fast frontend build tool powering the next generation of web applications. </p>
            </div>

            <div className="rounded-lg bg-dark-700 w-1/4 p-4">
              Vite
              <p>Vite is a blazing fast frontend build tool powering the next generation of web applications. </p>
            </div>

            <div className="rounded-lg bg-dark-700 w-1/4 p-4">
              Vite
              <p>Vite is a blazing fast frontend build tool powering the next generation of web applications. </p>
            </div>

            <div className="rounded-lg bg-dark-700 w-1/4 p-4">
              Vite
              <p>Vite is a blazing fast frontend build tool powering the next generation of web applications. </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
