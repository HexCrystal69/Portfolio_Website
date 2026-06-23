"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

interface MorphingBlobProps {
  /** 0 = hero center, 1 = section-view (shifted left, scaled down) */
  sectionMode: boolean
  className?: string
}

export function MorphingBlob({ sectionMode, className = "" }: MorphingBlobProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef({ sectionMode })

  useEffect(() => {
    stateRef.current.sectionMode = sectionMode
  }, [sectionMode])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // ─── Scene ───────────────────────────────────────────────────────────────
    const scene = new THREE.Scene()
    const W = mount.clientWidth || window.innerWidth
    const H = mount.clientHeight || window.innerHeight

    const camera = new THREE.PerspectiveCamera(30, W / H, 0.1, 100)
    camera.position.z = 6

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // ─── Blob geometry ───────────────────────────────────────────────────────
    const geometry = new THREE.SphereGeometry(0.9, 64, 64)
    // store original positions for displacement
    const posAttr = geometry.attributes.position
    const originalPositions = new Float32Array(posAttr.array.length)
    originalPositions.set(posAttr.array)

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#FF8C00"),
      roughness: 0.35,
      metalness: 0.1,
    })

    const blob = new THREE.Mesh(geometry, material)
    scene.add(blob)

    // ─── Glow (additive secondary sphere) ────────────────────────────────────
    const glowGeo = new THREE.SphereGeometry(1.4, 32, 32)
    const glowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#FF6600"),
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.FrontSide,
    })
    const glow = new THREE.Mesh(glowGeo, glowMat)
    scene.add(glow)

    // Outer halo
    const haloGeo = new THREE.SphereGeometry(2.0, 32, 32)
    const haloMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#FF8C00"),
      transparent: true,
      opacity: 0.07,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.FrontSide,
    })
    const halo = new THREE.Mesh(haloGeo, haloMat)
    scene.add(halo)

    // ─── Lighting ─────────────────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xffa500, 0.3)
    scene.add(ambient)

    const keyLight = new THREE.PointLight(0xff8c00, 4, 12)
    keyLight.position.set(2, 2, 3)
    scene.add(keyLight)

    const rimLight = new THREE.PointLight(0xff4500, 1.5, 10)
    rimLight.position.set(-3, -1, -2)
    scene.add(rimLight)

    const topLight = new THREE.PointLight(0xffaa00, 1, 8)
    topLight.position.set(0, 4, 1)
    scene.add(topLight)

    // ─── Current animated state ───────────────────────────────────────────────
    // target values
    let targetX = 0
    let targetY = 0
    let targetScale = 1
    // current (lerped)
    let currentX = 0
    let currentY = 0
    let currentScale = 1

    // ─── Animation loop ───────────────────────────────────────────────────────
    let rafId: number
    const clock = new THREE.Clock()

    function animate() {
      rafId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // ── vertex displacement — very subtle, celestial/sun breathing ──
      const pos = geometry.attributes.position
      for (let i = 0; i < pos.count; i++) {
        const ox = originalPositions[i * 3]
        const oy = originalPositions[i * 3 + 1]
        const oz = originalPositions[i * 3 + 2]

        // Amplitude reduced ~75% from previous values.
        // Low frequencies + very slow time multipliers = atmospheric breathing.
        const noise =
          Math.sin(ox * 1.1 + t * 0.14) * 0.018 +
          Math.cos(oy * 0.9 + t * 0.11) * 0.016 +
          Math.sin(oz * 0.8 + t * 0.09) * 0.014 +
          Math.cos((ox + oz) * 0.7 + t * 0.12) * 0.012

        pos.setXYZ(
          i,
          ox + ox * noise,
          oy + oy * noise,
          oz + oz * noise,
        )
      }
      pos.needsUpdate = true
      geometry.computeVertexNormals()

      // ── subtle slow rotation ─────────────────────────────────────────
      blob.rotation.y = t * 0.06
      blob.rotation.x = Math.sin(t * 0.04) * 0.1
      glow.rotation.y = t * 0.06
      halo.rotation.y = -t * 0.04

      // ── lerp position / scale toward target ─────────────────────────
      const section = stateRef.current.sectionMode

      // recalc targets based on viewport aspect
      const aspect = W / H
      if (section) {
        // shift left by ~28% of frustum width, scale down to 65%
        const fovRad = (camera.fov * Math.PI) / 180
        const frustumH = 2 * Math.tan(fovRad / 2) * camera.position.z
        const frustumW = frustumH * aspect
        targetX = -frustumW * 0.22
        targetY = frustumH * 0.05
        targetScale = 0.62
      } else {
        targetX = 0
        targetY = 0
        targetScale = 1
      }

      const LERP = 0.04
      currentX += (targetX - currentX) * LERP
      currentY += (targetY - currentY) * LERP
      currentScale += (targetScale - currentScale) * LERP

      blob.position.set(currentX, currentY, 0)
      glow.position.set(currentX, currentY, 0)
      halo.position.set(currentX, currentY, 0)

      blob.scale.setScalar(currentScale)
      glow.scale.setScalar(currentScale)
      halo.scale.setScalar(currentScale)

      renderer.render(scene, camera)
    }

    animate()

    // ─── Resize ───────────────────────────────────────────────────────────────
    const onResize = () => {
      const w = mount.clientWidth || window.innerWidth
      const h = mount.clientHeight || window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", onResize)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      glowMat.dispose()
      haloMat.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 ${className}`}
      aria-hidden="true"
    />
  )
}
