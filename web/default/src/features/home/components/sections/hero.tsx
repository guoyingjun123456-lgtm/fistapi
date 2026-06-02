/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { HeroTerminalDemo } from '../hero-terminal-demo'
import { SectionContainer } from '../section-container'

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

export function Hero(_props: HeroProps) {
  const { t } = useTranslation()

  return (
    <section className='relative z-10 overflow-hidden pt-20 pb-12 md:pt-28 md:pb-16'>
      {/* Layered aurora glow */}
      <div aria-hidden className='pointer-events-none absolute inset-0 -z-10'>
        <div
          className='absolute -top-1/4 left-1/2 h-[42rem] w-[60rem] -translate-x-1/2 rounded-full opacity-60 blur-[120px]'
          style={{
            background:
              'radial-gradient(circle at 30% 40%, oklch(0.72 0.16 256 / 0.45), transparent 60%), radial-gradient(circle at 70% 50%, oklch(0.68 0.18 295 / 0.40), transparent 55%)',
          }}
        />
        <div
          className='absolute top-1/3 left-1/2 h-[30rem] w-[40rem] -translate-x-1/2 rounded-full opacity-50 blur-[100px]'
          style={{
            background:
              'radial-gradient(circle, oklch(0.7 0.15 200 / 0.35), transparent 60%)',
          }}
        />
      </div>
      {/* Fine grid */}
      <div
        aria-hidden
        className='absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_20%,black_5%,transparent_70%)] bg-[size:4rem_4rem] opacity-40'
      />

      <SectionContainer className='flex flex-col items-start text-left'>
        {/* Glass badge */}
        <div
          className='landing-animate-fade-up border-border/60 bg-background/60 ring-border/40 mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[13px] font-medium opacity-0 shadow-sm ring-1 backdrop-blur-xl'
          style={{ animationDelay: '0ms' }}
        >
          <span className='relative flex size-2'>
            <span className='bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75' />
            <span className='bg-primary relative inline-flex size-2 rounded-full' />
          </span>
          <span className='text-foreground/80'>
            {t('hero.badge.globalDelivery')}
          </span>
        </div>

        {/* Headline */}
        <h1
          className='landing-animate-fade-up max-w-4xl text-[clamp(2.5rem,6.5vw,4.5rem)] leading-[1.06] font-bold tracking-tight'
          style={{ animationDelay: '60ms' }}
        >
          <span className='text-foreground'>{t('hero.title.line1')}</span>
          <br />
          <span className='from-primary bg-gradient-to-r via-[oklch(0.62_0.2_290)] to-[oklch(0.66_0.16_210)] bg-clip-text text-transparent'>
            {t('hero.title.line2')}
          </span>
        </h1>

        <p
          className='landing-animate-fade-up text-muted-foreground mt-4 max-w-lg text-sm leading-relaxed opacity-0 md:text-base'
          style={{ animationDelay: '120ms' }}
        >
          {t('hero.subtitle.global')}
        </p>

        {/* CTA buttons */}
        <div
          className='landing-animate-fade-up mt-7 flex flex-wrap items-center gap-3 opacity-0'
          style={{ animationDelay: '160ms' }}
        >
          <Button
            className='group h-11 rounded-full px-7 text-sm font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/35'
            render={<Link to='/sign-up' />}
          >
            {t('Get Started')}
            <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-1' />
          </Button>
          <Button
            variant='outline'
            className='border-border/60 bg-background/50 hover:bg-muted/60 h-11 rounded-full border px-7 text-sm font-medium backdrop-blur-xl transition-colors'
            render={<a href='mailto:support@quantumnous.com' />}
          >
            {t('Contact Us')}
          </Button>
        </div>

        {/* Trusted-by logo band */}
        <div
          className='landing-animate-fade-up mt-10 w-full opacity-0'
          style={{ animationDelay: '200ms' }}
        >
          <p className='text-muted-foreground/50 mb-4 text-xs font-medium tracking-widest uppercase'>
            {t('Supported Models')}
          </p>
          <HeroTerminalDemo />
        </div>
      </SectionContainer>
    </section>
  )
}
