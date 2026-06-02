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
import {
  Zap,
  Shield,
  Globe,
  Code,
  Gauge,
  DollarSign,
  Users,
  HeartHandshake,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AnimateInView } from '@/components/animate-in-view'
import { SectionContainer } from '../section-container'

interface FeaturesProps {
  className?: string
}

export function Features(_props: FeaturesProps) {
  const { t } = useTranslation()

  const features = [
    {
      id: 'fast',
      num: '01',
      title: t('Lightning Fast'),
      desc: t(
        'Optimized network architecture ensures millisecond response times'
      ),
      span: 'md:col-span-2',
      icon: <Zap className='size-6 text-primary' />,
      visual: (
        <div className='mt-4 grid grid-cols-3 gap-px bg-border/60 border border-border/60'>
          {['通义千问', 'DeepSeek', 'Kimi', '智谱', '豆包', '文心一言'].map(
            (name) => (
              <div
                key={name}
                className='bg-card text-muted-foreground hover:text-primary flex items-center justify-center px-3 py-2 font-mono text-xs transition-colors duration-200'
              >
                {name}
              </div>
            )
          )}
        </div>
      ),
    },
    {
      id: 'secure',
      num: '02',
      title: t('Secure & Reliable'),
      desc: t(
        'Enterprise-grade security with comprehensive permission management'
      ),
      span: 'md:col-span-1',
      icon: <Shield className='size-6 text-success' />,
      visual: (
        <div className='mt-4 flex items-center justify-center'>
          <div className='relative'>
            <div className='flex size-16 items-center justify-center rounded-2xl border border-success/20 bg-success/5'>
              <Shield
                className='size-7 text-success/70'
                strokeWidth={1.5}
              />
            </div>
            <div className='absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-success'>
              <svg
                className='size-2.5 text-white'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={3}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='m4.5 12.75 6 6 9-13.5'
                />
              </svg>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'global',
      num: '03',
      title: t('Global Coverage'),
      desc: t('Multi-region deployment for stable global access'),
      span: 'md:col-span-1',
      icon: <Globe className='size-6 text-primary' />,
      visual: (
        <div className='mt-4 space-y-2'>
          {[t('Load Balancing'), t('Rate Limiting'), t('Cost Tracking')].map(
            (step, i) => (
              <div key={step} className='flex items-center gap-2'>
                <div
                  className={`flex size-6 items-center justify-center rounded-full text-[10px] font-bold ${
                    i === 1
                      ? 'border border-primary/30 bg-primary/20 text-primary'
                      : 'border-border/40 bg-muted text-muted-foreground border'
                  }`}
                >
                  {i + 1}
                </div>
                <div className='bg-border/40 h-px flex-1' />
                <span className='text-muted-foreground text-xs'>{step}</span>
              </div>
            )
          )}
        </div>
      ),
    },
    {
      id: 'developer',
      num: '04',
      title: t('Developer Friendly'),
      desc: t('Compatible API routes for common AI application workflows'),
      span: 'md:col-span-2',
      icon: <Code className='size-6 text-primary' />,
      visual: (
        <div className='mt-4 flex flex-wrap items-center gap-2'>
          {['API', 'SDK', 'CLI', 'Docs'].map((n) => (
            <span
              key={n}
              className='border-border/60 text-muted-foreground border px-2 py-1 font-mono text-[11px]'
            >
              {n}
            </span>
          ))}
          <span className='text-muted-foreground/70 ml-1 flex items-center gap-1.5 font-mono text-[11px]'>
            <Code className='size-3.5 text-primary' />
            {t('Multi-protocol Compatible')}
          </span>
        </div>
      ),
    },
  ]

  const additionalFeatures = [
    {
      icon: <Gauge className='size-5' strokeWidth={1.5} />,
      title: t('High Performance'),
      desc: t('Support for high concurrency with automatic load balancing'),
    },
    {
      icon: <DollarSign className='size-5' strokeWidth={1.5} />,
      title: t('Transparent Billing'),
      desc: t('Pay-as-you-go with real-time usage monitoring'),
    },
    {
      icon: <Users className='size-5' strokeWidth={1.5} />,
      title: t('Team Collaboration'),
      desc: t('Multi-user management with flexible permission allocation'),
    },
    {
      icon: <HeartHandshake className='size-5' strokeWidth={1.5} />,
      title: t('Open Source'),
      desc: t('Community driven, self-hosted, and extensible'),
    },
  ]

  return (
    <section className='relative z-10 pt-8 pb-10 md:pt-10 md:pb-12'>
      <SectionContainer>
        <AnimateInView className='mb-12 max-w-lg'>
          <p className='text-muted-foreground/70 mb-3 font-mono text-xs tracking-tight'>
            <span className='text-primary'>~/</span>core-features{' '}
            <span className='text-primary'>--list</span>
          </p>
          <h2 className='text-2xl leading-tight font-bold tracking-tight md:text-3xl'>
            {t('Built for developers,')}
            <br />
            {t('designed for scale')}
          </h2>
        </AnimateInView>

        {/* Terminal-style connected grid: shared hairlines, square corners, mono */}
        <div className='border-border grid grid-cols-1 overflow-hidden rounded-md border md:grid-cols-3'>
          {features.map((f, i) => (
            <AnimateInView
              key={f.id}
              delay={i * 80}
              animation='fade-up'
              className={`group border-border bg-card hover:bg-muted/30 relative border-b p-6 transition-colors duration-200 last:border-b-0 md:border-r md:border-b-0 md:p-7 [&:nth-child(3n)]:md:border-r-0 ${f.span}`}
            >
              {/* hover accent bar on the left, like a selected editor line */}
              <span className='bg-primary absolute top-0 bottom-0 left-0 w-0.5 origin-top scale-y-0 transition-transform duration-200 group-hover:scale-y-100' />

              <div className='mb-4 flex items-center justify-between font-mono text-xs'>
                <span className='text-primary'>[{f.num}]</span>
                <span className='text-muted-foreground/40 group-hover:text-primary transition-colors'>
                  {f.icon}
                </span>
              </div>
              <h3 className='font-mono text-sm font-semibold tracking-tight'>
                <span className='text-primary'>// </span>
                {f.title}
              </h3>
              <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
                {f.desc}
              </p>
              {f.visual}
            </AnimateInView>
          ))}
        </div>

        {/* Additional features row */}
        <div className='mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4'>
          {additionalFeatures.map((f, i) => (
            <AnimateInView
              key={f.title}
              delay={i * 100}
              animation='fade-up'
              className='group/feat border-border/60 bg-card hover:border-primary/30 relative flex flex-col items-start overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:shadow-md'
            >
              {/* subtle corner glow on hover */}
              <div
                aria-hidden
                className='from-primary/8 pointer-events-none absolute -top-8 -right-8 size-24 rounded-full bg-gradient-to-br to-transparent opacity-0 blur-2xl transition-opacity duration-300 group-hover/feat:opacity-100'
              />
              <div className='text-primary mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-300 group-hover/feat:scale-105'>
                {f.icon}
              </div>
              <h3 className='mb-1.5 text-sm font-semibold tracking-tight'>
                {f.title}
              </h3>
              <p className='text-muted-foreground text-xs leading-relaxed'>
                {f.desc}
              </p>
            </AnimateInView>
          ))}
        </div>
      </SectionContainer>
    </section>
  )
}
