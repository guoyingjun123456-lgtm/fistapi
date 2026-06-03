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
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Flame, ShieldCheck, TrendingDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/auth-store'
import { formatNumber, formatQuota } from '@/lib/format'
import { computeTimeRange } from '@/lib/time'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { getUserQuotaDates } from '@/features/dashboard/api'

function getRunwayDays(
  remainQuota: number,
  recentUsage: number
): number | null {
  if (remainQuota <= 0 || recentUsage <= 0) return null
  const days = remainQuota / recentUsage
  if (!Number.isFinite(days)) return null
  return days
}

type HealthLevel = 'healthy' | 'caution' | 'critical'

function getHealthLevel(remainQuota: number, recentUsage: number): HealthLevel {
  if (remainQuota <= 0) return 'critical'
  const days = getRunwayDays(remainQuota, recentUsage)
  if (days !== null && days < 3) return 'caution'
  return 'healthy'
}

const HEALTH_CONFIG: Record<
  HealthLevel,
  { dotClass: string; labelKey: string }
> = {
  healthy: {
    dotClass: 'bg-success',
    labelKey: 'Healthy',
  },
  caution: {
    dotClass: 'bg-warning',
    labelKey: 'Low balance',
  },
  critical: {
    dotClass: 'bg-destructive',
    labelKey: 'Balance depleted',
  },
}

/**
 * Credit-remaining panel: donut of remaining vs used quota, balance legend,
 * 24h usage / runway, and a shortcut to the wallet.
 *
 * Self-contained — fetches its own quota trend. The query key matches the
 * overview summary cards, so React Query dedupes the request.
 */
export function CreditRemainingPanel() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.auth.user)

  const remainQuota = Number(user?.quota ?? 0)
  const usedQuota = Number(user?.used_quota ?? 0)
  const totalQuota = remainQuota + usedQuota
  const usedPct =
    totalQuota > 0 ? Math.min(100, (usedQuota / totalQuota) * 100) : 0
  const remainPct = totalQuota > 0 ? 100 - usedPct : 0

  const summaryTimeRange = useMemo(() => computeTimeRange(1), [])
  const usageTrendQuery = useQuery({
    queryKey: [
      'dashboard',
      'overview',
      'summary-sparklines',
      summaryTimeRange.start_timestamp,
      summaryTimeRange.end_timestamp,
    ],
    queryFn: async () =>
      getUserQuotaDates({
        start_timestamp: summaryTimeRange.start_timestamp,
        end_timestamp: summaryTimeRange.end_timestamp,
        default_time: 'hour',
      }),
    staleTime: 60 * 1000,
  })

  const recentUsage = useMemo(
    () =>
      (usageTrendQuery.data?.data ?? []).reduce(
        (total, item) => total + (Number(item.quota) || 0),
        0
      ),
    [usageTrendQuery.data?.data]
  )

  const healthLevel = getHealthLevel(remainQuota, recentUsage)
  const healthCfg = HEALTH_CONFIG[healthLevel]
  const runwayDays = getRunwayDays(remainQuota, recentUsage)

  return (
    <div className='bg-background/75 flex h-full flex-col justify-between gap-4 rounded-2xl border p-4 shadow-sm backdrop-blur'>
      <div className='flex flex-col gap-3.5'>
        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground text-xs font-medium'>
            {t('Credit remaining')}
          </span>
          <span className='flex items-center gap-1.5'>
            <span
              className={cn('size-1.5 rounded-full', healthCfg.dotClass)}
              aria-hidden='true'
            />
            <span className='text-muted-foreground text-[11px] font-medium'>
              {t(healthCfg.labelKey)}
            </span>
          </span>
        </div>

        <div className='flex items-center gap-4'>
          <div
            className='relative size-24 shrink-0 rounded-full'
            style={{
              background: `conic-gradient(var(--primary) ${remainPct}%, color-mix(in oklch, var(--muted-foreground) 20%, transparent) ${remainPct}% 100%)`,
            }}
            role='img'
            aria-label={`${t('Remaining')} ${Math.round(remainPct)}%`}
          >
            <div className='bg-card absolute inset-[16%] flex flex-col items-center justify-center rounded-full shadow-xs'>
              <span className='text-muted-foreground text-[10px] leading-none'>
                {t('Remaining')}
              </span>
              <span className='mt-1 text-base leading-none font-semibold tabular-nums'>
                {Math.round(remainPct)}%
              </span>
            </div>
          </div>
          <div className='flex min-w-0 flex-col gap-2.5'>
            <div className='flex items-center gap-2'>
              <span
                className='bg-primary size-2 shrink-0 rounded-full'
                aria-hidden='true'
              />
              <div className='min-w-0'>
                <div className='text-muted-foreground text-[11px] leading-none'>
                  {t('Remaining')}
                </div>
                <div className='text-foreground truncate font-mono text-sm font-semibold'>
                  {formatQuota(remainQuota)}
                </div>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <span
                className='bg-muted-foreground/30 size-2 shrink-0 rounded-full'
                aria-hidden='true'
              />
              <div className='min-w-0'>
                <div className='text-muted-foreground text-[11px] leading-none'>
                  {t('Used')}
                </div>
                <div className='text-foreground truncate font-mono text-sm font-semibold'>
                  {formatQuota(usedQuota)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <div className='bg-card/70 rounded-lg px-2.5 py-2'>
            <div className='text-muted-foreground flex items-center gap-1 text-[11px] leading-none font-medium'>
              <Flame className='size-3 shrink-0' aria-hidden='true' />
              <span className='truncate'>{t('Last 24h usage')}</span>
            </div>
            <div className='text-foreground mt-1.5 truncate text-xs font-semibold tabular-nums'>
              {formatQuota(recentUsage)}
            </div>
          </div>
          <div className='bg-card/70 rounded-lg px-2.5 py-2'>
            <div className='text-muted-foreground flex items-center gap-1 text-[11px] leading-none font-medium'>
              {runwayDays !== null && runwayDays < 3 ? (
                <TrendingDown className='size-3 shrink-0' aria-hidden='true' />
              ) : (
                <ShieldCheck className='size-3 shrink-0' aria-hidden='true' />
              )}
              <span className='truncate'>{t('Runway')}</span>
            </div>
            <div
              className={cn(
                'mt-1.5 truncate text-xs font-semibold tabular-nums',
                healthLevel === 'critical' && 'text-destructive',
                healthLevel === 'caution' && 'text-warning'
              )}
            >
              {runwayDays !== null
                ? runwayDays < 1
                  ? t('Less than 1 day left')
                  : runwayDays > 999
                    ? `999+ ${t('days')}`
                    : `~${formatNumber(Math.floor(runwayDays))} ${t('days')}`
                : remainQuota <= 0
                  ? t('Balance depleted')
                  : t('No recent usage')}
            </div>
          </div>
        </div>
      </div>

      <Button className='justify-between' render={<Link to='/wallet' />}>
        <span>{t('Wallet')}</span>
        <ArrowRight data-icon='inline-end' />
      </Button>
    </div>
  )
}
