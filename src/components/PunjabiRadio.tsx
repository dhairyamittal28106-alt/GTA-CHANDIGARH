import { useState } from 'react'

const tracks = [
  { artist: 'Diljit Dosanjh', title: 'Born To Shine', videoId: 'dCmp56tSSmA' },
  { artist: 'Yo Yo Honey Singh', title: 'Millionaire', videoId: 'XO8wew38VM8' },
  { artist: 'Sunanda Sharma', title: 'Jaani Tera Naa', videoId: 'O3Z_LKxPJXQ' },
  { artist: 'Sidhu Moose Wala', title: '295', videoId: 'n_FCrCQ6-bA' },
  { artist: 'Masoom Sharma', title: 'Gunda · Haryanvi', videoId: 'zK6NBco-nKQ' },
  { artist: 'Shubh', title: 'Cheques', videoId: '4tywp83zkmk' },
]

function embedUrl(index: number) {
  const track = tracks[index]
  const queue = [...tracks.slice(index + 1), ...tracks.slice(0, index)]
    .map(item => item.videoId)
    .join(',')
  const params = new URLSearchParams({ autoplay: '1', controls: '1', playsinline: '1', rel: '0' })
  if (queue) params.set('playlist', queue)
  return `https://www.youtube.com/embed/${track.videoId}?${params.toString()}`
}

export function PunjabiRadio() {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const activeTrack = activeIndex === null ? null : tracks[activeIndex]

  return (
    <div className="radio-shell">
      <button
        id="btn-punjabi-radio"
        className={`hud-btn radio-toggle ${open ? 'active' : ''}`}
        type="button"
        aria-expanded={open}
        aria-controls="punjabi-radio-panel"
        onClick={() => {
          if (!open && activeIndex === null) setActiveIndex(0)
          setOpen(value => !value)
        }}
        title="Open the Punjabi music playlist"
      >
        🎵 PUNJABI RADIO
      </button>

      {open && (
        <section className="radio-panel" id="punjabi-radio-panel" aria-label="Punjabi radio playlist">
          <div className="radio-heading">
            <div>
              <strong>SECTOR 17 RADIO</strong>
              <span>6 songs · official YouTube videos</span>
            </div>
            <button className="radio-close" type="button" onClick={() => setOpen(false)} aria-label="Close Punjabi radio">
              ×
            </button>
          </div>

          {activeIndex === null ? (
            <div className="radio-idle">
              <span>Pick a track to start the playlist.</span>
              <span>The next song plays automatically.</span>
            </div>
          ) : (
            <div className="radio-player">
              <iframe
                key={activeIndex}
                src={embedUrl(activeIndex)}
                title={`Now playing ${activeTrack?.title} by ${activeTrack?.artist}`}
                allow="autoplay; encrypted-media; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
              <div className="radio-now-playing">NOW PLAYING · {activeTrack?.artist} — {activeTrack?.title}</div>
              {activeTrack && (
                <a
                  className="radio-youtube-link"
                  href={`https://www.youtube.com/watch?v=${activeTrack.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OPEN IN YOUTUBE ↗
                </a>
              )}
            </div>
          )}

          <ol className="radio-track-list">
            {tracks.map((track, index) => (
              <li key={track.videoId}>
                <button
                  type="button"
                  className={`radio-track ${activeIndex === index ? 'selected' : ''}`}
                  onClick={() => setActiveIndex(index)}
                  aria-current={activeIndex === index ? 'true' : undefined}
                  title={`Play ${track.title} by ${track.artist}`}
                >
                  <span className="radio-track-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="radio-track-copy"><strong>{track.title}</strong><small>{track.artist}</small></span>
                  <span className="radio-track-play">{activeIndex === index ? '▶' : 'PLAY'}</span>
                </button>
              </li>
            ))}
          </ol>
          <p className="radio-note">Music streams from YouTube. Playback starts when you choose a song.</p>
        </section>
      )}
    </div>
  )
}
