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

import { useTranslation } from 'react-i18next'
import { getLobeIcon } from '@/lib/lobe-icon'

/**
 * Decorative large-language-model visual for the auth split panel.
 *
 * A transformer/MLP-style neural network: edges carry an animated dashed
 * "signal" flow and nodes pulse, surrounded by drifting logos of major model
 * vendors — a nod to the gateway aggregating 40+ providers. Purely
 * decorative; animation classes live in `index.css` and self-disable under
 * `prefers-reduced-motion`.
 */

// Nodes per layer (input → hidden → hidden → output).
const LAYERS = [4, 5, 5, 3]
const VB_W = 440
const VB_H = 480
const PAD_X = 48
const PAD_Y = 46

// Lay each layer out as a vertical column, evenly spaced and centered.
const columns = LAYERS.map((count, layer) => {
  const x = PAD_X + (layer * (VB_W - PAD_X * 2)) / (LAYERS.length - 1)
  const span = VB_H - PAD_Y * 2
  return Array.from({ length: count }, (_, i) => ({
    x,
    y: count === 1 ? VB_H / 2 : PAD_Y + (i * span) / (count - 1),
  }))
})

// Fully connect adjacent layers.
const edges: { x1: number; y1: number; x2: number; y2: number; i: number }[] =
  []
for (let l = 0; l < columns.length - 1; l++) {
  for (const a of columns[l]) {
    for (const b of columns[l + 1]) {
      edges.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, i: edges.length })
    }
  }
}

const nodes = columns.flat()

// Chinese model-vendor logos (full set mirrors the home page hero
// `hero-terminal-demo.tsx`). Names map to colored marks in @lobehub/icons via
// `getLobeIcon`. Rendered as a centered cluster over the network backdrop.
const BRAND_NAMES = [
  'Qwen',
  'Wenxin',
  'DeepSeek',
  'Kimi',
  'Doubao',
  'Zhipu',
  'ChatGLM',
  'Moonshot',
  'Yi',
  'Baichuan',
  'Hunyuan',
  'Stepfun',
  'Spark',
  'Minimax',
  'InternLM',
  'SenseNova',
]

const BRAND_ITEMS = BRAND_NAMES.map((name, i) => ({
  name,
  icon: getLobeIcon(`${name}.Color`, 28),
  delay: `${(i % 7) * 0.45}s`,
  dur: `${6 + (i % 5)}s`,
}))

export function AuthLLMVisual() {
  const { t } = useTranslation()

  return (
    <div
      aria-hidden
      className='pointer-events-none relative mx-auto flex w-full max-w-lg flex-col items-center justify-center gap-8 px-4 py-6'
    >
      {/* Soft core glow behind the network — kept gentle so it melts into
          the page background instead of standing out as a colored block. */}
      <div className='absolute inset-0 [background:radial-gradient(circle_at_50%_42%,color-mix(in_oklch,var(--primary)_9%,transparent),transparent_62%)]' />

      {/* Neural network as a centered backdrop; the vendor logos cluster in
          the middle so the brand marks read as the centered focal point.
          min-height contains the network so the tagline never overlaps it,
          and overflow-hidden keeps the backdrop from spilling sideways. */}
      <div className='relative flex min-h-[26rem] w-full items-center justify-center overflow-hidden'>
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className='text-primary pointer-events-none absolute top-1/2 left-1/2 max-h-[24rem] w-full max-w-[22rem] -translate-x-1/2 -translate-y-1/2'
          fill='none'
        >
          {edges.map((e) => (
            <line
              key={`e-${e.i}`}
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              className='auth-net-edge'
              style={{
                animationDelay: `${(e.i % 9) * 0.26}s`,
                animationDuration: `${2.2 + (e.i % 5) * 0.3}s`,
              }}
            />
          ))}
          {nodes.map((n, i) => (
            <g key={`n-${i}`}>
              <circle
                cx={n.x}
                cy={n.y}
                r={9}
                className='auth-node-glow'
                style={{ animationDelay: `${(i % 7) * 0.4}s` }}
              />
              <circle
                cx={n.x}
                cy={n.y}
                r={4}
                fill='currentColor'
                opacity={0.5}
              />
            </g>
          ))}
        </svg>

        {/* Centered 4×4 grid of Chinese model-vendor logos */}
        <div className='relative grid grid-cols-4 gap-x-12 gap-y-10'>
          {BRAND_ITEMS.map((b) => (
            <span
              key={b.name}
              className='glass-2 animate-logo-float flex size-11 items-center justify-center rounded-xl shadow-lg backdrop-blur-md'
              style={
                {
                  '--float-delay': b.delay,
                  '--float-dur': b.dur,
                } as React.CSSProperties
              }
            >
              {b.icon}
            </span>
          ))}
        </div>
      </div>

      {/* Tagline (normal flow, sits below the network) */}
      <div className='relative px-6 text-center'>
        <p className='text-foreground/85 text-lg font-semibold tracking-tight'>
          {t('Your gateway to 40+ AI models')}
        </p>
        <p className='text-muted-foreground mt-1 text-sm'>
          {t('Qwen · DeepSeek · Kimi and more, behind one unified API')}
        </p>
      </div>
    </div>
  )
}
