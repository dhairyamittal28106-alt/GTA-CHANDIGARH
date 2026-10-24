import { useState } from 'react'
import { useCharacterShopStore } from './CharacterAndShopStore'
import { sound } from './AudioEngine'

export function ElanteMallModal() {
  const { isElanteMallOpen, toggleElanteMall, openShop, cash } =
    useCharacterShopStore()

  const [activeTab, setActiveTab] = useState<'atrium' | 'cinema' | 'foodcourt'>('atrium')
  const [isPlayingMovie, setIsPlayingMovie] = useState(false)
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0)

  if (!isElanteMallOpen) return null

  const movies = [
    {
      title: 'CHANDIGARH AMRITSAR CHANDIGARH',
      genre: 'Romantic Comedy / Punjabi Cinema',
      rating: '⭐⭐⭐⭐⭐ 9.4/10',
      duration: '2h 15m · PVR IMAX Screen 1',
      synopsis:
        'A charming girl from Chandigarh visits Amritsar and experiences a whirlwind day of culture, heritage, and unexpected romance through the vibrant lanes of Punjab.',
      showtime: 'NOW SCREENING · AUDITORIUM 1',
      badge: 'BLOCKBUSTER',
      color: '#ea580c',
    },
    {
      title: 'LE CORBUSIER: THE CITY BEAUTIFUL',
      genre: 'Architectural Documentary / World Cinema',
      rating: '⭐⭐⭐⭐⭐ 9.8/10',
      duration: '1h 48m · PVR Director’s Cut Screen 2',
      synopsis:
        'The master architect’s journey in creating Chandigarh from the foothills of the Shivaliks. Featuring Sector 17 Piazza, Capitol Complex, and the Open Hand monument.',
      showtime: 'NEXT SHOW: 7:30 PM · AUDITORIUM 2',
      badge: 'SPECIAL SCREENING',
      color: '#0284c7',
    },
    {
      title: 'PUNJAB 1984: ECHOES OF VALOR',
      genre: 'Historical Epic / Drama',
      rating: '⭐⭐⭐⭐⭐ 9.6/10',
      duration: '2h 38m · PVR 4DX Screen 3',
      synopsis:
        'A mother’s relentless journey through Punjab during troubled times, depicting resilience, love, and the enduring spirit of Punjab.',
      showtime: 'NOW SCREENING · AUDITORIUM 3',
      badge: 'CRITICS CHOICE',
      color: '#b91c1c',
    },
  ]

  const movie = movies[currentMovieIndex]

  const handleWatchMovie = () => {
    setIsPlayingMovie(true)
    sound.playCinemaTheme()
  }

  const handleOrderSnack = (item: string, cost: number) => {
    if (cash >= cost) {
      sound.playCashRegister()
      useCharacterShopStore.getState().addCash(-cost)
      alert(`🍿 Purchased ${item} from Elante PVR Concessions! Enjoy the movie screening.`)
    } else {
      alert('Insufficient Chandigarh Cash!')
    }
  }

  return (
    <div className="shop-overlay" onClick={() => toggleElanteMall(false)}>
      <div className="elante-modal" onClick={(e) => e.stopPropagation()}>
        {/* Mall Header Banner */}
        <div className="elante-header">
          <div className="elante-badge-tag">CHANDIGARH’S LARGEST SHOPPING DESTINATION</div>
          <div className="elante-title-row">
            <div>
              <h2>ELANTE MALL & PVR MULTIPLEX</h2>
              <p>Phase 1 · 1.15 Million Sq. Ft. of Luxury Retail, Multiplex Cinemas & Fine Dining</p>
            </div>
            <button className="shop-close-btn" onClick={() => toggleElanteMall(false)}>
              ✕
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="elante-tabs">
            <button
              className={`elante-tab ${activeTab === 'atrium' ? 'active' : ''}`}
              onClick={() => setActiveTab('atrium')}
            >
              🏬 RETAIL ATRIUM & SHOPS
            </button>
            <button
              className={`elante-tab ${activeTab === 'cinema' ? 'active' : ''}`}
              onClick={() => setActiveTab('cinema')}
            >
              🎬 PVR MULTIPLEX CINEMA (WATCH MOVIES)
            </button>
            <button
              className={`elante-tab ${activeTab === 'foodcourt' ? 'active' : ''}`}
              onClick={() => setActiveTab('foodcourt')}
            >
              🍔 FOOD LOUNGE & CAFE
            </button>
          </div>
        </div>

        {/* Tab 1: Retail Atrium & Brand Corridors */}
        {activeTab === 'atrium' && (
          <div className="elante-body">
            <div className="atrium-banner">
              <div className="atrium-banner-text">
                <h3>Grand Central Atrium Promenade</h3>
                <p>
                  Explore three levels of flagship stores under the soaring glass skylight dome. Visit official boutiques of Nike, Adidas, Reebok, and Skechers.
                </p>
              </div>
            </div>

            <div className="mall-stores-grid">
              {/* Nike Boutique Card */}
              <div className="mall-store-card nike-card">
                <div className="mall-card-brand">NIKE STORE</div>
                <h4>Air Jordan & Running Hub</h4>
                <p>Browse latest Air Jordan 1s, Air Max releases, and Dri-FIT athletic apparel.</p>
                <button
                  className="mall-visit-btn"
                  onClick={() => {
                    toggleElanteMall(false)
                    openShop('nike')
                  }}
                >
                  ENTER NIKE BOUTIQUE →
                </button>
              </div>

              {/* Adidas Originals Card */}
              <div className="mall-store-card adidas-card">
                <div className="mall-card-brand">ADIDAS ORIGINALS</div>
                <h4>Trefoil & Streetwear Concourse</h4>
                <p>Explore classic Samba OGs, Ultraboost footwear, and iconic Firebird track jackets.</p>
                <button
                  className="mall-visit-btn"
                  onClick={() => {
                    toggleElanteMall(false)
                    openShop('adidas')
                  }}
                >
                  ENTER ADIDAS BOUTIQUE →
                </button>
              </div>

              {/* Reebok Classic Card */}
              <div className="mall-store-card reebok-card">
                <div className="mall-card-brand">REEBOK HERITAGE</div>
                <h4>Club C & Retro Fitness</h4>
                <p>Discover soft garment leather Club C 85 vintage kicks and 90s vector windbreakers.</p>
                <button
                  className="mall-visit-btn"
                  onClick={() => {
                    toggleElanteMall(false)
                    openShop('reebok')
                  }}
                >
                  ENTER REEBOK BOUTIQUE →
                </button>
              </div>

              {/* Skechers Comfort Card */}
              <div className="mall-store-card skechers-card">
                <div className="mall-card-brand">SKECHERS COMFORT</div>
                <h4>Hands-Free Slip-Ins & D'Lites</h4>
                <p>Step into pure comfort with Air-Cooled Memory Foam and slip-in convenience.</p>
                <button
                  className="mall-visit-btn"
                  onClick={() => {
                    toggleElanteMall(false)
                    openShop('skechers')
                  }}
                >
                  ENTER SKECHERS BOUTIQUE →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: PVR Multiplex Cinema & Movie Screen */}
        {activeTab === 'cinema' && (
          <div className="elante-body cinema-view">
            {/* Giant Simulated Cinema Projection Screen */}
            <div className="cinema-screen-box">
              <div className="screen-frame">
                {isPlayingMovie ? (
                  <div className="projector-playing">
                    <div className="projector-beam" />
                    <div className="movie-scene-visual">
                      <div className="scene-logo">🎬 PVR CINEMAS · ELANTE</div>
                      <h3>{movie.title}</h3>
                      <p className="scene-desc">NOW PLAYING IN DOLBY ATMOS 7.1 SURROUND</p>
                      <div className="scene-animation-strip">
                        <div className="strip-bar" />
                        <div className="strip-bar delay-1" />
                        <div className="strip-bar delay-2" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="projector-standby">
                    <div className="standby-marquee">
                      <span className="marquee-badge">{movie.badge}</span>
                      <h3>{movie.title}</h3>
                      <p>{movie.duration}</p>
                    </div>
                    <button className="watch-movie-btn" onClick={handleWatchMovie}>
                      ▶ SIT DOWN & WATCH MOVIE NOW
                    </button>
                  </div>
                )}
              </div>
              <div className="cinema-seats-graphic">
                <span className="seat-label">Auditorium Front Row Seats (You are seated in Center Row F-12)</span>
              </div>
            </div>

            {/* Movie Selector Carousel & Details */}
            <div className="cinema-details-pane">
              <div className="movie-selector-tabs">
                {movies.map((m, idx) => (
                  <button
                    key={idx}
                    className={`movie-tab-btn ${currentMovieIndex === idx ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentMovieIndex(idx)
                      setIsPlayingMovie(false)
                    }}
                  >
                    {m.title}
                  </button>
                ))}
              </div>

              <div className="movie-meta-card">
                <div className="meta-badge" style={{ background: movie.color }}>
                  {movie.badge}
                </div>
                <h3>{movie.title}</h3>
                <p className="meta-genre">{movie.genre}</p>
                <p className="meta-rating">{movie.rating}</p>
                <p className="meta-synopsis">{movie.synopsis}</p>

                <div className="concession-bar">
                  <span className="concession-title">🍿 Movie Concessions & Snacks:</span>
                  <div className="snack-buttons">
                    <button
                      className="snack-btn"
                      onClick={() => handleOrderSnack('Buttery Jumbo Popcorn', 250)}
                    >
                      Buttery Popcorn (₹250)
                    </button>
                    <button
                      className="snack-btn"
                      onClick={() => handleOrderSnack('Crispy Cheese Nachos', 220)}
                    >
                      Cheese Nachos (₹220)
                    </button>
                    <button
                      className="snack-btn"
                      onClick={() => handleOrderSnack('Chilled Fountain Cola', 120)}
                    >
                      Fountain Cola (₹120)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Food Court */}
        {activeTab === 'foodcourt' && (
          <div className="elante-body">
            <div className="food-court-grid">
              <div className="food-card">
                <h4>Amritsari Kulcha Junction</h4>
                <p>Crispy stuffed tandoori kulchas with spicy chole, tangy tamarind chutney & dollop of white butter.</p>
                <button
                  className="order-btn"
                  onClick={() => handleOrderSnack('Special Amritsari Kulcha Platter', 180)}
                >
                  ORDER PLATER (₹180)
                </button>
              </div>

              <div className="food-card">
                <h4>Sector 17 Classic Cold Coffee & Shakes</h4>
                <p>Creamy whipped espresso cold coffee topped with vanilla chocolate swirl.</p>
                <button
                  className="order-btn"
                  onClick={() => handleOrderSnack('Classic Thick Cold Coffee', 140)}
                >
                  ORDER DRINK (₹140)
                </button>
              </div>

              <div className="food-card">
                <h4>Punjab Sweet Lounge</h4>
                <p>Hot Gulab Jamuns, Rasmalai & Jalebi with Rabri.</p>
                <button
                  className="order-btn"
                  onClick={() => handleOrderSnack('Kesar Rasmalai Dual Cup', 150)}
                >
                  ORDER DESSERT (₹150)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
