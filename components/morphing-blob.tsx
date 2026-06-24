"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

interface MorphingBlobProps {
  /** 0 = hero center, 1 = section-view (shifted left, scaled down) */
  sectionMode: boolean
  hoverActive?: boolean
  className?: string
  reducedMotion?: boolean
}

export function MorphingBlob({ sectionMode, hoverActive = false, className = "", reducedMotion = false }: MorphingBlobProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef({ sectionMode, hoverActive, reducedMotion })

  useEffect(() => {
    stateRef.current.sectionMode = sectionMode
    stateRef.current.hoverActive = hoverActive
    stateRef.current.reducedMotion = reducedMotion
  }, [sectionMode, hoverActive, reducedMotion])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // ─── Scene ───────────────────────────────────────────────────────────────
    const scene = new THREE.Scene()
    let w = mount.clientWidth || window.innerWidth
    let h = mount.clientHeight || window.innerHeight

    const camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 100)
    camera.position.z = 6

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h, false)
    renderer.domElement.style.position = "absolute"
    renderer.domElement.style.top = "0"
    renderer.domElement.style.left = "0"
    renderer.domElement.style.width = "100%"
    renderer.domElement.style.height = "100%"
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // ─── Blob geometry (Black morphing core scaled to 0.32) ──────────────────
    const geometry = new THREE.SphereGeometry(0.32, 64, 64)
    // store original positions for displacement
    const posAttr = geometry.attributes.position
    const originalPositions = new Float32Array(posAttr.array.length)
    originalPositions.set(posAttr.array)

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#050505"),
      roughness: 0.4,
      metalness: 0.1,
      emissive: new THREE.Color("#000000"),
      emissiveIntensity: 0,
      transparent: true,
      opacity: 1.0,
    })

    const blob = new THREE.Mesh(geometry, material)
    scene.add(blob)

    // ─── Glow (additive plane with hot-center shader gradient) ────────────────
    const glowGeo = new THREE.PlaneGeometry(1.6, 1.6)
    const glowMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color("#FF5500") },
        uOpacity: { value: 0.85 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uOpacity;
        varying vec2 vUv;
        void main() {
          float dist = distance(vUv, vec2(0.5));
          // Exponential falloff for a hot center core glow
          float alpha = pow(max(0.0, 1.0 - (dist * 2.0)), 2.5) * uOpacity;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const glow = new THREE.Mesh(glowGeo, glowMat)
    glow.position.z = -0.1
    scene.add(glow)

    // Outer halo
    const haloGeo = new THREE.PlaneGeometry(2.8, 2.8)
    const haloMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color("#FF8C00") },
        uOpacity: { value: 0.28 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uOpacity;
        varying vec2 vUv;
        void main() {
          float dist = distance(vUv, vec2(0.5));
          // Exponential falloff for smooth halo blending
          float alpha = pow(max(0.0, 1.0 - (dist * 2.0)), 3.0) * uOpacity;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const halo = new THREE.Mesh(haloGeo, haloMat)
    halo.position.z = -0.2
    scene.add(halo)

    // ─── Concentric rings (8 thin circles centered behind the blob) ─────────
    const ringsGroup = new THREE.Group()
    const ringRadii = [0.4, 0.7, 1.0, 1.3, 1.6, 1.9, 2.2, 2.5]
    ringRadii.forEach((r, i) => {
      const points = []
      const segments = 128
      for (let j = 0; j <= segments; j++) {
        const theta = (j / segments) * Math.PI * 2
        points.push(new THREE.Vector3(Math.cos(theta) * r, Math.sin(theta) * r, 0))
      }
      const ringGeo = new THREE.BufferGeometry().setFromPoints(points)
      const ringMat = new THREE.LineBasicMaterial({
        color: new THREE.Color("#F5E6D3"),
        transparent: true,
        opacity: 0.15 * Math.pow(1 - i / ringRadii.length, 1.5),
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const ring = new THREE.LineLoop(ringGeo, ringMat)
      ringsGroup.add(ring)
    })
    ringsGroup.position.z = -0.3
    scene.add(ringsGroup)

    // ─── Shockwave rings (3 rings for the burst transition) ───────────────────
    const shockwavesGroup = new THREE.Group()
    const shockwaveRings: THREE.LineLoop[] = []
    for (let i = 0; i < 3; i++) {
      const points = []
      const segments = 128
      const r = 0.5
      for (let j = 0; j <= segments; j++) {
        const theta = (j / segments) * Math.PI * 2
        points.push(new THREE.Vector3(Math.cos(theta) * r, Math.sin(theta) * r, 0))
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points)
      const mat = new THREE.LineBasicMaterial({
        color: new THREE.Color("#FF8C00"),
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const ring = new THREE.LineLoop(geo, mat)
      shockwaveRings.push(ring)
      shockwavesGroup.add(ring)
    }
    shockwavesGroup.position.z = -0.05
    scene.add(shockwavesGroup)

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

    // hover state variables
    let currentHoverAmp = 0.14
    let currentHoverRotSpeed = 0.06
    let currentGlowScaleMult = 1.0
    let currentHoverGlowIntensity = 0.85
    let currentHoverHaloBrightness = 0.28
    let currentFreq = 4.0
    let currentRingOpacity = 0.15
    let currentHaloScaleBoost = 1.0
    let accumulatedRotationY = 0
    let lastSection = false
    let transitionTime = -1

    // ─── Animation loop ───────────────────────────────────────────────────────
    let rafId: number
    let lastTime = performance.now()
    let elapsedTime = 0

    // Reuse THREE.Color instances to avoid per-frame allocations & garbage collection
    const colorLight = new THREE.Color("#F5E6D3")
    const colorDark = new THREE.Color("#050505")
    const emissiveLight = new THREE.Color("#F5E6D3")
    const emissiveDark = new THREE.Color("#000000")
    const baseOrange = new THREE.Color("#FF8C00")
    const brightOrange = new THREE.Color("#FFA040")

    function animate() {
      rafId = requestAnimationFrame(animate)
      const now = performance.now()
      const dt = Math.min((now - lastTime) / 1000, 0.1)
      lastTime = now
      elapsedTime += dt
      const t = elapsedTime

      // Read states
      const section = stateRef.current.sectionMode
      const hover = stateRef.current.hoverActive
      const reducedMotion = stateRef.current.reducedMotion

      // Detect transition triggers
      if (section !== lastSection) {
        transitionTime = 0
        lastSection = section
      }

      let glowScaleBoost = 1.0
      let haloScaleBoost = 1.0
      let ringScaleBoost = 1.0
      
      let emissiveIntensityBoost = 1.0
      let haloOpacityBoost = 1.0
      let ringOpacityBoost = 1.0

      if (transitionTime >= 0) {
        if (reducedMotion) {
          transitionTime = -1
        } else {
          transitionTime += dt
          const totalDuration = 1.20
          if (transitionTime > totalDuration) {
            transitionTime = -1
          } else {
            if (transitionTime <= 0.15) {
              const p = transitionTime / 0.15
              glowScaleBoost = 1.0 + (6.0 - 1.0) * p
              haloScaleBoost = 1.0 + (7.0 - 1.0) * p
              ringScaleBoost = 1.0 + (2.2 - 1.0) * p
              
              emissiveIntensityBoost = 1.0 + (5.0 - 1.0) * p
              haloOpacityBoost = 1.0 + (2.0 - 1.0) * p
              ringOpacityBoost = 1.0 + (0.1 - 1.0) * p
            } else {
              const p = Math.min(1.0, (transitionTime - 0.15) / 1.05)
              glowScaleBoost = 6.0 + (1.0 - 6.0) * p
              haloScaleBoost = 7.0 + (1.0 - 7.0) * p
              ringScaleBoost = 2.2 + (1.0 - 2.2) * p
              
              emissiveIntensityBoost = 5.0 + (1.0 - 5.0) * p
              haloOpacityBoost = 2.0 + (1.0 - 2.0) * p
              ringOpacityBoost = 0.1 + (1.0 - 0.1) * p
            }
          }
        }
      }

      // Update shockwave rings
      shockwaveRings.forEach((ring, i) => {
        const mat = ring.material as THREE.LineBasicMaterial
        if (reducedMotion) {
          ring.scale.setScalar(1.0)
          mat.opacity = 0.0
          return
        }
        if (transitionTime >= 0) {
          const delay = i * 0.15
          const duration = 0.90
          if (transitionTime < delay) {
            ring.scale.setScalar(1.0)
            mat.opacity = 0.0
          } else if (transitionTime <= delay + duration) {
            const t_ring = (transitionTime - delay) / duration
            const targetScale = 5.0 - i
            
            // 1.0 -> targetScale -> 1.0
            const scaleFactor = 1.0 + (targetScale - 1.0) * Math.sin(t_ring * Math.PI)
            ring.scale.setScalar(scaleFactor)
            
            // Peak opacity 1.0, fade to 0.0
            mat.opacity = Math.sin(t_ring * Math.PI)
          } else {
            if (section) {
              ring.scale.setScalar((5.0 - i) + 0.1 * Math.sin(t * 0.4 + i * 0.2))
              mat.opacity = 0.02 + 0.03 * (0.5 + 0.5 * Math.sin(t * 0.5 + i * 0.3))
            } else {
              ring.scale.setScalar(1.0)
              mat.opacity = 0.0
            }
          }
        } else {
          if (section) {
            ring.scale.setScalar((5.0 - i) + 0.1 * Math.sin(t * 0.4 + i * 0.2))
            mat.opacity = 0.02 + 0.03 * (0.5 + 0.5 * Math.sin(t * 0.5 + i * 0.3))
          } else {
            ring.scale.setScalar(1.0)
            mat.opacity = 0.0
          }
        }
      })

      // Target active parameters — defaults to home state
      let targetProfile = {
        amp: hover ? 0.20 : 0.14,
        rotSpeed: hover ? 0.020 : 0.06,
        glowOpacity: (section ? 0.85 * 1.40 : (hover ? 0.85 * 1.15 : 0.85)) * emissiveIntensityBoost,
        haloOpacity: (section ? 0.28 * 1.35 : (hover ? 0.28 * 1.15 : 0.28)) * haloOpacityBoost,
        freq: 4.0,
        glowScale: hover ? 1.10 : 1.0,
      }

      // Smooth interpolation (lerp takes ~0.8 seconds with a LERP factor of 0.07)
      const LERP_VAL = reducedMotion ? 1.0 : 0.07
      currentHoverAmp += (targetProfile.amp - currentHoverAmp) * LERP_VAL
      currentHoverRotSpeed += (targetProfile.rotSpeed - currentHoverRotSpeed) * LERP_VAL
      currentGlowScaleMult += (targetProfile.glowScale - currentGlowScaleMult) * LERP_VAL
      currentHoverGlowIntensity += (targetProfile.glowOpacity - currentHoverGlowIntensity) * LERP_VAL
      currentHoverHaloBrightness += (targetProfile.haloOpacity - currentHoverHaloBrightness) * LERP_VAL
      currentFreq += (targetProfile.freq - currentFreq) * LERP_VAL
      currentHaloScaleBoost += (haloScaleBoost - currentHaloScaleBoost) * LERP_VAL

      const targetRingOpacity = (section ? 0.35 : 0.15) * ringOpacityBoost
      currentRingOpacity += (targetRingOpacity - currentRingOpacity) * LERP_VAL

      // Update concentric ring opacities
      ringsGroup.children.forEach((ring, i) => {
        if (ring instanceof THREE.LineLoop) {
          const mat = ring.material as THREE.LineBasicMaterial
          mat.opacity = currentRingOpacity * Math.pow(1 - i / 8, 1.5)
        }
      })

      // Apply to uniform materials
      glowMat.uniforms.uOpacity.value = currentHoverGlowIntensity
      const haloBreathe = (section && !reducedMotion) ? (1.0 + 0.05 * Math.sin(t * 0.7)) : 1.0
      haloMat.uniforms.uOpacity.value = currentHoverHaloBrightness * haloBreathe
      
      // Lerp core color & emissive properties
      const targetColor = section ? colorLight : colorDark
      material.color.lerp(targetColor, LERP_VAL)

      const targetEmissiveColor = section ? emissiveLight : emissiveDark
      material.emissive.lerp(targetEmissiveColor, LERP_VAL)

      const targetEmissiveIntensity = (section ? 0.7 : 0) * emissiveIntensityBoost
      material.emissiveIntensity += (targetEmissiveIntensity - material.emissiveIntensity) * LERP_VAL

      if (section) {
        blob.visible = false
      } else {
        blob.visible = true
      }

      // Brighten the orange tone slightly when hover/resonance
      const ratio = currentHoverHaloBrightness / 0.28
      glowMat.uniforms.uColor.value.copy(baseOrange).lerp(brightOrange, Math.max(0, ratio - 1.0))

      if (section && !reducedMotion) {
        const toneVar = 1.0 + 0.03 * Math.sin(t * 1.25)
        glowMat.uniforms.uColor.value.multiplyScalar(toneVar)
      }

      // ── vertex displacement — fluid organic liquid morphing ──
      const pos = geometry.attributes.position
      const freq1 = currentFreq
      const freq2 = currentFreq * 1.5
      const timeSpeed = 1.2
      const amp = reducedMotion ? 0 : currentHoverAmp

      for (let i = 0; i < pos.count; i++) {
        const ox = originalPositions[i * 3]
        const oy = originalPositions[i * 3 + 1]
        const oz = originalPositions[i * 3 + 2]

        // Overlapping waves for a smooth, organic liquid-like flow
        const n1 = Math.sin(ox * freq1 + t * timeSpeed) * Math.cos(oy * freq1 - t * timeSpeed * 0.8)
        const n2 = Math.sin(oz * freq2 - t * timeSpeed * 1.1) * Math.cos(ox * freq2 + t * timeSpeed * 0.9)
        const n3 = Math.sin(oy * 5.0 + t * 0.6) * Math.cos(oz * 5.0 - t * 0.8)
        
        const noise = (n1 * 0.5 + n2 * 0.35 + n3 * 0.15) * amp

        pos.setXYZ(i, ox + ox * noise, oy + oy * noise, oz + oz * noise)
      }
      pos.needsUpdate = true
      geometry.computeVertexNormals()

      // ── subtle slow rotation using delta time ──
      accumulatedRotationY += dt * (reducedMotion ? 0 : currentHoverRotSpeed)
      blob.rotation.y = accumulatedRotationY
      blob.rotation.x = reducedMotion ? 0 : Math.sin(t * 0.04) * 0.1

      // ── lerp position / scale toward target ──
      const aspect = w / h
      if (section) {
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

      const LERP = reducedMotion ? 1.0 : 0.08
      currentX += (targetX - currentX) * LERP
      currentY += (targetY - currentY) * LERP
      currentScale += (targetScale - currentScale) * LERP

      blob.position.set(currentX, currentY, 0)
      glow.position.set(currentX, currentY, 0)
      halo.position.set(currentX, currentY, 0)
      ringsGroup.position.set(currentX, currentY, -0.3)
      shockwavesGroup.position.set(currentX, currentY, -0.05)

      blob.scale.setScalar(currentScale)
      ringsGroup.scale.setScalar(ringScaleBoost)
      
      // Glow and halo gently pulse and scale by currentGlowScaleMult on hover and burst
      const glowPulse = reducedMotion ? 1.0 : (1.0 + Math.sin(t * 0.8) * 0.05)
      const glowBreathe = (section && !reducedMotion) ? (1.0 + 0.02 * Math.sin(t * 0.9)) : 1.0
      glow.scale.setScalar(glowPulse * currentGlowScaleMult * currentHaloScaleBoost * glowScaleBoost * glowBreathe)
      
      const haloPulse = reducedMotion ? 1.0 : (1.0 + Math.cos(t * 0.5) * 0.04)
      halo.scale.setScalar(haloPulse * currentGlowScaleMult * currentHaloScaleBoost * haloScaleBoost)

      renderer.render(scene, camera)
    }

    animate()

    // ─── Resize ───────────────────────────────────────────────────────────────
    const onResize = () => {
      w = mount.clientWidth || window.innerWidth
      h = mount.clientHeight || window.innerHeight
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
      glowGeo.dispose()
      glowMat.dispose()
      haloGeo.dispose()
      haloMat.dispose()

      ringsGroup.children.forEach((child) => {
        if (child instanceof THREE.LineLoop) {
          child.geometry.dispose()
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose())
          } else {
            child.material.dispose()
          }
        }
      })

      shockwavesGroup.children.forEach((child) => {
        if (child instanceof THREE.LineLoop) {
          child.geometry.dispose()
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose())
          } else {
            child.material.dispose()
          }
        }
      })

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
