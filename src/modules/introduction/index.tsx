import { ExperienceSection } from './components/experience-section'
import { HeroSection } from './components/hero-section'
import { SkillsSection } from './components/skills-section'

export default function Introduction() {
  return (
    <div>
      <HeroSection />
      <SkillsSection />
      <ExperienceSection />
    </div>
  )
}
