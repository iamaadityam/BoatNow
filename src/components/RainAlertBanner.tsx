import React, { useState, useEffect } from 'react';
import { CloudRain, AlertTriangle, Thermometer, Droplets, Compass, RefreshCw, X, Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';

export const RainAlertBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [activeTab, setActiveTab] = useState<'advisory' | 'basins' | 'imd'>('advisory');

  // Real-time weather data fetched via search for Delhi Monsoon
  const [weatherData, setWeatherData] = useState({
    temp: '32°C',
    feelsLike: '41°C',
    humidity: '84%',
    precipitation: '48 mm/hr',
    wind: '18 km/h (ENE)',
    alertLevel: 'Orange Alert',
    imdWarning: 'Heavy downpours causing active waterlogging. Auto-rickshaw floatation warning active.',
  });

  const refreshWeather = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      
      // Slightly fluctuate the satirical parameters to make it feel alive!
      const randomPrecip = Math.floor(Math.random() * 20) + 35;
      const randomTemp = Math.floor(Math.random() * 3) + 31;
      setWeatherData(prev => ({
        ...prev,
        temp: `${randomTemp}°C`,
        feelsLike: `${randomTemp + 9}°C`,
        precipitation: `${randomPrecip} mm/hr`,
      }));
    }, 800);
  };

  if (!isVisible) return null;

  return (
    <div className="relative w-full bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 text-white shadow-md select-none transition-all duration-300 z-50">
      
      {/* Mini Top Banner Line */}
      <div className="mx-auto max-w-7xl px-3 py-1.5 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
        
        {/* Left segment - Critical alert status with badge */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/35 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider shrink-0 text-amber-200">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500"></span>
            </span>
            IMD ALERT
          </span>
          
          {/* Main news text - truncated or sliding on mobile */}
          <div className="text-xs font-bold font-sans truncate text-orange-50 leading-none">
            <span className="hidden sm:inline">⛈️ Delhi Deluge: </span>
            <span>{weatherData.precipitation} • {weatherData.imdWarning}</span>
          </div>
        </div>

        {/* Right segment - Control triggers */}
        <div className="flex items-center gap-1.5 shrink-0">
          
          {/* Expand Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-0.5 rounded-full bg-white/20 hover:bg-white/30 px-2 py-1 text-[10px] font-black transition-all"
            id="btn-toggle-weather-details"
          >
            <span>Feed</span>
            <span className="font-mono text-[8px]">{isExpanded ? '▲' : '▼'}</span>
          </button>

          {/* Refresh Action */}
          <button
            onClick={refreshWeather}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-black/20 hover:bg-black/35 transition-colors"
            title="Refresh weather telemetry"
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          
          {/* Close Action */}
          <button
            onClick={() => setIsVisible(false)}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-black/20 hover:bg-black/35 transition-colors"
            aria-label="Dismiss Alert"
          >
            <X className="h-3 w-3" />
          </button>

        </div>
      </div>

      {/* Expanded details inside an absolute floating popover card (Never pushes down content) */}
      {isExpanded && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 z-50 w-[94vw] max-w-lg rounded-3xl bg-slate-900/95 backdrop-blur-md border border-slate-800 p-4 shadow-2xl text-white animate-[slideDown_0.2s_ease-out_1]">
          <div className="space-y-4">
            
            {/* Slogan details / Live condition */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="space-y-0.5">
                <p className="text-[9px] font-extrabold text-amber-400 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="h-2.5 w-2.5 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} /> Live Weather Feed
                </p>
                <h4 className="font-sans text-xs font-black tracking-tight leading-none text-white">
                  Delhi Meteorological Hub
                </h4>
              </div>
              <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[9px] font-black text-orange-400 border border-orange-500/10">
                Satellite Synced
              </span>
            </div>

            {/* Micro Parameters Grid */}
            <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-xs bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800/40">
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400 flex items-center gap-1"><CloudRain className="h-3 w-3 text-cyan-400" /> Precp Level:</span>
                <span className="font-mono font-black text-cyan-200">{weatherData.precipitation}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400 flex items-center gap-1"><Thermometer className="h-3 w-3 text-amber-400" /> Temperature:</span>
                <span className="font-mono font-black text-amber-300">{weatherData.temp}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400 flex items-center gap-1"><Thermometer className="h-3 w-3 text-orange-400" /> Feels Like:</span>
                <span className="font-mono font-black text-orange-300">{weatherData.feelsLike}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400 flex items-center gap-1"><Droplets className="h-3 w-3 text-blue-400" /> Humidity:</span>
                <span className="font-mono font-black text-blue-300">{weatherData.humidity}</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="space-y-3">
              <div className="flex gap-2 border-b border-slate-800 pb-1.5 overflow-x-auto scrollbar-none">
                {[
                  { id: 'advisory', label: '📢 Captain Advisory' },
                  { id: 'basins', label: '🌊 Landmark Basins' },
                  { id: 'imd', label: '🛰️ Satellite Telemetry' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-1 text-[10px] font-black tracking-wider uppercase transition-all whitespace-nowrap ${
                      activeTab === tab.id 
                        ? 'border-b-2 border-yellow-300 text-yellow-200 font-black' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              <div className="min-h-[44px] text-xs flex items-center bg-slate-950/40 p-2.5 rounded-2xl border border-slate-800/40">
                {activeTab === 'advisory' && (
                  <p className="text-[10px] sm:text-[11px] font-semibold text-yellow-50 leading-relaxed">
                    🛶 <span className="text-yellow-200 font-black">COMMUTE NOTICE:</span> Wind speeds are currently {weatherData.wind}. High risk of floating chai cups. Captains are advised to apply mosquito repellent and load emergency samosas immediately.
                  </p>
                )}

                {activeTab === 'basins' && (
                  <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[9px] sm:text-[10px] font-mono">
                    <div className="bg-slate-950/60 rounded-xl px-2 py-1.5 flex justify-between items-center border border-slate-800/30">
                      <span className="text-orange-200">CP Circle:</span>
                      <span className="font-bold text-white">2.6 ft</span>
                    </div>
                    <div className="bg-slate-950/60 rounded-xl px-2 py-1.5 flex justify-between items-center border border-slate-800/30">
                      <span className="text-orange-200">ITO Crossing:</span>
                      <span className="font-bold text-white">3.4 ft</span>
                    </div>
                    <div className="bg-slate-950/60 rounded-xl px-2 py-1.5 flex justify-between items-center border border-slate-800/30">
                      <span className="text-orange-200">Golf Course Rd:</span>
                      <span className="font-bold text-red-400">5.1 ft</span>
                    </div>
                  </div>
                )}

                {activeTab === 'imd' && (
                  <p className="text-[10px] sm:text-[11px] text-slate-300 leading-relaxed">
                    🛰️ <span className="text-cyan-200 font-bold">INSAT-3D Telemetry:</span> Massive convective cloud clusters detected over Connaught Place. Thunderstorm activity with lightning expected to persist for the next 4 hours. Absolute oar control is recommended.
                  </p>
                )}
              </div>
            </div>

            {/* Collapse Button inside popover */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-white px-2 py-1 bg-slate-950 rounded-lg border border-slate-800"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </div>
  );
};
