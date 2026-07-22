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
  const [playing, setPlaying] = useState(false)

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

  const toggleMobilePreview = () => {
    if (!requested) {
      activateMobilePreview()
      return
    }

    const video = ref.current
    if (!video) return
    if (video.paused) {
      onMobileActivate?.()
      video.play().catch(() => undefined)
    } else {
      video.pause()
    }
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
      controls={controls && !mobilePreview}
      preload="none"
      aria-label={`${project.title} demonstration`}
      onPlay={mobilePreview ? () => {
        setPlaying(true)
        onMobileActivate?.()
      } : undefined}
      onPause={mobilePreview ? () => setPlaying(false) : undefined}
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
      <button
        className="project-preview-button is-icon"
        type="button"
        onClick={toggleMobilePreview}
        disabled={!mediaReady}
        aria-label={`${playing ? 'Pause' : 'Play'} ${project.title} preview`}
      >
        <span aria-hidden="true">{playing ? '❚❚' : '▶'}</span>
      </button>
    </div>
  )
}
