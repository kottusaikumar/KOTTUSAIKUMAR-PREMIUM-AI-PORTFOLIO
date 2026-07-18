import type { Skill } from '../../data/capabilities'
import { getBrandIcon } from './icons'

const CANVAS_SIZE = 256

/**
 * Draws a skill tile (icon + label) onto an offscreen canvas and returns a
 * data URL. Used as the StickerPeel front texture so the peeled flap shows
 * the same tile content as the resting grid, without needing a raster
 * asset per skill.
 */
export function renderTileImage(skill: Skill, tileColor: string, labelColor: string): string {
  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_SIZE
  canvas.height = CANVAS_SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  const radius = 36
  ctx.fillStyle = tileColor
  ctx.beginPath()
  ctx.moveTo(radius, 0)
  ctx.arcTo(CANVAS_SIZE, 0, CANVAS_SIZE, CANVAS_SIZE, radius)
  ctx.arcTo(CANVAS_SIZE, CANVAS_SIZE, 0, CANVAS_SIZE, radius)
  ctx.arcTo(0, CANVAS_SIZE, 0, 0, radius)
  ctx.arcTo(0, 0, CANVAS_SIZE, 0, radius)
  ctx.closePath()
  ctx.fill()

  const icon = skill.iconKind === 'brand' ? getBrandIcon(skill.iconSlug) : undefined

  ctx.save()
  ctx.translate(CANVAS_SIZE / 2, 96)
  if (icon) {
    const scale = 3.2
    ctx.translate(-12 * scale, -12 * scale)
    ctx.scale(scale, scale)
    ctx.fillStyle = `#${icon.hex}`
    try {
      ctx.fill(new Path2D(icon.path))
    } catch {
      // Malformed/unsupported path data — fall back silently, glyph badge below still renders.
    }
  } else {
    ctx.font = '700 46px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = labelColor
    ctx.fillText(skill.glyph, 0, 0)
  }
  ctx.restore()

  ctx.font = '600 22px Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = labelColor
  ctx.fillText(skill.label, CANVAS_SIZE / 2, 190)

  return canvas.toDataURL('image/png')
}
