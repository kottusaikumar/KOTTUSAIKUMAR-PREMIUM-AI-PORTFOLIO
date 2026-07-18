import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import type * as ThreeNS from 'three'

type ThreeModule = typeof ThreeNS

// ============================================================================
// Adapted from the "Sticker Peel" (Originkit) Framer component.
// Differences from the original:
//  - three.js is lazy-loaded on mount instead of a static top-level import,
//    so the ~150kb dependency never ships to visitors on mobile or with
//    reduced motion, where this component is never mounted.
//  - Curl animation is driven by GSAP (already used everywhere else in this
//    project) instead of Framer Motion, avoiding a second animation library.
//  - The render loop only runs while a tween is in flight; a single frame is
//    flushed on settle, mount and unmount are fully disposed (geometry,
//    materials, textures, renderer), guarding against React StrictMode's
//    double-invoke.
// ============================================================================

const CAMERA_DISTANCE = 1200
const CAMERA_NEAR = 100
const CAMERA_FAR = 2000
const STICKER_DEPTH = 0.003
const CANVAS_SCALE = 3
const BONE_GRID_X = 16
const BONE_GRID_Y = 16
const SEGMENTS_W = 48
const SEGMENTS_H = 36
const FIXED_CURL_RADIUS = 0.15
const FIXED_CURL_FACTOR = 0.6

function calculateCameraFov(width: number, height: number, distance: number): number {
  const aspect = width / height
  return 2 * Math.atan(width / aspect / (2 * distance)) * (180 / Math.PI)
}

function mapInternalRadiusToUIValue(ui: number): number {
  const clamped = Math.max(0.1, Math.min(1, ui))
  const t = (clamped - 0.1) / (1 - 0.1)
  return 0.05 + t * (1 / Math.PI - 0.05)
}

interface StickerPeelProps {
  /** Front face image (data URL or same-origin URL). */
  image: string
  width?: number
  height?: number
  /** Curl direction in degrees. */
  curlRotation?: number
  hoverPeel?: number
  pressPeel?: number
  durationSeconds?: number
  /** Underside color shown on the peeled flap. */
  backColor?: string
  className?: string
  ariaHidden?: boolean
}

