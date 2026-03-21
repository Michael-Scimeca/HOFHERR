'use client'

import { useEffect, useRef } from 'react'

export default function EmberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let ww = window.innerWidth
    let wh = window.innerHeight
    canvas.width  = ww
    canvas.height = wh

    function between(a: number, b: number) { return Math.random() * (b - a) + a }

    const COLORS = ['#ff8c00', '#ffa500', '#ff6600', '#ffb347', '#ff7f00', '#ffcc66', '#ff4500', '#ffd27f']

    let windTime     = 0
    let windStrength = 0
    let windTarget   = (Math.random() - 0.5) * 0.08
    let burstTimer    = 0
    let burstCooldown = between(40, 100)

    interface P {
      px: number; py: number; x: number; y: number
      vx: number; vy: number; g: number
      life: number; maxLife: number; size: number; depth: number
      color: string; baseColor: string; type: number
      flicker: number; flickerSpeed: number
      wobble: number; wobbleSpeed: number; wobbleAmp: number
      shape: number; rotation: number; rotSpeed: number; scaleX: number; scaleY: number; sides: number
      dead: boolean
    }

    function make(init = false): P {
      const depth   = Math.random()
      const isFlare = Math.random() < 0.06
      // 0 = normal (60%), 1 = lazy float (25%), 2 = lofted (15%)
      const type = Math.random() < 0.6 ? 0 : Math.random() < 0.6 ? 1 : 2
      const x = between(ww * 0.15, ww * 0.85)
      const y = between(wh * 0.85, wh)
      const col = isFlare
        ? ['#ffffff', '#fff5cc', '#ffe4a0', '#ffd27f'][Math.floor(Math.random() * 4)]
        : COLORS[Math.floor(Math.random() * COLORS.length)]

      let vx: number, vy: number, g: number, life: number
      if (type === 1) {
        vx = between(-1.2, 1.2); vy = between(-0.05, -0.25)
        g  = -0.0002 * Math.random() * 3
        life = between(wh * 0.55, wh * 1.1)
      } else if (type === 2) {
        vx = between(-0.3, 0.3); vy = between(-1.2, -1.8)
        g  = -0.0015 * Math.random() * 10
        life = between(wh * 0.5, wh * 0.9)
      } else {
        vx = between(-0.6, 0.6); vy = between(-0.4, -0.85) * (0.5 + depth * 0.6)
        g  = -0.0008 * Math.random() * 10
        life = between(wh * 0.4, wh * 0.85)
      }

      return {
        px: x, py: y, x, y, vx, vy, g, life, maxLife: life,
        size: isFlare ? between(1.2, 2) : between(0.4, 1.1) + depth * 0.8,
        depth, color: col, baseColor: col, type,
        flicker: Math.random() * Math.PI * 2,
        flickerSpeed: between(0.04, 0.16),
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: between(0.01, 0.04),
        wobbleAmp: between(0.05, 0.35),
        shape: Math.floor(Math.random() * 4), // 0=streak 1=oval 2=shard 3=teardrop
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.06,
        scaleX: between(0.4, 1.0),
        scaleY: between(0.7, 1.4),
        sides: Math.floor(between(3, 6)),
        dead: false,
      }
    }

    const particles: P[] = Array.from({ length: 60 }, (_, i) => {
      const p = make(true)
      // stagger — each particle starts at a different point in its life
      p.life = p.maxLife * (1 - i / 60) * Math.random()
      return p
    })

    interface S { x: number; y: number; r: number; alpha: number; vy: number; vx: number; life: number }
    function makeSmoke(): S {
      return {
        x: between(ww * 0.25, ww * 0.75), y: between(wh * 0.5, wh),
        r: between(8, 26), alpha: between(0.01, 0.032),
        vy: between(0.1, 0.3), vx: between(-0.1, 0.1), life: 1,
      }
    }
    const smokes: S[] = Array.from({ length: 22 }, makeSmoke)

    const draw = () => {
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, ww, wh)


      windTime     += 0.006
      windStrength += (windTarget - windStrength) * 0.008
      if (Math.random() < 0.004) windTarget = (Math.random() - 0.5) * 0.08
      const wind = Math.sin(windTime) * windStrength

      for (const s of smokes) {
        s.x += s.vx + wind * 0.4; s.y -= s.vy; s.r += 0.06; s.life -= 0.0014
        if (s.life <= 0 || s.y < -60) Object.assign(s, makeSmoke())
        ctx.save()
        ctx.globalAlpha = s.life * s.alpha
        const sg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r)
        sg.addColorStop(0, 'rgba(55,30,14,0.9)')
        sg.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = sg
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill()
        ctx.restore()
      }

      burstTimer++
      if (burstTimer >= burstCooldown) {
        burstTimer = 0; burstCooldown = between(25, 80)
        let n = Math.floor(between(3, 8))
        for (const p of particles) { if (p.dead && n-- > 0) Object.assign(p, make(false)) }
      }

      for (const p of particles) {
        if (p.dead) continue
        p.flicker += p.flickerSpeed
        p.wobble  += p.wobbleSpeed
        p.vx      += (Math.random() - 0.5) * 0.014

        if (p.type === 1) {
          p.vx += Math.sin(p.wobble) * p.wobbleAmp * 0.08
          if (p.vy > -0.6) p.vy -= 0.0008
        }
        if (p.type === 2) {
          p.vx += Math.sin(p.wobble) * p.wobbleAmp * 0.05
        }

        p.vx += wind * (0.3 + p.depth * 0.7)
        p.px = p.x; p.py = p.y
        p.vy += p.g
        if (p.vy > 0) p.vy = 0
        p.x += p.vx; p.y += p.vy
        p.life--

        const lr      = Math.max(0, p.life / p.maxLife)
        const fadeIn  = Math.min(1, (1 - lr) * 14)
        const fadeOut = Math.pow(lr, 0.55)
        const flicker = 0.7 + 0.3 * Math.sin(p.flicker)
        const alpha   = fadeIn * fadeOut * flicker * (0.35 + p.depth * 0.65)

        p.color = p.life < 20 ? '#1a1008' : p.baseColor

        p.rotation += p.rotSpeed

        const dx  = p.x - p.px
        const dy  = p.y - p.py
        const len = Math.sqrt(dx * dx + dy * dy)

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.shadowColor = p.color
        ctx.shadowBlur  = p.size < 0.8 ? 4 : 7

        if (p.shape === 0) {
          // streak — line from prev to current
          const stretch = len < 0.1 ? 1 : Math.min(4.5, 2.8 / len)
          ctx.strokeStyle = p.color
          ctx.lineWidth   = p.size
          ctx.lineCap     = 'round'
          ctx.beginPath()
          ctx.moveTo(p.px - dx * stretch, p.py - dy * stretch)
          ctx.lineTo(p.x  + dx * 0.5,    p.y  + dy * 0.5)
          ctx.stroke()
        } else if (p.shape === 1) {
          // oval / squashed ellipse
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rotation)
          ctx.scale(p.scaleX, p.scaleY)
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(0, 0, p.size * 1.2, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.shape === 2) {
          // irregular shard — small polygon
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rotation)
          ctx.fillStyle = p.color
          ctx.beginPath()
          const r = p.size * 1.1
          for (let i = 0; i < p.sides; i++) {
            const ang = (i / p.sides) * Math.PI * 2
            const jitter = between(0.5, 1.3)
            const px2 = Math.cos(ang) * r * jitter * p.scaleX
            const py2 = Math.sin(ang) * r * jitter * p.scaleY
            i === 0 ? ctx.moveTo(px2, py2) : ctx.lineTo(px2, py2)
          }
          ctx.closePath()
          ctx.fill()
        } else {
          // teardrop — elongated in direction of travel
          ctx.translate(p.x, p.y)
          const angle = Math.atan2(dy, dx) + Math.PI / 2
          ctx.rotate(angle)
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.moveTo(0, -p.size * 2)
          ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.8, p.size * 0.8, 0, p.size * 1.0)
          ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.8, -p.size * 0.8, -p.size * 0.5, 0, -p.size * 2)
          ctx.closePath()
          ctx.fill()
        }

        ctx.shadowBlur = 0
        ctx.restore()

        if (p.life < 1 || p.y < -30) p.dead = true
      }
    }

    const interval = setInterval(draw, 16)
    const onResize = () => {
      ww = canvas.width  = window.innerWidth
      wh = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)
    return () => { clearInterval(interval); window.removeEventListener('resize', onResize) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  )
}
