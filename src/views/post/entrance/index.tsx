import fairMaidenImage from '@/views/post/assets/images/bg-fair-maiden.png'
import literatiImage from '@/views/post/assets/images/bg-literati.png'
import magnificentLandImage from '@/views/post/assets/images/bg-magnificent-land.png'
import mortalWorldImage from '@/views/post/assets/images/bg-mortal-world.png'

const postCategories = [
  {
    title: '大好山河',
    subtitle: 'Magnificent Land',
    image: magnificentLandImage,
  },
  {
    title: '窈窕淑女',
    subtitle: 'Fair Maiden',
    image: fairMaidenImage,
  },
  {
    title: '文人墨客',
    subtitle: 'Literati',
    image: literatiImage,
  },
  {
    title: '凡尘俗世',
    subtitle: 'Mortal World',
    image: mortalWorldImage,
  },
]

export default function PostEntrance() {
  return (
    <section className="py-8 sm:py-10 md:py-12 lg:py-16">
      <div className="base-container">
        <div className="flex flex-col gap-4 md:gap-5">
          {postCategories.map(category => (
            <article
              key={category.title}
              className="group relative min-h-40 overflow-hidden border border-white/80 bg-white/10 shadow-sm sm:min-h-48 md:min-h-56 lg:min-h-64 dark:bg-white/5"
            >
              <img
                src={category.image}
                alt=""
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
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
