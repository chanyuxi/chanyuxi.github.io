import { Link } from 'react-router'

import { poetryCategories } from '../manifest'

export default function PoetryEntrance() {
  return (
    <section className="py-8 sm:py-10 md:py-12 lg:py-16">
      <div className="base-container">
        <div className="flex flex-col gap-4 md:gap-5">
          {poetryCategories.map((category, index) => {
            return (
              <Link
                key={category.slug}
                to={`/poetry/${category.slug}`}
                className="group relative min-h-40 cursor-pointer overflow-hidden border bg-white/10 shadow-sm sm:min-h-48 md:min-h-56 lg:min-h-64 dark:border-white/80 dark:bg-white/5"
              >
                <img
                  src={category.image}
                  srcSet={category.imageSrcSet}
                  sizes="(min-width: 1280px) 1040px, (min-width: 1024px) 800px, 100vw"
                  alt={category.alt}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover grayscale transition duration-500 ease-out group-hover:scale-[1.02] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-black/35 transition duration-500 group-hover:bg-black/20" />

                <div className="relative flex h-full min-h-40 flex-col items-center justify-center px-6 py-12 text-center text-white sm:min-h-48 md:min-h-56 lg:min-h-64">
                  <h1 className="font-mashanzheng text-3xl tracking-wide sm:text-4xl md:text-5xl">
                    {category.title}
                  </h1>
                  <p className="mt-3 text-base tracking-[0.28em] uppercase opacity-85 sm:text-lg md:text-xl">
                    {category.subtitle}
                  </p>
                  <p className="mt-4 text-sm opacity-80">
                    {category.posts.length} poems
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
