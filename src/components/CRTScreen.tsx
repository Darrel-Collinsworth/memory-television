import { useState } from 'react';
import { useWorldStore, type WorldType } from '../store/useWorldStore';
import { worlds } from '../data/worlds';

export const CRTScreen = () => {
  const currentWorld = useWorldStore((state) => state.currentWorld);
  const transitioning = useWorldStore((state) => state.transitioning);
  const transitionTo = useWorldStore((state) => state.transitionTo);
  const [hoveredChannel, setHoveredChannel] = useState<string | null>(null);

  // Trigger state transitions on select
  const handleSelectChannel = (channelId: WorldType) => {
    if (transitioning) return;
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
          /* --- HOME MODE: TERMINAL MENU --- */
          <>
            <div className="crt-screen-header">
              <span>SYS.CRT.MONITOR v1.89</span>
              <span>BATTERY: 98%</span>
            </div>

            <div className="crt-channels-list">
              {Object.values(worlds).map((world) => (
                <div
                  key={world.id}
                  className={`crt-channel-item ${hoveredChannel === world.id ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredChannel(world.id)}
                  onMouseLeave={() => setHoveredChannel(null)}
                  onClick={() => handleSelectChannel(world.id)}
                >
                  <span className="crt-channel-num">{world.channel}</span>
                  <span className="crt-channel-name">{world.title}</span>
                </div>
              ))}
            </div>

            <div className="crt-screen-footer">
              <span>MEMORY_TV:/$ SELECT CHANNEL<span className="crt-blinking-cursor" /></span>
              <span>LOC: SURREAL_ARCHIVE</span>
            </div>
          </>
        ) : (
          /* --- WORLD MODE: DIAGNOSTIC TELEMETRY --- */
          <div className="crt-world-screen">
            <div className="crt-screen-header" style={{ color: worlds[currentWorld].themeColor, borderBottomColor: worlds[currentWorld].themeColor + '44' }}>
              <span>SIGNAL SOURCE: EMITTED</span>
              <span>{worlds[currentWorld].channel}</span>
            </div>

            <div className="crt-world-telemetry" style={{ color: worlds[currentWorld].themeColor }}>
              <div className="crt-world-status">
                {worlds[currentWorld].title}
              </div>
              <div className="crt-world-signal">
                <span>SIGNAL LOCK: </span>
                <span className="crt-signal-bar active" style={{ backgroundColor: worlds[currentWorld].themeColor }} />
                <span className="crt-signal-bar active" style={{ backgroundColor: worlds[currentWorld].themeColor }} />
                <span className="crt-signal-bar active" style={{ backgroundColor: worlds[currentWorld].themeColor }} />
                <span className="crt-signal-bar active" style={{ backgroundColor: worlds[currentWorld].themeColor }} />
                <span className="crt-signal-bar active" style={{ backgroundColor: worlds[currentWorld].themeColor }} />
                <span className="crt-signal-bar active" style={{ backgroundColor: worlds[currentWorld].themeColor }} />
                <span className="crt-signal-bar active" style={{ backgroundColor: worlds[currentWorld].themeColor }} />
                <span style={{ marginLeft: '4px', fontSize: '0.65rem', color: '#fff' }}>DECODED</span>
              </div>

              <div style={{ marginTop: '1.25rem', fontSize: '0.65rem', color: '#888', textAlign: 'center', fontFamily: 'monospace', textTransform: 'uppercase', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <div>PORTAL_HZ: 894.22Mhz</div>
                <div>VECTOR_LOCK: X: 1.25 Y: 3.44 Z: -2.31</div>
                <div>BANDWIDTH: 4.8 GB/S</div>
              </div>

              <button
                className="crt-return-btn"
                style={{ 
                  borderColor: worlds[currentWorld].themeColor, 
                  color: worlds[currentWorld].themeColor, 
                  boxShadow: `0 0 10px ${worlds[currentWorld].themeColor}33`,
                  background: `${worlds[currentWorld].themeColor}15`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = worlds[currentWorld].themeColor;
                  e.currentTarget.style.color = '#000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${worlds[currentWorld].themeColor}15`;
                  e.currentTarget.style.color = worlds[currentWorld].themeColor;
                }}
                onClick={() => handleSelectChannel('home')}
              >
                RETURN TO TV
              </button>
            </div>

            <div className="crt-screen-footer">
              <span>STATUS: RESOLVED</span>
              <span>COSMOS LOCK: ACTIVE</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
