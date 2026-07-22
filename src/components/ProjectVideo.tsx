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
    const video = ref.current
    if (!video || !mobilePreview || !requested || !mobileActive) return
    video.play().catch(() => undefined)
  }, [mobileActive, mobilePreview, requested])

  useEffect(() => {
    if (!mobilePreview) return
    const pauseWhenHidden = () => {
      if (document.hidden) ref.current?.pause()
    }
    document.addEventListener('visibilitychange', pauseWhenHidden)
    return () => document.removeEventListener('visibilitychange', pauseWhenHidden)
  }, [mobilePreview])

  const activateMobilePreview = () => {
    if (!mediaReady) return
    onMobileActivate?.()
    setRequested(true)
  }

  if (failed) return <MediaErrorFallback label={project.title} />

  const video = requested || !mobilePreview ? (
    <video
      ref={ref}
      className="project-video"
      src={mediaReady ? project.video : undefined}
      poster={project.poster}
      muted
      loop
      playsInline
      controls={controls && (!mobilePreview || requested)}
      preload="none"
      aria-label={`${project.title} demonstration`}
      onPlay={mobilePreview ? onMobileActivate : undefined}
      onError={() => setFailed(true)}
    />
  ) : null

  if (!mobilePreview) return video

  return (
    <div className={`project-preview${requested ? ' is-requested' : ''}`}>
      {requested ? video : (
        <img
          className="project-preview-poster"
          src={project.poster}
          alt=""
          width="1280"
          height="720"
          loading="lazy"
          decoding="async"
        />
      )}
      {!requested && (
        <button className="project-preview-button" type="button" onClick={activateMobilePreview} disabled={!mediaReady}>
          <span aria-hidden="true">▶</span>
          {mediaReady ? 'Watch demo' : 'Loading preview'}
        </button>
      )}
    </div>
  )
}
