import { useEffect, useRef, useState } from 'react'
import type { Project } from '../types/portfolio'
import { MediaErrorFallback } from './MediaErrorFallback'

export function ProjectVideo({
  project,
  active,
  mediaReady,
  controls = false,
}: {
  project: Project
  active: boolean
  mediaReady: boolean
  controls?: boolean
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (!video || controls || !mediaReady) return
    if (active) {
      video.currentTime = 0
      video.play().catch(() => undefined)
    } else {
      video.pause()
    }
  }, [active, controls, mediaReady])

  if (failed) return <MediaErrorFallback label={project.title} />

  return (
    <video
      ref={ref}
      className="project-video"
      src={mediaReady ? project.video : undefined}
      poster={mediaReady ? project.poster : undefined}
      muted
      loop
      playsInline
      controls={controls}
      preload="none"
      aria-label={`${project.title} demonstration`}
      onError={() => setFailed(true)}
    />
  )
}
