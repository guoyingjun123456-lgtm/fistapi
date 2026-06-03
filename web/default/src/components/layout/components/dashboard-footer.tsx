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
import { useSystemConfig } from '@/hooks/use-system-config'

/**
 * Slim footer shown at the bottom of the authenticated dashboard.
 * One quiet line: logo + brand name. Stays out of the way.
 */
export function DashboardFooter() {
  const { logo } = useSystemConfig()

  return (
    <footer className='border-border/40 text-muted-foreground flex shrink-0 items-center justify-center gap-2 border-t px-4 py-2 text-xs'>
      {logo ? (
        <img
          src={logo}
          alt='FirstAPI'
          className='h-3.5 w-auto object-contain opacity-80'
        />
      ) : null}
      <span className='text-foreground/80 font-semibold tracking-tight'>
        FirstAPI
      </span>
      <span className='text-muted-foreground/50'>·</span>
      <span className='text-muted-foreground/70'>智能 AI API 网关</span>
    </footer>
  )
}
