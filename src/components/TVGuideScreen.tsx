import { useState, useEffect } from 'react';
import { useWorldStore, type WorldType } from '../store/useWorldStore';
import { worlds } from '../data/worlds';

// Interface for guide programs that span slots
interface ProgramGuideItem {
  title: string;
  rating: string;
  slotsSpanned: number;
}

export const TVGuideScreen = () => {
  const transitioning = useWorldStore((state) => state.transitioning);
  const transitionTo = useWorldStore((state) => state.transitionTo);
  const setHoveredWorld = useWorldStore((state) => state.setHoveredWorld);
  const triggerSound = useWorldStore((state) => state.triggerSound);

  // States
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());

  // Running clock and periodic time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format digital clock HH:MM:SS in gold
  const formatClock = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  // Get the three half-hour slots starting from current time
  const getHalfHourSlots = (date: Date) => {
    const slots: string[] = [];
    const m = date.getMinutes();
    const baseDate = new Date(date);
    baseDate.setMinutes(m >= 30 ? 30 : 0, 0, 0);

    for (let i = 0; i < 3; i++) {
      const slotTime = new Date(baseDate.getTime() + i * 30 * 60 * 1000);
      let hours = slotTime.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 becomes 12
      const minutes = slotTime.getMinutes();
      const minutesStr = minutes < 10 ? '0' + minutes : minutes;
      slots.push(`${hours}:${minutesStr} ${ampm}`);
    }
    return slots;
  };

  const timeSlots = getHalfHourSlots(time);

  // Static program grid details for each channel matching late 90s TV Guide feel
  const channelPrograms: Record<string, ProgramGuideItem[]> = {
    'nostalgia-nihilism': [
      { title: 'DIGITAL DUST RESONANCE', rating: 'TV-MA', slotsSpanned: 2 },
      { title: 'CRITICAL BUFFER ERROR', rating: 'TV-MA', slotsSpanned: 1 },
    ],
    'vhs-dreams': [
      { title: 'SYNTH HARBOR LOOPS', rating: 'TV-14', slotsSpanned: 1 },
      { title: 'TAPE WARP SESSIONS', rating: 'TV-PG', slotsSpanned: 2 },
    ],
    'portland-worlds': [
      { title: 'ETHEREAL EMERALD MONOLITH RES...', rating: 'NR', slotsSpanned: 3 },
    ],
  };

  // Channel navigation handler
  const handleSelectChannel = (channelId: WorldType) => {
    if (transitioning) return;
    triggerSound('thunk'); // heavy physical switch clunk!
    transitionTo(channelId);
  };

  // Mobile tap/double-click logic
  const handleRowInteraction = (channelId: string) => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (isMobile) {
      if (activeChannelId === channelId) {
        // Second tap on the same channel navigates
        handleSelectChannel(channelId as WorldType);
      } else {
        // First tap selects/previews
        setActiveChannelId(channelId);
        setHoveredWorld(channelId as WorldType);
        triggerSound('tick'); // warm switch click!
      }
    } else {
      // Desktop single click navigates (hover handled by mouse enter)
      handleSelectChannel(channelId as WorldType);
    }
  };

  // Selected channel details (fallback to welcome message if activeChannelId is null)
  const activeWorld = activeChannelId ? worlds[activeChannelId] : null;

  return (
    <div className="tv-guide-container">
      {/* ==================== TOP HALF: SCREEN DISPLAY ==================== */}
      <div className="tv-guide-top-panel">
        
        {/* TOP LEFT: SELECTED PROGRAM DESCRIPTIONS */}
        <div className="tv-guide-info-box">
          {activeWorld ? (
            <div className="tv-guide-info-active animate-fade-in">
              <div className="tv-guide-info-channel-label">
                {activeWorld.channel} {activeWorld.title}
              </div>
              <div className="tv-guide-info-program-row">
                <span className="tv-guide-info-program-title">
                  {channelPrograms[activeWorld.id][0].title}
                </span>
                <span className="tv-guide-rating-badge">
                  {activeWorld.rating}
                </span>
              </div>
              <div className="tv-guide-info-airtime">
                Airtime: {activeWorld.airTime}
              </div>
              <div className="tv-guide-info-tagline">
                {activeWorld.tagline}
              </div>
            </div>
          ) : (
            <div className="tv-guide-info-welcome animate-fade-in">
              <div className="tv-guide-welcome-title">MEMORY TELEVISION</div>
              <div className="tv-guide-welcome-subtitle">SURREAL PROTO-PORTAL</div>
              <div className="tv-guide-welcome-desc">
                Select a channel below to browse the surreal portal archive. Move your mouse to explore or hover over any program.
              </div>
              <div className="tv-guide-welcome-footer">
                SYS_VER: 2026.05 · READY_
              </div>
            </div>
          )}
        </div>

        {/* TOP RIGHT: LIVE PREVIEW CONTAINER */}
        <div className="tv-guide-preview-box">
          {activeWorld && activeWorld.previewVideo ? (
            /* Loop User-provided 5s preview video if set */
            <video
              key={activeWorld.id}
              src={activeWorld.previewVideo}
              autoPlay
              loop
              muted
              playsInline
              className="tv-guide-video"
            />
          ) : activeChannelId === null && false ? ( // Replace with intro.mp4 logic if intro exists
            <video
              src="/videos/intro.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="tv-guide-video"
            />
          ) : (
            /* Classic Fallback: SMPTE Color Bars / Custom static noise wash */
            <div 
              className="tv-guide-preview-fallback" 
              style={{ backgroundColor: activeWorld ? activeWorld.previewColor : '#0a0a1f' }}
            >
              {/* Animated Static Overlay */}
              <div className="static-noise-bg tv-guide-preview-noise" />
              
              {/* Pure CSS Retro TV Test Pattern if nothing is selected */}
              {activeChannelId === null && (
                <div className="smpte-color-bars">
                  <div className="smpte-top-row">
                    <div className="bar white" />
                    <div className="bar yellow" />
                    <div className="bar cyan" />
                    <div className="bar green" />
                    <div className="bar magenta" />
                    <div className="bar red" />
                    <div className="bar blue" />
                  </div>
                  <div className="smpte-middle-row">
                    <div className="bar blue" />
                    <div className="bar black-1" />
                    <div className="bar magenta" />
                    <div className="bar black-2" />
                    <div className="bar cyan" />
                    <div className="bar white-block" />
                    <div className="bar blue-block" />
                  </div>
                  <div className="smpte-bottom-row">
                    <div className="bar dark-blue" />
                    <div className="bar white-test" />
                    <div className="bar dark-purple" />
                    <div className="bar black-3" />
                    <div className="bar gray-1" />
                    <div className="bar gray-2" />
                    <div className="bar gray-3" />
                  </div>
                  <div className="smpte-text">TEST PATTERN</div>
                </div>
              )}

              {/* Pulsing channel glow */}
              {activeWorld && (
                <div 
                  className="tv-guide-glow-pulse"
                  style={{
                    boxShadow: `inset 0 0 40px ${activeWorld.themeColor}aa`
                  }}
                />
              )}

              {/* Retro scanline sweep */}
              <div className="tv-guide-scanline-sweep" />
            </div>
          )}
        </div>

      </div>

      {/* ==================== MIDDLE ROW: TIME BAR ==================== */}
      <div className="tv-guide-time-bar">
        <div className="tv-guide-clock-cell">
          {formatClock(time)}
        </div>
        <div className="tv-guide-slots-container">
          {timeSlots.map((slot, idx) => (
            <div key={idx} className="tv-guide-time-slot">
              {slot}
            </div>
          ))}
        </div>
      </div>

      {/* ==================== BOTTOM HALF: CHANNEL LIST GRID ==================== */}
      <div 
        className="tv-guide-channels-grid"
        onMouseLeave={() => {
          setActiveChannelId(null);
          setHoveredWorld(null);
        }}
      >
        {Object.values(worlds).map((world) => {
          const isHovered = activeChannelId === world.id;
          const programs = channelPrograms[world.id];

          return (
            <div
              key={world.id}
              className={`tv-guide-channel-row ${isHovered ? 'active' : ''}`}
              onMouseEnter={() => {
                setActiveChannelId(world.id);
                setHoveredWorld(world.id as WorldType);
                triggerSound('tick'); // warm switch click!
              }}
              onClick={() => handleRowInteraction(world.id)}
            >
              {/* Channel Number / Label Column */}
              <div className="tv-guide-channel-label-cell">
                <span className="tv-guide-ch-num">{world.channel.replace('CH ', '')}</span>
                <span className="tv-guide-ch-abbrev">{world.guideAbbrev}</span>
              </div>

              {/* Programs Column */}
              <div className="tv-guide-programs-cells-row">
                {programs.map((program, pIdx) => {
                  const widthPct = (program.slotsSpanned / 3) * 100;
                  return (
                    <div
                      key={pIdx}
                      className="tv-guide-program-cell"
                      style={{ width: `${widthPct}%` }}
                    >
                      <div className="tv-guide-program-title-wrapper">
                        <span className="tv-guide-program-title-text">
                          {program.title}
                        </span>
                        <span className="tv-guide-cell-rating">
                          {program.rating}
                        </span>
                      </div>
                      
                      {/* Chevron showing program extends past guide slot bounds */}
                      {program.slotsSpanned > 1 && pIdx === 0 && (
                        <span className="tv-guide-chevron">►</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
