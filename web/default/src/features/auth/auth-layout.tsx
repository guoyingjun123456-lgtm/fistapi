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
import { useTranslation } from 'react-i18next'
import { useSystemConfig } from '@/hooks/use-system-config'
import { Skeleton } from '@/components/ui/skeleton'
import { AuthBackground } from './components/auth-background'
import { AuthLLMVisual } from './components/auth-llm-visual'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useTranslation()
  const { systemName, logo, loading } = useSystemConfig()

  return (
    <div className='bg-muted/30 relative min-h-svh overflow-hidden'>
      <AuthBackground />

      <div className='relative z-10 flex min-h-svh items-center justify-center gap-6 px-4 lg:gap-10'>
        {/* Left: dynamic large-language-model visual (large screens only) */}
        <div className='hidden w-full max-w-lg shrink lg:block'>
          <AuthLLMVisual />
        </div>

        {/* Right: form */}
        <div className='w-full max-w-md shrink-0'>
          <div className='animate-appear w-full'>
            {/* Logo & brand */}
            <Link
              to='/'
              className='mb-8 flex items-center justify-center gap-2.5 transition-opacity hover:opacity-80'
            >
              <div className='relative h-7 w-7'>
                {loading ? (
                  <Skeleton className='absolute inset-0 rounded' />
                ) : (
                  <img
                    src={logo}
                    alt={t('Logo')}
                    className='h-7 w-7 object-contain'
                  />
                )}
              </div>
              {loading ? (
                <Skeleton className='h-6 w-24' />
              ) : (
                <span className='text-foreground text-xl font-semibold'>
                  {systemName}
                </span>
              )}
            </Link>

            {/* Card */}
            <div className='bg-background/80 border-border/50 supports-[backdrop-filter]:bg-background/65 rounded-2xl border p-8 shadow-xl backdrop-blur-xl sm:p-10'>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
