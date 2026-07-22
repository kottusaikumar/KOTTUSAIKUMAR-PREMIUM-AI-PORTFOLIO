import type { CSSProperties } from 'react'
import type { Skill } from '../../data/capabilities'
import { getBrandIcon } from './icons'

interface SkillTileProps {
  skill: Skill
  isActive: boolean
  isFeatured: boolean
  accent: string
}

function channelToLinear(value: number) {
  const channel = value / 255
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
}

function luminance([red, green, blue]: [number, number, number]) {
  return 0.2126 * channelToLinear(red) + 0.7152 * channelToLinear(green) + 0.0722 * channelToLinear(blue)
}

function contrast(first: [number, number, number], second: [number, number, number]) {
  const lighter = Math.max(luminance(first), luminance(second))
  const darker = Math.min(luminance(first), luminance(second))
  return (lighter + 0.05) / (darker + 0.05)
}

function readableBrandColor(hex: string) {
  const value = Number.parseInt(hex, 16)
  const original: [number, number, number] = [(value >> 16) & 255, (value >> 8) & 255, value & 255]
  const tileBackground: [number, number, number] = [20, 57, 40]

  for (let whiteMix = 0; whiteMix <= 0.7; whiteMix += 0.05) {
    const candidate = original.map((channel) => Math.round(channel + (255 - channel) * whiteMix)) as [number, number, number]
    if (contrast(candidate, tileBackground) >= 3.5) return `rgb(${candidate.join(' ')})`
  }

  return '#f4f0e5'
}

export function SkillTile({ skill, isActive, isFeatured, accent }: SkillTileProps) {
  const icon = skill.iconKind === 'brand' ? getBrandIcon(skill.iconSlug) : undefined

  const tileClassName = [
    'skill-tile',
    icon ? 'has-brand-icon' : 'has-glyph-icon',
    isActive ? 'is-active' : 'is-inactive',
    isFeatured ? 'is-featured' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={tileClassName}
      style={{
        '--tile-accent': accent,
        '--brand-color': icon ? readableBrandColor(icon.hex) : undefined,
      } as CSSProperties}
      tabIndex={0}
      role="listitem"
      aria-label={skill.label}
    >
      <span className="skill-tile-icon" aria-hidden="true">
        {icon ? (
          <svg viewBox="0 0 24 24" width="26" height="26" focusable="false">
            <path d={icon.path} fill="currentColor" />
          </svg>
        ) : (
          <span className="skill-tile-glyph">{skill.glyph}</span>
        )}
      </span>
      <span className="skill-tile-label">{skill.label}</span>
    </div>
  )
}
