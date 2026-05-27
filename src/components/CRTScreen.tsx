import { useWorldStore, type WorldType } from '../store/useWorldStore';
import { worlds } from '../data/worlds';
import { TVGuideScreen } from './TVGuideScreen';

export const CRTScreen = () => {
  const currentWorld = useWorldStore((state) => state.currentWorld);
  const transitioning = useWorldStore((state) => state.transitioning);
  const transitionTo = useWorldStore((state) => state.transitionTo);
  const triggerSound = useWorldStore((state) => state.triggerSound);

  const handleSelectChannel = (channelId: WorldType) => {
    if (transitioning) return;
    triggerSound('thunk'); // heavy physical switch clunk!
    transitionTo(channelId);
  };

  const isHome = currentWorld === 'home';

  return (
    <div className="crt-screen-wrapper">
      {/* Curved CRT Glass glare effect */}
      <div className="crt-glare" />

      {/* Screen phosphor flicker */}
      <div className={`crt-flicker ${transitioning ? 'transitioning-glitch' : ''}`}>
        
        {/* If transitioning, render a severe fuzzy static screen overlay locally */}
        {transitioning && (
          <div className="static-noise-bg" style={{ opacity: 0.9, zIndex: 10 }} />
        )}

        {isHome ? (
          /* --- HOME MODE: 90S CABLE TV GUIDE SCREEN --- */
          <TVGuideScreen />
        ) : (
          /* --- WORLD MODE: 2000S CABLE TV "NOW AIRING" DIAGNOSTIC --- */
          <div className="crt-world-screen animate-fade-in">
            {/* Cable style header */}
            <div className="crt-world-header-bar">
              <span className="crt-world-header-title">NOW AIRING</span>
              <span className="crt-world-header-channel">{worlds[currentWorld].channel}</span>
            </div>

            {/* Main content box */}
            <div className="crt-world-info-container">
              <div className="crt-world-title-row">
                <span className="crt-world-ch-badge">
                  {worlds[currentWorld].guideAbbrev}
                </span>
                <span className="crt-world-main-title">
                  {worlds[currentWorld].title}
                </span>
              </div>

              <div className="crt-world-meta-box">
                <div className="crt-meta-row">
                  <span className="meta-label">RATING:</span>
                  <span className="crt-world-rating-label">{worlds[currentWorld].rating}</span>
                </div>
                <div className="crt-meta-row">
                  <span className="meta-label">AIRTIME:</span>
                  <span>{worlds[currentWorld].airTime}</span>
                </div>
                <div className="crt-meta-row">
                  <span className="meta-label">STATUS:</span>
                  <span className="crt-signal-status-text">DECODED & SECURED</span>
                </div>
              </div>

              {/* Fake Interactive TV guide signal status */}
              <div className="crt-world-signal-bar-row">
                <span className="signal-label">SIGNAL STRENGTH:</span>
                <div className="crt-signal-meter">
                  <span className="crt-signal-block active" />
                  <span className="crt-signal-block active" />
                  <span className="crt-signal-block active" />
                  <span className="crt-signal-block active" />
                  <span className="crt-signal-block active" />
                  <span className="crt-signal-block active" />
                  <span className="crt-signal-block active" />
                </div>
              </div>

              <div className="crt-world-telemetry-scroll">
                <div>PORTAL RES: VECTOR RESOLVED</div>
                <div>DEPTH RATIO: LOCK ON ACTIVE</div>
                <div>BANDWIDTH: 4.8 GB/S [MAX]</div>
              </div>

              <button
                className="crt-cable-return-btn"
                onMouseEnter={() => triggerSound('tick')}
                onClick={() => handleSelectChannel('home')}
              >
                ◀ RETURN TO GUIDE (MENU)
              </button>
            </div>

            {/* Decorative bottom ticker */}
            <div className="crt-world-footer-ticker">
              <div className="ticker-label">CABLE SEARCH:</div>
              <div className="ticker-text-scroll">
                CONNECTED TO SURREAL ARCHIVE · PRESS L/R ARROWS TO PAN CAMERA VIEW · USE SCREEN BUTTONS TO CONTROL VCR 
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
