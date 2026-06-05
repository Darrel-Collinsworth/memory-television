import { useEffect } from 'react';
import { useWorldStore, type WorldType } from '../store/useWorldStore';
import { worlds } from '../data/worlds';
import { TVGuideScreen } from './TVGuideScreen';
import { HUB_ARTIFACTS, WORLD_ARTWORKS } from '../data/artifacts';

export const CRTScreen = () => {
  const currentWorld = useWorldStore((state) => state.currentWorld);
  const transitioning = useWorldStore((state) => state.transitioning);
  const transitionTo = useWorldStore((state) => state.transitionTo);
  const triggerSound = useWorldStore((state) => state.triggerSound);
  const selectedArtifactId = useWorldStore((state) => state.selectedArtifactId);
  const setSelectedArtifactId = useWorldStore((state) => state.setSelectedArtifactId);

  const handleSelectChannel = (channelId: WorldType) => {
    if (transitioning) return;
    triggerSound('thunk'); // heavy physical switch clunk!
    transitionTo(channelId);
  };

  // Listen for the Escape key to exit focus mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedArtifactId !== null) {
        setSelectedArtifactId(null);
        triggerSound('thunk');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedArtifactId, setSelectedArtifactId, triggerSound]);

  const isHome = currentWorld === 'home';

  // Look up selected artifact metadata in Hub Fragments or World Artworks
  const selectedArtifact = selectedArtifactId 
    ? (HUB_ARTIFACTS.find(f => f.id === selectedArtifactId) || 
       Object.values(WORLD_ARTWORKS).flat().find(a => a.id === selectedArtifactId))
    : undefined;

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

        {selectedArtifactId ? (
          /* --- ARTIFACT FOCUS MODE: RETRO BROADCAST MONITOR --- */
          <div className="crt-world-screen crt-artifact-focus-screen animate-fade-in">
            {/* Cable style header */}
            <div className="crt-world-header-bar theme-artifact">
              <span className="crt-world-header-title">MEMORY TRANSMISSION</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="crt-world-header-channel" style={{ fontSize: '13px', marginRight: '4px' }}>
                  {selectedArtifact?.channelLabel ? selectedArtifact.channelLabel.split(' - ')[0] : 'CH 00'}
                </span>
                <span style={{
                  fontSize: '9px',
                  border: '1px solid #f5c518',
                  padding: '0px 4px',
                  borderRadius: '2px',
                  color: '#f5c518',
                  fontFamily: 'monospace',
                  fontWeight: 'bold'
                }}>
                  {selectedArtifact?.worldId && worlds[selectedArtifact.worldId] ? worlds[selectedArtifact.worldId].rating : 'NR'}
                </span>
              </div>
            </div>

            {/* Subheader Title block */}
            <div className="crt-world-title-row" style={{ padding: '4px 12px 2px 12px', display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
              <span className="crt-world-ch-badge theme-focus" style={{ fontSize: '11px', padding: '0px 6px', borderRadius: '2px' }}>
                FOCUS
              </span>
              <span className="crt-world-main-title crt-flicker-text" style={{ fontSize: '13px', color: '#eaeaea', fontWeight: 'bold' }}>
                SELECTED ARTIFACT
              </span>
            </div>

            {/* Main two-column VCR catalog view */}
            <div className="crt-artifact-main-body">
              {/* Left Column: Visual dynamic generator preview box */}
              <div className="crt-artifact-preview-col" style={{ borderColor: `${selectedArtifact?.color || '#a78bfa'}44` }}>
                <div className="preview-grid-bg" />
                <div className="preview-glow-sun" style={{ background: `radial-gradient(circle, ${selectedArtifact?.color || '#ff00ff'}33 20%, transparent 80%)` }} />
                
                {/* Dynamically render a custom visual shape depending on selected type */}
                <div className="preview-vector-glyph" style={{ color: selectedArtifact?.color || '#a78bfa' }}>
                  {(() => {
                    switch (selectedArtifact?.type) {
                      case 'vhs-cassette': return '📼';
                      case 'paper-sheet': return '📄';
                      case 'image-card': return '🖼️';
                      case 'photo-plane': return '📷';
                      case 'abstract-blob': return '🌀';
                      case 'geometric-artifact': return '💎';
                      case 'lowpoly-model': return '🧸';
                      case 'crt-fragment': return '📺';
                      case 'floating-frame': return '⭕';
                      case 'collage-stack': return '📚';
                      case 'ribbon-spool': return '🎦';
                      case 'artwork': return '🎨';
                      default: return '✦';
                    }
                  })()}
                </div>
              </div>

              {/* Right Column: Detailed Catalog Info */}
              <div className="crt-artifact-details-col">
                <div className="artifact-title-row">
                  <span className="artifact-title-text" style={{ color: selectedArtifact?.color || '#ffffff' }}>
                    {selectedArtifact?.title || 'UNTITLED'}
                  </span>
                  <span className="artifact-badge-type" style={{ color: selectedArtifact?.color || '#a78bfa', borderColor: `${selectedArtifact?.color || '#a78bfa'}aa` }}>
                    {(() => {
                      switch (selectedArtifact?.type) {
                        case 'vhs-cassette': return 'VHS';
                        case 'paper-sheet': return 'DOC';
                        case 'image-card': return 'IMG';
                        case 'photo-plane': return 'PHO';
                        case 'abstract-blob': return 'BLB';
                        case 'geometric-artifact': return 'OBJ';
                        case 'lowpoly-model': return 'TOY';
                        case 'crt-fragment': return 'CRT';
                        case 'floating-frame': return 'FRM';
                        case 'collage-stack': return 'STK';
                        case 'ribbon-spool': return 'SPL';
                        default: return 'ART';
                      }
                    })()}
                  </span>
                </div>

                <div className="artifact-prop-row">
                  <span className="artifact-prop-label">TYPE:</span>
                  <span>{selectedArtifact?.medium?.toUpperCase() || 'UNCLASSIFIED MEMORY OBJECT'}</span>
                </div>

                <div className="artifact-prop-row">
                  <span className="artifact-prop-label">YEAR:</span>
                  <span>{selectedArtifact?.year ? `${selectedArtifact.year} (RECOVERED SIGNAL)` : '199X (MEMORY UNCERTAIN)'}</span>
                </div>

                <div className="artifact-description-block">
                  <div className="artifact-desc-header">DESCRIPTION:</div>
                  <p className="artifact-desc-para">
                    {selectedArtifact?.shortDescription || 'Recovered from a degraded signal line. No other records exist inside this coordinate.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Metadata catalog table matching VCR Guide mockup */}
            <div className="crt-artifact-metadata-table">
              <div className="crt-metadata-cell">
                <span className="crt-metadata-label">SIGNAL STATUS:</span>
                <span className="crt-metadata-val signal-status-indicator" style={{ color: '#10b981' }}>
                  {selectedArtifact?.signalStatus ? selectedArtifact.signalStatus.split(' ')[0] : 'STABILIZING'}
                  <div className="mini-signal-bars">
                    <span className="mini-signal-bar active" />
                    <span className="mini-signal-bar active" />
                    <span className="mini-signal-bar active" />
                    <span className="mini-signal-bar active" style={{ height: '4px' }} />
                    <span className="mini-signal-bar active" style={{ height: '6px' }} />
                    <span className="mini-signal-bar" style={{ height: '7px' }} />
                    <span className="mini-signal-bar" style={{ height: '8px' }} />
                  </div>
                </span>
              </div>
              <div className="crt-metadata-cell">
                <span className="crt-metadata-label">CHANNEL:</span>
                <span className="crt-metadata-val">
                  {selectedArtifact?.channelLabel || (selectedArtifact?.worldId ? worlds[selectedArtifact.worldId]?.title : 'CH 00')}
                </span>
              </div>
              <div className="crt-metadata-cell">
                <span className="crt-metadata-label">CONDITION:</span>
                <span className="crt-metadata-val" style={{ color: '#d946ef', display: 'flex', alignItems: 'center' }}>
                  {selectedArtifact?.condition?.toUpperCase() || 'DEGRADED'}
                  <span className="wave-condition-icon">〰️</span>
                </span>
              </div>

              <div className="crt-metadata-cell">
                <span className="crt-metadata-label">ARCHIVE ID:</span>
                <span className="crt-metadata-val" style={{ color: '#93c5fd' }}>
                  {selectedArtifact?.archiveId || 'NN-CH00-UNKNOWN'}
                </span>
              </div>
              <div className="crt-metadata-cell">
                <span className="crt-metadata-label">MEMORY TYPE:</span>
                <span className="crt-metadata-val" style={{ color: '#93c5fd' }}>
                  {selectedArtifact?.memoryType?.toUpperCase() || 'NOSTALGIC / LIMINAL'}
                </span>
              </div>
              <div className="crt-metadata-cell">
                <span className="crt-metadata-label">SOURCE:</span>
                <span className="crt-metadata-val" style={{ color: '#93c5fd' }}>
                  PERSONAL ARCHIVE
                </span>
              </div>
            </div>

            {/* Return Button */}
            <button
              className="crt-cable-return-btn return-to-sky-btn"
              onMouseEnter={() => triggerSound('tick')}
              onClick={() => {
                setSelectedArtifactId(null);
                triggerSound('thunk');
              }}
            >
              ◀ RETURN TO EXPLORATION
            </button>

            {/* Ticker footer */}
            <div className="crt-world-footer-ticker" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="ticker-label" style={{ color: '#fbbf24' }}>USE ESCAPE KEY:</div>
              <div className="ticker-track">
                <div className="ticker-text-scroll font-mono" style={{ color: '#f5c518' }}>
                  OR ESC TO RETURN TO EXPLORATION · BROADCAST BANDWIDTH ACTIVE · ANALOG FREQUENCY INTENSITY STABILIZED
                </div>
              </div>
            </div>
          </div>
        ) : isHome ? (
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
              <div className="ticker-track">
                <div className="ticker-text-scroll">
                  CONNECTED TO SURREAL ARCHIVE · PRESS L/R ARROWS TO PAN CAMERA VIEW · USE SCREEN BUTTONS TO CONTROL VCR 
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
