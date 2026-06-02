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

/**
 * Ambient animated backdrop for the auth pages (sign-in / sign-up).
 *
 * Three drifting aurora orbs (tinted from the theme `--primary`) over a
 * slowly-panning grid that fades out toward the edges. Purely decorative —
 * `aria-hidden`, non-interactive, and fully disabled under
 * `prefers-reduced-motion` (see `.auth-aurora` / `.auth-grid` in index.css).
 */
export function AuthBackground() {
  return (
    <div
      aria-hidden
      className='pointer-events-none absolute inset-0 overflow-hidden'
    >
      {/* Panning grid, masked to a soft vignette so lines never hit the edge */}
      <div className='auth-grid fade-y absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] dark:opacity-[0.18]' />

      {/* Aurora orbs — primary + violet + cyan, on-brand and theme-aware */}
      <div
        className='auth-aurora'
        style={{
          top: '-12%',
          left: '-8%',
          width: '42vmax',
          height: '42vmax',
          background:
            'radial-gradient(circle at center, var(--primary), transparent 70%)',
          animation: 'auth-aurora-a 19s ease-in-out infinite',
        }}
      />
      <div
        className='auth-aurora'
        style={{
          top: '-6%',
          right: '-12%',
          width: '38vmax',
          height: '38vmax',
          background:
            'radial-gradient(circle at center, color-mix(in oklch, var(--primary) 45%, oklch(0.7 0.2 300)), transparent 70%)',
          animation: 'auth-aurora-b 23s ease-in-out infinite',
        }}
      />
      <div
        className='auth-aurora'
        style={{
          bottom: '-18%',
          left: '20%',
          width: '46vmax',
          height: '46vmax',
          background:
            'radial-gradient(circle at center, color-mix(in oklch, var(--primary) 40%, oklch(0.78 0.15 200)), transparent 70%)',
          animation: 'auth-aurora-c 27s ease-in-out infinite',
        }}
      />
    </div>
  )
}
