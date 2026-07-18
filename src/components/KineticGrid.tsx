import { useEffect, useRef } from 'react'

type GridDot = {
  hx: number
  hy: number
  x: number
  y: number
  vx: number
  vy: number
}

const DOT_COLOR = '#0b6038'
const LINE_COLOR = '#e8e1d2'
const TRAIL_COLOR = '#127a48'

export function KineticGrid() {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!host || !canvas || !context) return

    const spacing = 42
    const attractionRadius = 250
    const pull = 1.55
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pointer = { x: -9999, y: -9999, active: false }
    const trail: { x: number; y: number; time: number }[] = []
    let width = 1
    let height = 1
    let columns: GridDot[][] = []
    let dots: GridDot[] = []
    let frameId = 0
    let visible = true

    const build = () => {
      const rect = host.getBoundingClientRect()
      width = Math.max(1, Math.floor(rect.width))
      height = Math.max(1, Math.floor(rect.height))
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      columns = []
      dots = []

      for (let columnIndex = 0; columnIndex < Math.floor(width / spacing) + 2; columnIndex += 1) {
        const column: GridDot[] = []
        for (let rowIndex = 0; rowIndex < Math.floor(height / spacing) + 2; rowIndex += 1) {
          const hx = columnIndex * spacing
          const hy = rowIndex * spacing
          const dot = { hx, hy, x: hx, y: hy, vx: 0, vy: 0 }
          column.push(dot)
          dots.push(dot)
        }
        columns.push(column)
      }
    }

    const draw = (animate: boolean) => {
      context.clearRect(0, 0, width, height)

      if (animate) {
        for (const dot of dots) {
          let ax = (dot.hx - dot.x) * 0.08
          let ay = (dot.hy - dot.y) * 0.08
          if (pointer.active) {
            const dx = pointer.x - dot.x
            const dy = pointer.y - dot.y
            const distance = Math.hypot(dx, dy)
            if (distance < attractionRadius && distance > 0.001) {
              const force = (1 - distance / attractionRadius) * pull
              ax += (dx / distance) * force
              ay += (dy / distance) * force
            }
          }
          dot.vx = (dot.vx + ax) * 0.82
          dot.vy = (dot.vy + ay) * 0.82
          dot.x += dot.vx
          dot.y += dot.vy
        }
      }

      for (let columnIndex = 0; columnIndex < columns.length; columnIndex += 1) {
        for (let rowIndex = 0; rowIndex < columns[columnIndex].length; rowIndex += 1) {
          const dot = columns[columnIndex][rowIndex]
          const right = columns[columnIndex + 1]?.[rowIndex]
          const down = columns[columnIndex]?.[rowIndex + 1]
          const proximity = pointer.active
            ? Math.max(0, 1 - Math.hypot(pointer.x - dot.x, pointer.y - dot.y) / attractionRadius)
            : 0
          context.globalAlpha = 0.28 + proximity * 0.54
          context.strokeStyle = LINE_COLOR
          context.lineWidth = 0.55 + proximity * 1.05
          if (right) {
            context.beginPath()
            context.moveTo(dot.x, dot.y)
            context.lineTo(right.x, right.y)
            context.stroke()
          }
          if (down) {
            context.beginPath()
            context.moveTo(dot.x, dot.y)
            context.lineTo(down.x, down.y)
            context.stroke()
          }
        }
      }

      for (const dot of dots) {
        const proximity = pointer.active
          ? Math.max(0, 1 - Math.hypot(pointer.x - dot.x, pointer.y - dot.y) / attractionRadius)
          : 0
        context.globalAlpha = 0.18 + proximity * 0.64
        context.fillStyle = DOT_COLOR
        context.beginPath()
        context.arc(dot.x, dot.y, 0.75 + proximity * 1.7, 0, Math.PI * 2)
        context.fill()
      }

      if (animate) {
        const now = performance.now()
        context.lineCap = 'round'
        context.lineJoin = 'round'
        for (let index = 1; index < trail.length; index += 1) {
          const previous = trail[index - 1]
          const current = trail[index]
          const age = now - current.time
          if (age > 240) continue
          context.globalAlpha = Math.max(0, 1 - age / 240) * 0.48
          context.strokeStyle = TRAIL_COLOR
          context.lineWidth = 1.5
          context.beginPath()
          context.moveTo(previous.x, previous.y)
          context.lineTo(current.x, current.y)
          context.stroke()
        }
        while (trail[0] && now - trail[0].time > 260) trail.shift()
      }
      context.globalAlpha = 1
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height
      pointer.active = inside
      if (!inside) return
      pointer.x = x
      pointer.y = y
      trail.push({ x, y, time: performance.now() })
      if (trail.length > 60) trail.shift()
    }

    const animate = () => {
      if (visible) draw(true)
      frameId = window.requestAnimationFrame(animate)
    }

    build()
    const resizeObserver = new ResizeObserver(() => {
      build()
      if (prefersReducedMotion) draw(false)
    })
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (!visible) pointer.active = false
    })
    resizeObserver.observe(host)
    intersectionObserver.observe(host)

    if (prefersReducedMotion) draw(false)
    else {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      frameId = window.requestAnimationFrame(animate)
    }

    return () => {
      window.cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [])

  return (
    <div ref={hostRef} className="process-kinetic-grid" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