export function StickerPeel({
  image,
  width = 96,
  height = 96,
  curlRotation = 235,
  hoverPeel = 36,
  pressPeel = 56,
  durationSeconds = 0.6,
  backColor = '#0b6038',
  className = '',
  ariaHidden = true,
}: StickerPeelProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const threeRef = useRef<ThreeModule | null>(null)
  const sceneRef = useRef<ThreeNS.Scene | null>(null)
  const rendererRef = useRef<ThreeNS.WebGLRenderer | null>(null)
  const cameraRef = useRef<ThreeNS.PerspectiveCamera | null>(null)
  const meshRef = useRef<ThreeNS.SkinnedMesh | null>(null)
  const bonesRef = useRef<ThreeNS.Bone[]>([])
  const bonesInitialRef = useRef<ThreeNS.Vector3[]>([])
  const curlAmountRef = useRef({ value: 0 })
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const loopIdRef = useRef<number | null>(null)
  const disposedRef = useRef(false)
  const [ready, setReady] = useState(false)

  const renderFrame = useCallback(() => {
    const renderer = rendererRef.current
    const scene = sceneRef.current
    const camera = cameraRef.current
    if (!renderer || !scene || !camera) return
    const gl = renderer.getContext()
    if (!gl || gl.isContextLost()) return
    renderer.render(scene, camera)
  }, [])

  const updateBones = useCallback(() => {
    const THREE = threeRef.current
    const mesh = meshRef.current
    if (!THREE || !mesh || !bonesRef.current.length) return

    const amount = Math.min(1, Math.max(0, curlAmountRef.current.value))
    const curlStart = 1 - amount
    const curlFactor = amount <= 0 ? 1e-4 : FIXED_CURL_FACTOR
    const r = mapInternalRadiusToUIValue(FIXED_CURL_RADIUS)
    const w = width
    const h = height
    const rotRad = curlRotation * (Math.PI / 180)
    const dirX = Math.cos(rotRad)
    const dirY = Math.sin(rotRad)
    const rotAxis = new THREE.Vector3(-dirY, dirX, 0).normalize()
    const halfW = w / 2
    const halfH = h / 2
    const maxDistAlongDir = Math.max(
      halfW * dirX + halfH * dirY,
      halfW * dirX - halfH * dirY,
      -halfW * dirX + halfH * dirY,
      -halfW * dirX - halfH * dirY,
    )
    const maxDistFromCenter = Math.sqrt(w * w + h * h) / 2
    const foldOffset = -maxDistAlongDir + curlStart * 2 * maxDistAlongDir
    const radiusWorld = r * maxDistFromCenter
    const rPrime = radiusWorld / curlFactor
    const arcLimit = Math.PI * radiusWorld
    const quat = new THREE.Quaternion()

    const bones = bonesRef.current
    const initial = bonesInitialRef.current
    for (let i = 0; i < bones.length; i++) {
      const bone = bones[i]
      const p0 = initial[i]
      const distOnDir = p0.x * dirX + p0.y * dirY
      const signed = distOnDir - foldOffset

      if (signed > 0) {
        let xRel: number, zRel: number, angle: number
        const angleS = (signed * curlFactor) / radiusWorld
        if (signed <= arcLimit) {
          xRel = rPrime * Math.sin(angleS)
          zRel = rPrime * (1 - Math.cos(angleS))
          angle = angleS
        } else {
          const phi = Math.PI * curlFactor
          const xArcEnd = rPrime * Math.sin(phi)
          const zArcEnd = rPrime * (1 - Math.cos(phi))
          const extra = signed - arcLimit
          xRel = xArcEnd + extra * Math.cos(phi)
          zRel = zArcEnd + extra * Math.sin(phi)
          angle = phi
        }
        const dx = xRel - signed
        bone.position.set(p0.x + dx * dirX, p0.y + dx * dirY, p0.z + zRel)
        quat.setFromAxisAngle(rotAxis, -angle)
        bone.quaternion.copy(quat)
      } else {
        bone.position.copy(p0)
        bone.quaternion.identity()
      }
    }
    mesh.skeleton.update()
  }, [width, height, curlRotation])

  const stopLoop = useCallback(() => {
    if (loopIdRef.current !== null) {
      cancelAnimationFrame(loopIdRef.current)
      loopIdRef.current = null
    }
    requestAnimationFrame(() => renderFrame())
  }, [renderFrame])

  const startLoop = useCallback(() => {
    if (loopIdRef.current !== null) return
    const loop = () => {
      updateBones()
      renderFrame()
      loopIdRef.current = requestAnimationFrame(loop)
    }
    loopIdRef.current = requestAnimationFrame(loop)
  }, [updateBones, renderFrame])

  const animateTo = useCallback(
    (target: number) => {
      tweenRef.current?.kill()
      startLoop()
      tweenRef.current = gsap.to(curlAmountRef.current, {
        value: target,
        duration: durationSeconds,
        ease: 'power2.inOut',
        onComplete: stopLoop,
      })
    },
    [durationSeconds, startLoop, stopLoop],
  )

  // Mount: lazy-load three.js and build the scene.
  useEffect(() => {
    disposedRef.current = false
    let cancelled = false

    async function init() {
      const THREE = await import('three')
      if (cancelled || disposedRef.current) return
      threeRef.current = THREE
      const canvas = canvasRef.current
      if (!canvas) return

      const canvasWidth = width * CANVAS_SCALE
      const canvasHeight = height * CANVAS_SCALE

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(
        calculateCameraFov(canvasWidth, canvasHeight, CAMERA_DISTANCE),
        canvasWidth / canvasHeight,
        CAMERA_NEAR,
        CAMERA_FAR,
      )
      camera.position.set(0, 0, CAMERA_DISTANCE)
      camera.lookAt(0, 0, 0)

      let renderer: ThreeNS.WebGLRenderer
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
      } catch {
        return
      }
      const gl = renderer.getContext()
      if (!gl || gl.isContextLost()) {
        renderer.dispose()
        return
      }
      renderer.setSize(canvasWidth, canvasHeight, false)
      renderer.setPixelRatio(1)
      sceneRef.current = scene
      cameraRef.current = camera
      rendererRef.current = renderer

      const geometry = new THREE.BoxGeometry(width, height, STICKER_DEPTH, SEGMENTS_W, SEGMENTS_H, 1)
      const position = geometry.attributes.position
      const vertex = new THREE.Vector3()
      const skinIndexes: number[] = []
      const skinWeights: number[] = []
      for (let i = 0; i < position.count; i++) {
        vertex.fromBufferAttribute(position, i)
        const nx = (vertex.x + width / 2) / width
        const ny = (vertex.y + height / 2) / height
        const gx = nx * (BONE_GRID_X - 1)
        const gy = ny * (BONE_GRID_Y - 1)
        const x0 = Math.floor(gx)
        const y0 = Math.floor(gy)
        const x1 = Math.min(x0 + 1, BONE_GRID_X - 1)
        const y1 = Math.min(y0 + 1, BONE_GRID_Y - 1)
        const tx = gx - x0
        const ty = gy - y0
        skinIndexes.push(y0 * BONE_GRID_X + x0, y0 * BONE_GRID_X + x1, y1 * BONE_GRID_X + x0, y1 * BONE_GRID_X + x1)
        skinWeights.push((1 - tx) * (1 - ty), tx * (1 - ty), (1 - tx) * ty, tx * ty)
      }
      geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndexes, 4))
      geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4))
      geometry.computeVertexNormals()

      const bones: ThreeNS.Bone[] = []
      const spacingX = width / (BONE_GRID_X - 1)
      const spacingY = height / (BONE_GRID_Y - 1)
      for (let y = 0; y < BONE_GRID_Y; y++) {
        for (let x = 0; x < BONE_GRID_X; x++) {
          const bone = new THREE.Bone()
          bone.position.set(-width / 2 + x * spacingX, -height / 2 + y * spacingY, 0)
          bones.push(bone)
        }
      }
      bonesRef.current = bones
      bonesInitialRef.current = bones.map((b) => b.position.clone())
      const skeleton = new THREE.Skeleton(bones)

      const loader = new THREE.TextureLoader()
      const texture = await new Promise<ThreeNS.Texture>((resolve, reject) => {
        loader.load(image, resolve, undefined, reject)
      }).catch(() => null)
      if (cancelled || disposedRef.current) {
        texture?.dispose()
        return
      }
      if (texture) {
        texture.colorSpace = THREE.SRGBColorSpace
        texture.minFilter = THREE.LinearFilter
      }

      const frontMaterial = new THREE.MeshStandardMaterial({
        map: texture ?? undefined,
        transparent: true,
        roughness: 0.25,
        metalness: 0.1,
        emissive: new THREE.Color(0xffffff),
        emissiveMap: texture ?? undefined,
        emissiveIntensity: 0.35,
      })
      const backMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(backColor),
        roughness: 0.4,
        metalness: 0,
      })
      const sideMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color(backColor), roughness: 0.4 })
      const materials = [sideMaterial, sideMaterial, sideMaterial, sideMaterial, frontMaterial, backMaterial]

      const mesh = new THREE.SkinnedMesh(geometry, materials)
      mesh.frustumCulled = false
      bones.forEach((bone) => mesh.add(bone))
      mesh.bind(skeleton)
      meshRef.current = mesh
      scene.add(mesh)

      const ambient = new THREE.AmbientLight(0xffffff, 0.7)
      scene.add(ambient)
      const directional = new THREE.DirectionalLight(0xffffff, 1.1)
      directional.position.set(-300, 200, 400)
      scene.add(directional)

      updateBones()
      renderFrame()
      setReady(true)
    }

    void init()

    return () => {
      cancelled = true
      disposedRef.current = true
      tweenRef.current?.kill()
      if (loopIdRef.current !== null) cancelAnimationFrame(loopIdRef.current)
      const mesh = meshRef.current
      if (mesh) {
        mesh.geometry.dispose()
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        mats.forEach((mat) => {
          const m = mat as ThreeNS.MeshStandardMaterial
          m.map?.dispose()
          m.emissiveMap?.dispose()
          m.dispose()
        })
      }
      rendererRef.current?.dispose()
      sceneRef.current = null
      cameraRef.current = null
      rendererRef.current = null
      meshRef.current = null
      bonesRef.current = []
      bonesInitialRef.current = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, width, height, backColor])

  const handleEnter = useCallback(() => animateTo(hoverPeel / 100), [animateTo, hoverPeel])
  const handleLeave = useCallback(() => animateTo(0), [animateTo])
  const handleDown = useCallback(() => animateTo(pressPeel / 100), [animateTo, pressPeel])
  const handleUp = useCallback(() => animateTo(hoverPeel / 100), [animateTo, hoverPeel])

  return (
    <div
      ref={containerRef}
      className={`sticker-peel-layer ${className}`}
      style={{ width, height, opacity: ready ? 1 : 0 }}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      onPointerDown={handleDown}
      onPointerUp={handleUp}
      aria-hidden={ariaHidden}
    >
      <canvas ref={canvasRef} className="sticker-peel-canvas" />
    </div>
  )
}
