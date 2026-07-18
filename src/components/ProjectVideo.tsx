import { useEffect, useRef, useState } from 'react'
import type { Project } from '../types/portfolio'
import { MediaErrorFallback } from './MediaErrorFallback'

export function ProjectVideo({ project, active, controls = false }: { project: Project; active: boolean; controls?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (!video || controls) return
    if (active) {
      video.currentTime = 0
      video.play().catch(() => undefined)
    } else {
      video.pause()
    }
  }, [active, controls])

  if (failed) return <MediaErrorFallback label={project.title} />

  return (
    <video
      ref={ref}
      className="project-video"
      src={project.video}
      poster={project.poster}
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
