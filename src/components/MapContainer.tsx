import React, { useRef, useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Navigation, Compass } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapContainerProps {
  selectedBoatId?: string | null;
  onSelectBoat?: (boatId: string) => void;
  pickupCoords?: { x: number; y: number };
  setPickupCoords?: (coords: { x: number; y: number }) => void;
}

// Bounding box for Delhi NCR mapping (0-100 grid <-> Real LatLng)
const LNG_MIN = 77.05;
const LNG_MAX = 77.40;
const LAT_MIN = 28.45;
const LAT_MAX = 28.68;

function gridToLatLng(x: number, y: number): L.LatLngLiteral {
  const lng = LNG_MIN + (x / 100) * (LNG_MAX - LNG_MIN);
  const lat = LAT_MAX - (y / 100) * (LAT_MAX - LAT_MIN);
  return { lat, lng };
}

function latLngToGrid(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * 100;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * 100;
  return {
    x: Math.max(2, Math.min(98, Math.round(x))),
    y: Math.max(2, Math.min(98, Math.round(y)))
  };
}

// Custom HTML for the user rescue beacon
function getUserIconHtml() {
  return `
    <div class="relative flex items-center justify-center" style="width: 48px; height: 48px; transform: translate(-12px, -12px);">
      <div class="absolute w-10 h-10 bg-blue-500 bg-opacity-25 rounded-full animate-ping"></div>
      <div class="relative w-5 h-5 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
        <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
      </div>
    </div>
  `;
}

// Custom HTML for Captain Boat Markers
function getBoatIconHtml(
  b: any,
  isSelected: boolean,
  isHovered: boolean,
  isTracking: boolean,
  isDark: boolean,
  activeTrackingBooking: any
) {
  const labelHtml = (isSelected || isHovered || isTracking) ? `
    <div class="absolute bottom-[44px] left-1/2 -translate-x-1/2 z-[1000] flex flex-col items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 shadow-xl whitespace-nowrap min-w-[110px] text-center pointer-events-none transition-transform duration-200">
      <span class="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-wider leading-none mb-0.5 block">
        ${isTracking ? 'Rowing to You!' : b.captainName}
      </span>
      <span class="text-[9px] font-bold ${isTracking ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'} leading-none block">
        ${isTracking ? `ETA: ${activeTrackingBooking?.etaMinutes || 1} min` : `${b.pricePerHour} INR/hr • ${b.distanceKm}km`}
      </span>
    </div>
  ` : '';

  const pulseClass = (isSelected || isHovered || isTracking) ? 'animate-pulse' : '';
  const haloHtml = (isSelected || isHovered || isTracking) ? `
    <div class="absolute rounded-full w-12 h-12 bg-opacity-20 ${isTracking ? 'bg-emerald-500' : 'bg-blue-500'} ${pulseClass}"></div>
  ` : '';

  return `
    <div class="relative flex flex-col items-center justify-center" style="width: 48px; height: 48px; transform: translate(-12px, -12px);">
      ${haloHtml}
      ${labelHtml}
      <!-- The Rowboat SVG -->
      <svg width="24" height="24" viewBox="-6 -6 12 12" class="relative drop-shadow-md overflow-visible">
        <path 
          d="M -3 1.8 C -1.5 1 1.5 1 3 1.8" 
          fill="none" 
          stroke="${isTracking ? '#10b981' : isSelected ? '#3b82f6' : '#94a3b8'}" 
          stroke-width="0.35" 
          opacity="0.7"
        />
        <path
          d="M 0,-3.2 C 1.6,-2.8 1.9,1.5 1.1,3 L -1.1,3 C -1.9,1.5 -1.6,-2.8 0,-3.2 Z"
          fill="${isTracking ? '#059669' : isSelected ? '#1d4ed8' : isDark ? '#1e293b' : '#ffffff'}"
          stroke="${isTracking ? '#10b981' : isSelected ? '#3b82f6' : isDark ? '#475569' : '#1e293b'}"
          stroke-width="0.45"
        />
        <line 
          x1="-1.0" y1="0.5" x2="-3.4" y2="-0.8" 
          stroke="${isTracking ? '#34d399' : isSelected ? '#93c5fd' : '#94a3b8'}" 
          stroke-width="0.3" 
          stroke-linecap="round" 
        />
        <line 
          x1="1.0" y1="0.5" x2="3.4" y2="-0.8" 
          stroke="${isTracking ? '#34d399' : isSelected ? '#93c5fd' : '#94a3b8'}" 
          stroke-width="0.3" 
          stroke-linecap="round" 
        />
        <circle cx="0" cy="1" r="0.65" fill="${isTracking || isSelected ? '#ffffff' : '#64748b'}" />
      </svg>
    </div>
  `;
}

