import { useEffect, useRef, useState } from 'react'
import type { Project } from '../types/portfolio'
import { MediaErrorFallback } from './MediaErrorFallback'

export function ProjectVideo({
  project,
  active,
  mediaReady,
  controls = false,
  mobilePreview = false,
  mobileActive = false,
  onMobileActivate,
}: {
  project: Project
  active: boolean
  mediaReady: boolean
  controls?: boolean
  mobilePreview?: boolean
  mobileActive?: boolean
  onMobileActivate?: () => void
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)
  const [requested, setRequested] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (!video || controls || mobilePreview || !mediaReady) return
    if (active) {
      video.currentTime = 0
      video.play().catch(() => undefined)
    } else {
      video.pause()
    }
  }, [active, controls, mediaReady, mobilePreview])

  useEffect(() => {
    const video = ref.current
    if (!video || !mobilePreview || mobileActive) return
    video.pause()
  }, [mobileActive, mobilePreview])

  useEffect(() => {
    if (!mobilePreview) return
    const pauseWhenHidden = () => {
      if (document.hidden) ref.current?.pause()
    }
    document.addEventListener('visibilitychange', pauseWhenHidden)
    return () => document.removeEventListener('visibilitychange', pauseWhenHidden)
  }, [mobilePreview])

  const activateMobilePreview = () => {
    const video = ref.current
    if (!video || !mediaReady) return
    onMobileActivate?.()
    if (!requested) {
      video.src = project.video
      video.load()
      setRequested(true)
    }
    video.play().catch(() => undefined)
  }

  if (failed) return <MediaErrorFallback label={project.title} />

  const video = (
    <video
      ref={ref}
      className="project-video"
      src={!mobilePreview && mediaReady ? project.video : undefined}
      poster={mediaReady ? project.poster : undefined}
      muted
      loop
      playsInline
      controls={controls && (!mobilePreview || requested)}
      preload="none"
      aria-label={`${project.title} demonstration`}
      onPlay={mobilePreview ? onMobileActivate : undefined}
      onError={() => setFailed(true)}
    />
  )

  if (!mobilePreview) return video

  return (
    <div className={`project-preview${requested ? ' is-requested' : ''}`}>
      {video}
      {!requested && (
        <button className="project-preview-button" type="button" onClick={activateMobilePreview} disabled={!mediaReady}>
          <span aria-hidden="true">▶</span>
          {mediaReady ? 'Play preview' : 'Loading preview'}
        </button>
      )}
    </div>
  )
}
