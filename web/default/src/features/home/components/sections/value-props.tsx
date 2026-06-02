import { Globe, Shield, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SectionContainer } from '../section-container'
import { AnimateInView } from '@/components/animate-in-view'

export function ValueProps() {
  const { t } = useTranslation()

  const props = [
    {
      icon: <Zap className='size-6' strokeWidth={1.5} />,
      title: t('valueProps.speed.title'),
      desc: t('valueProps.speed.desc'),
    },
    {
      icon: <Globe className='size-6' strokeWidth={1.5} />,
      title: t('valueProps.global.title'),
      desc: t('valueProps.global.desc'),
    },
    {
      icon: <Shield className='size-6' strokeWidth={1.5} />,
      title: t('valueProps.trust.title'),
      desc: t('valueProps.trust.desc'),
    },
  ]

  return (
    <section className='relative z-10 py-10 md:py-14'>
      <SectionContainer>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6'>
          {props.map((p, i) => (
            <AnimateInView
              key={i}
              delay={i * 80}
              animation='fade-up'
              className='flex flex-col items-start text-left'
            >
              <div className='text-primary mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10'>
                {p.icon}
              </div>
              <h3 className='text-base font-semibold tracking-tight'>
                {p.title}
              </h3>
              <p className='text-muted-foreground mt-1.5 max-w-[16rem] text-sm leading-relaxed'>
                {p.desc}
              </p>
            </AnimateInView>
          ))}
        </div>
      </SectionContainer>
    </section>
  )
}
