'use client'

import { useEffect, useRef } from 'react'

export default function EmberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return

    let ww = window.innerWidth
    let wh = window.innerHeight
    c.width  = ww
    c.height = wh

    const ctx = c.getContext('2d')!

    function between(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    function createP(this: any) {
      this.x    = between(ww * 0.1, ww * 0.9)
      this.y    = between(wh * 0.9, wh * 1)
      this.size = Math.random() * 2.5
      this.vx   = Math.random() * 1 - 0.5
      this.vy   = between(-0.5, -0.75)
      this.g    = -0.001 * Math.random() * 10
      this.life = between(wh / 2, wh)

      const one   = '#e74c3c'
      const two   = '#c0392b'
      const three = '#e67e22'
      const array = [one, two, three]
      this.color  = array[Math.floor(Math.random() * 3)]

      this.reset = function(this: any) {
        this.x    = between(ww * 0.1, ww * 0.9)
        this.y    = between(wh * 0.9, wh * 1)
        this.size = Math.random() * 2.5
        this.vx   = Math.random() * 1 - 0.5
        this.vy   = between(-0.5, -0.75)
        this.g    = -0.001 * Math.random() * 10
        this.life = between(wh / 2, wh)

        const one   = '#e74c3c'
        const two   = '#c0392b'
        const three = '#e67e22'
        const array = [one, two, three]
        this.color  = array[Math.floor(Math.random() * 3)]
      }
    }

    const particles: any[] = []
    for (let i = 0; i < 25; i++) {
      particles.push(new (createP as any)())
    }

    const draw = function() {
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, ww, wh)

      for (let t = 0; t < particles.length; t++) {
        const p = particles[t]

        ctx.beginPath()
        ctx.fillStyle = p.color
        ctx.arc(p.x, p.y, p.size, p.size, Math.PI * 10, false)
        ctx.fill()

        p.x += p.vx
        p.y += (p.vy += p.g)

        p.life--

        if (p.life < 25) p.color = '#191919'
        if (p.life < 1)  p.reset()
      }
    }

    const interval = setInterval(draw)

    const handleResize = () => {
      ww = c.width  = window.innerWidth
      wh = c.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  )
}
