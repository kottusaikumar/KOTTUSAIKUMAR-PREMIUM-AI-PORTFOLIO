import { useEffect, useRef, useState } from 'react'
import { personal } from '../data/portfolio'

export function AudioControl() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => () => audioRef.current?.pause(), [])

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) audio.pause()
    else await audio.play().catch(() => setPlaying(false))
  }

  return (
    <div className="audio-control">
      <button type="button" className="icon-button" onClick={toggle} aria-label={playing ? 'Pause spoken introduction' : 'Play spoken introduction'} aria-pressed={playing}>
        <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>
      </button>
      <span className="audio-label">{playing ? 'Playing' : 'Listen'}</span>
      <audio ref={audioRef} src={personal.audio} preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} />
    </div>
  )
}
