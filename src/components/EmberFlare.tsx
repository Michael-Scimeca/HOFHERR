'use client'

import { useEffect, useRef, useCallback } from 'react'

/*
 * EmberFlare — a separate overlay canvas that spawns a burst of
 * fire embers when the page changes. Draws embers using the same
 * streak/shard/teardrop shapes as EmbersBackground.
 */

interface Ember {
  x: number
  y: number
  px: number      // previous x (for streak direction)
  py: number      // previous y
  vx: number
  vy: number
  size: number
  alpha: number
  maxAlpha: number
  color: string
  life: number
  maxLife: number
  wobble: number
  wobbleSpeed: number
  wobbleAmp: number
  shape: number     // 0=streak, 1=oval, 2=shard, 3=teardrop
  rotation: number
  rotSpeed: number
  scaleX: number
  scaleY: number
  sides: number
}

const EMBER_COUNT = 30
const DURATION = 2.8

function between(a: number, b: number) {
  return Math.random() * (b - a) + a
}

export default function EmberFlare() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  const burst = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    cancelAnimationFrame(animRef.current)

    const w = window.innerWidth
    const h = window.innerHeight
    canvas.width = w
    canvas.height = h
    canvas.style.display = 'block'

    const COLORS = [
      '#ff4500', '#ff5500', '#ff6600', '#ff7700',
      '#ff8c00', '#ffa500', '#ffb347', '#ffcc44',
      '#ffe080', '#fff5cc',
    ]

    const embers: Ember[] = []
    for (let i = 0; i < EMBER_COUNT; i++) {
      const startX = between(w * 0.05, w * 0.95)
      const startY = between(h * 0.88, h * 1.05)
      const col = COLORS[Math.floor(Math.random() * COLORS.length)]

      embers.push({
        x: startX,
        y: startY,
        px: startX,
        py: startY,
        vx: between(-1.2, 1.2),
        vy: between(-2.0, -5.5),
        size: between(1.0, 3.5),
        alpha: 0,
        maxAlpha: between(0.6, 1.0),
        color: col,
        life: 0,
        maxLife: between(1.2, DURATION),
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: between(0.03, 0.08),
        wobbleAmp: between(0.3, 1.0),
        shape: Math.floor(Math.random() * 4),    // match EmbersBackground shapes
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.1,
        scaleX: between(0.4, 1.0),
        scaleY: between(0.7, 1.4),
        sides: Math.floor(between(3, 6)),
      })
    }

    const start = performance.now()

    const draw = (now: number) => {
      const t = (now - start) / 1000
      if (t > DURATION) {
        ctx.clearRect(0, 0, w, h)
        canvas.style.display = 'none'
        return
      }

      ctx.clearRect(0, 0, w, h)

      for (const e of embers) {
        e.life = t
        if (e.life > e.maxLife) continue

        const p = e.life / e.maxLife

        // Quick fade in, slow fade out
        if (p < 0.1) {
          e.alpha = (p / 0.1) * e.maxAlpha
        } else {
          e.alpha = e.maxAlpha * (1 - Math.pow((p - 0.1) / 0.9, 1.5))
        }

        const decel = Math.max(0.2, 1 - p * 0.6)

        e.wobble += e.wobbleSpeed
        const wx = Math.sin(e.wobble) * e.wobbleAmp * decel

        // Store previous position for streak direction
        e.px = e.x
        e.py = e.y

        e.x += (e.vx + wx) * decel
        e.y += e.vy * decel
        e.vy *= 0.998
        e.rotation += e.rotSpeed

        if (e.alpha <= 0.01) continue

        // Direction vector
        const dx = e.x - e.px
        const dy = e.y - e.py
        const len = Math.sqrt(dx * dx + dy * dy)

        ctx.save()
        ctx.globalAlpha = e.alpha

        if (e.shape === 0) {
          // Streak — line from prev to current (same as EmbersBackground)
          const stretch = len < 0.1 ? 1 : Math.min(4.5, 2.8 / len)
          ctx.strokeStyle = e.color
          ctx.lineWidth = e.size
          ctx.lineCap = 'round'
          ctx.beginPath()
          ctx.moveTo(e.px - dx * stretch, e.py - dy * stretch)
          ctx.lineTo(e.x + dx * 0.5, e.y + dy * 0.5)
          ctx.stroke()
        } else if (e.shape === 1) {
          // Oval / squashed ellipse
          ctx.translate(e.x, e.y)
          ctx.rotate(e.rotation)
          ctx.scale(e.scaleX, e.scaleY)
          ctx.fillStyle = e.color
          ctx.beginPath()
          ctx.arc(0, 0, e.size * 1.2, 0, Math.PI * 2)
          ctx.fill()
        } else if (e.shape === 2) {
          // Irregular shard — small polygon
          ctx.translate(e.x, e.y)
          ctx.rotate(e.rotation)
          ctx.fillStyle = e.color
          ctx.beginPath()
          const r = e.size * 1.1
          for (let i = 0; i < e.sides; i++) {
            const ang = (i / e.sides) * Math.PI * 2
            const jitter = between(0.5, 1.3)
            const px2 = Math.cos(ang) * r * jitter * e.scaleX
            const py2 = Math.sin(ang) * r * jitter * e.scaleY
            i === 0 ? ctx.moveTo(px2, py2) : ctx.lineTo(px2, py2)
          }
          ctx.closePath()
          ctx.fill()
        } else {
          // Teardrop — elongated in direction of travel
          ctx.translate(e.x, e.y)
          const angle = Math.atan2(dy, dx) + Math.PI / 2
          ctx.rotate(angle)
          ctx.fillStyle = e.color
          ctx.beginPath()
          ctx.moveTo(0, -e.size * 2)
          ctx.bezierCurveTo(e.size * 0.8, -e.size * 0.5, e.size * 0.8, e.size * 0.8, 0, e.size * 1.0)
          ctx.bezierCurveTo(-e.size * 0.8, e.size * 0.8, -e.size * 0.8, -e.size * 0.5, 0, -e.size * 2)
          ctx.closePath()
          ctx.fill()
        }

        ctx.restore()
      }

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)
  }, [])

  useEffect(() => {
    const onExit = () => burst()
    window.addEventListener('page-transition-exit', onExit)
    return () => {
      window.removeEventListener('page-transition-exit', onExit)
      cancelAnimationFrame(animRef.current)
    }
  }, [burst])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
        display: 'none',
      }}
    />
  )
}
