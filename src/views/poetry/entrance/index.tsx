import { Link } from 'react-router'

import { poetryCategories } from '../manifest'

export default function PoetryEntrance() {
  return (
    <section className="py-10 md:py-12 lg:py-16">
      <div className="base-container">
        <div className="flex flex-col gap-4 md:gap-6">
          {poetryCategories.map((category, index) => {
            return (
              <Link
                key={category.slug}
                to={`/poetry/${category.slug}`}
                className="group relative min-h-40 cursor-pointer overflow-hidden border shadow-sm sm:min-h-48 md:min-h-56 lg:min-h-64 dark:border-white/90"
              >
                <img
                  src={category.image}
                  srcSet={category.imageSrcSet}
                  sizes="(min-width: 1280px) 1040px, (min-width: 1024px) 800px, 100vw"
                  alt={category.alt}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.02] group-hover:grayscale-0 sm:grayscale"
                />
                <div className="absolute inset-0 hidden bg-black/20 transition duration-500 group-hover:bg-transparent sm:block" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <h1 className="font-mashanzheng text-3xl tracking-wide sm:text-4xl md:text-5xl">
                    {category.title}
                  </h1>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