// Custom HTML for flooded landmark label badges
function getLandmarkLabelHtml(name: string) {
  return `
    <div class="flex flex-col items-center select-none pointer-events-none whitespace-nowrap" style="transform: translate(-50%, -50%);">
      <div class="w-3 h-3 border border-dashed rounded-full flex items-center justify-center border-blue-500/50 mb-1 bg-blue-500/10">
        <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
      </div>
      <span class="font-sans text-[10px] font-black text-slate-700/95 dark:text-slate-300/95 uppercase tracking-widest bg-white/90 dark:bg-slate-950/90 px-2 py-0.5 rounded-md border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm shadow-sm">
        ${name}
      </span>
    </div>
  `;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  selectedBoatId,
  onSelectBoat,
  pickupCoords = { x: 50, y: 50 },
  setPickupCoords
}) => {
  const { boats, activeTrackingBooking, trackingBoatCoords, theme } = useApp();
  const [hoveredBoat, setHoveredBoat] = useState<string | null>(null);

  const isDark = theme === 'dark';
  
  // Refs for managing Leaflet lifecycle
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const boatMarkersRef = useRef<{ [key: string]: L.Marker }>({});
  const landmarkCirclesRef = useRef<L.Circle[]>([]);
  const landmarkLabelsRef = useRef<L.Marker[]>([]);
  const selectedRouteLineRef = useRef<L.Polyline | null>(null);
  const activeDispatchLineRef = useRef<L.Polyline | null>(null);

  // Landmarks list with center LatLng
  const landmarks = [
    { name: 'Connaught Place Basin', center: gridToLatLng(45, 45), radius: 1000 },
    { name: 'Noida Logway', center: gridToLatLng(75, 35), radius: 800 },
    { name: 'Cyber City Puddle', center: gridToLatLng(25, 65), radius: 1200 }
  ];

  // Tile layer source url based on theme
  const getTileUrl = (dark: boolean) => {
    return dark 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
  };

  // Setup Map Instance once on mount
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create the map bound to Delhi NCR coordinates
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: true,
      touchZoom: true,
      scrollWheelZoom: true,
      doubleClickZoom: false
    }).setView(gridToLatLng(50, 50), 12);

    mapRef.current = map;

    // Add Tile Layer
    const tileLayer = L.tileLayer(getTileUrl(isDark), {
      maxZoom: 18,
      minZoom: 10
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Click handler to relocate beacon
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (activeTrackingBooking) return;
      const { lat, lng } = e.latlng;
      const grid = latLngToGrid(lat, lng);
      if (setPickupCoords) {
        setPickupCoords(grid);
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Tile Layer when theme changes
  useEffect(() => {
    if (tileLayerRef.current) {
      tileLayerRef.current.setUrl(getTileUrl(isDark));
    }
  }, [isDark]);

  // Render / Update Flooded Landmarks (Circles + Text Labels)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old ones
    landmarkCirclesRef.current.forEach(c => c.remove());
    landmarkLabelsRef.current.forEach(m => m.remove());
    landmarkCirclesRef.current = [];
    landmarkLabelsRef.current = [];

    // Create new ones
    landmarks.forEach(l => {
      const circle = L.circle(l.center, {
        radius: l.radius,
        fillColor: isDark ? '#0284c7' : '#3b82f6',
        fillOpacity: 0.16,
        color: isDark ? '#38bdf8' : '#2563eb',
        opacity: 0.45,
        weight: 1.5
      }).addTo(map);
      landmarkCirclesRef.current.push(circle);

      const labelMarker = L.marker(l.center, {
        icon: L.divIcon({
          html: getLandmarkLabelHtml(l.name),
          className: 'custom-landmark-label',
          iconSize: [200, 40],
          iconAnchor: [100, 20]
        }),
        zIndexOffset: 10
      }).addTo(map);
      landmarkLabelsRef.current.push(labelMarker);
    });
  }, [isDark]);

  // Update User Rescue Marker on change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const userLatLng = gridToLatLng(pickupCoords.x, pickupCoords.y);

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng(userLatLng);
    } else {
      userMarkerRef.current = L.marker(userLatLng, {
        icon: L.divIcon({
          html: getUserIconHtml(),
          className: 'custom-user-marker',
          iconSize: [48, 48],
          iconAnchor: [24, 24]
        }),
        zIndexOffset: 500
      }).addTo(map);
    }
  }, [pickupCoords]);

  // Update Captain Boat Markers dynamically with hover/click/active state
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const currentActiveBoatIds = new Set(boats.filter(b => b.status === 'active').map(b => b.id));

    // Clear deleted boat markers
    Object.keys(boatMarkersRef.current).forEach(id => {
      if (!currentActiveBoatIds.has(id)) {
        boatMarkersRef.current[id].remove();
        delete boatMarkersRef.current[id];
      }
    });

    // Add or update active boats
    boats
      .filter(b => b.status === 'active')
      .forEach(b => {
        const isSelected = b.id === selectedBoatId;
        const isTracking = activeTrackingBooking?.boatId === b.id;
        
        // Retrieve coords (moving tracking coords or static coords)
        const coords = isTracking && trackingBoatCoords ? trackingBoatCoords : b.coordinates;
        const latLng = gridToLatLng(coords.x, coords.y);
        const isHovered = hoveredBoat === b.id;

        const iconHtml = getBoatIconHtml(b, isSelected, isHovered, isTracking, isDark, activeTrackingBooking);

        let marker = boatMarkersRef.current[b.id];

        if (marker) {
          marker.setLatLng(latLng);
          marker.setIcon(L.divIcon({
            html: iconHtml,
            className: `custom-boat-marker-${b.id}`,
            iconSize: [48, 48],
            iconAnchor: [24, 24]
          }));
        } else {
          marker = L.marker(latLng, {
            icon: L.divIcon({
              html: iconHtml,
              className: `custom-boat-marker-${b.id}`,
              iconSize: [48, 48],
              iconAnchor: [24, 24]
            }),
            zIndexOffset: 100
          }).addTo(map);

          // Marker Events
          marker.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            if (onSelectBoat && !activeTrackingBooking) {
              onSelectBoat(b.id);
            }
          });

          marker.on('mouseover', () => {
            setHoveredBoat(b.id);
          });

          marker.on('mouseout', () => {
            setHoveredBoat(null);
          });

          boatMarkersRef.current[b.id] = marker;
        }
      });
  }, [boats, selectedBoatId, hoveredBoat, activeTrackingBooking, trackingBoatCoords, isDark]);

  // Update Route Polylines dynamically
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const userLatLng = gridToLatLng(pickupCoords.x, pickupCoords.y);

    // 1. Static Selection Route Path
    const selectedBoat = selectedBoatId ? boats.find(b => b.id === selectedBoatId) : null;
    if (selectedBoat && !activeTrackingBooking) {
      const selectedLatLng = gridToLatLng(selectedBoat.coordinates.x, selectedBoat.coordinates.y);
      const pathPoints = [selectedLatLng, userLatLng];

      if (selectedRouteLineRef.current) {
        selectedRouteLineRef.current.setLatLngs(pathPoints);
        selectedRouteLineRef.current.setStyle({
          color: isDark ? '#38bdf8' : '#2563eb'
        });
      } else {
        selectedRouteLineRef.current = L.polyline(pathPoints, {
          color: isDark ? '#38bdf8' : '#2563eb',
          weight: 3.5,
          dashArray: '8, 8',
          opacity: 0.85
        }).addTo(map);
      }
    } else {
      if (selectedRouteLineRef.current) {
        selectedRouteLineRef.current.remove();
        selectedRouteLineRef.current = null;
      }
    }

    // 2. Active Dispatch Route Path
    const isTracking = activeTrackingBooking?.boatId && trackingBoatCoords;
    if (isTracking && trackingBoatCoords) {
      const trackingLatLng = gridToLatLng(trackingBoatCoords.x, trackingBoatCoords.y);
      const pathPoints = [trackingLatLng, userLatLng];

      if (activeDispatchLineRef.current) {
        activeDispatchLineRef.current.setLatLngs(pathPoints);
      } else {
        activeDispatchLineRef.current = L.polyline(pathPoints, {
          color: '#10b981',
          weight: 4,
          dashArray: '8, 8',
          opacity: 0.9
        }).addTo(map);
      }
    } else {
      if (activeDispatchLineRef.current) {
        activeDispatchLineRef.current.remove();
        activeDispatchLineRef.current = null;
      }
    }
  }, [pickupCoords, selectedBoatId, activeTrackingBooking, trackingBoatCoords, boats, isDark]);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-blue-100 bg-slate-50 shadow-inner dark:border-slate-800 dark:bg-slate-950 h-[400px] sm:h-[460px] flex items-center justify-center transition-colors">
      
      {/* Real Interactive Leaflet Map Container */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0 h-full w-full" />

      {/* FLOATERS: HEADER OVERLAY */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 rounded-2xl bg-white/95 p-3 shadow-md backdrop-blur-md dark:bg-slate-900/95 max-w-[220px] sm:max-w-[280px]">
        <div className="flex items-center gap-2">
          <Compass className="h-4.5 w-4.5 animate-spin text-blue-600 dark:text-cyan-400" style={{ animationDuration: '6s' }} />
          <span className="font-sans text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
            WATER ROUTE TRACKER V1.2
          </span>
        </div>
        <p className="text-[10px] text-slate-500 leading-relaxed dark:text-slate-400 font-medium">
          {activeTrackingBooking 
            ? `🚨 Dispatching Captain ${boats.find(b => b.id === activeTrackingBooking.boatId)?.captainName} to coordinates.`
            : "Tap anywhere on the satellite water grid to relocate your rescue coordinate!"
          }
        </p>
      </div>

      {/* FLOATERS: STATUS CORNER */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-2xl bg-white/95 px-3 py-2 shadow-md backdrop-blur-md dark:bg-slate-900/95 text-[10px] font-bold text-slate-700 dark:text-slate-300">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
        </span>
        OSM: Online
      </div>

      {/* FLOATERS: BOTTOM INFO BANNER */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between rounded-2xl bg-white/95 px-3 py-2.5 shadow-md backdrop-blur-md dark:bg-slate-900/95 text-xs text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-red-500 animate-pulse" />
          <span className="font-sans font-bold text-[11px] sm:text-xs">
            Rescue Point: <span className="font-mono text-[11px] text-blue-600 dark:text-cyan-400">X:{pickupCoords.x}, Y:{pickupCoords.y}</span>
          </span>
        </div>
        <div className="flex items-center gap-1 font-bold text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          <Navigation className="h-3 w-3 rotate-45 text-blue-500" />
          Click map to relocate rescue beacon
        </div>
      </div>

      {/* Custom Styles overrides for Leaflet smooth rendering */}
      <style>{`
        .leaflet-container {
          background-color: ${isDark ? '#0b0f19' : '#f8fafc'} !important;
        }
        .leaflet-marker-icon {
          background: none !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
};
