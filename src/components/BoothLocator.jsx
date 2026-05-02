import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {
  MapPin, Search, Navigation, Info, Phone,
  Globe, Compass, LocateFixed, X, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// ─── Mock polling stations relative to searched location ──────────────────────
const MOCK_STATIONS = [
  {
    id: 1,
    name: 'Central Public School – Room 4',
    addressSuffix: ', Near Community Center',
    offsetLat: 0.003,
    offsetLng: 0.002,
    distance: '0.4 km',
    blo: 'Mr. Rajesh Kumar',
    bloPhone: '9876543210',
    boothNo: 'B-047',
  },
  {
    id: 2,
    name: 'MCD Primary School – East Wing',
    addressSuffix: ', Block B',
    offsetLat: -0.004,
    offsetLng: 0.005,
    distance: '0.7 km',
    blo: 'Ms. Anita Singh',
    bloPhone: '9876543211',
    boothNo: 'B-048',
  },
  {
    id: 3,
    name: 'Govt. Boys Sr. Secondary School',
    addressSuffix: ', Sector 12',
    offsetLat: 0.006,
    offsetLng: -0.003,
    distance: '1.1 km',
    blo: 'Mr. Vikram Sharma',
    bloPhone: '9876543212',
    boothNo: 'B-049',
  },
];

// ─── Geocoder hook helper ─────────────────────────────────────────────────────
function GeocoderComponent({ query, onResult, onError }) {
  const geocodingLib = useMapsLibrary('geocoding');

  useEffect(() => {
    if (!geocodingLib || !query) return;
    const geocoder = new geocodingLib.Geocoder();
    geocoder.geocode(
      { address: query + ', India', region: 'IN' },
      (results, status) => {
        if (status === 'OK' && results[0]) {
          const loc = results[0].geometry.location;
          onResult({
            lat: loc.lat(),
            lng: loc.lng(),
            formattedAddress: results[0].formatted_address,
          });
        } else {
          onError('Location not found. Please try a more specific address.');
        }
      }
    );
  }, [geocodingLib, query]);

  return null;
}

// ─── Markers + InfoWindows rendered inside the Map ────────────────────────────
function StationMarkers({ stations, activeId, onMarkerClick, onClose }) {
  return (
    <>
      {stations.map((station) => (
        <AdvancedMarker
          key={station.id}
          position={{ lat: station.lat, lng: station.lng }}
          title={station.name}
          onClick={() => onMarkerClick(station.id)}
        >
          {/* Custom styled pin */}
          <div style={{
            background: activeId === station.id
              ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
              : 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
            color: '#fff',
            borderRadius: '50% 50% 50% 0',
            transform: 'rotate(-45deg)',
            width: activeId === station.id ? '44px' : '36px',
            height: activeId === station.id ? '44px' : '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            border: '3px solid #fff',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
          }}>
            <MapPin
              size={activeId === station.id ? 18 : 15}
              style={{ transform: 'rotate(45deg)' }}
            />
          </div>
        </AdvancedMarker>
      ))}

      {/* InfoWindow for active marker */}
      {activeId && (() => {
        const s = stations.find(st => st.id === activeId);
        if (!s) return null;
        return (
          <InfoWindow
            position={{ lat: s.lat, lng: s.lng }}
            onCloseClick={onClose}
            pixelOffset={[0, -50]}
          >
            <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '220px', padding: '4px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b', marginBottom: '4px' }}>
                {s.name}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '8px' }}>
                {s.address}
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 700 }}>
                  {s.distance}
                </span>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}
                >
                  Get Directions →
                </a>
              </div>
            </div>
          </InfoWindow>
        );
      })()}
    </>
  );
}

// ─── Map panner – moves map to searched location ──────────────────────────────
function MapPanner({ center }) {
  const map = useMap();
  useEffect(() => {
    if (map && center) {
      map.panTo(center);
      map.setZoom(15);
    }
  }, [map, center]);
  return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────
const BoothLocator = () => {
  const [search, setSearch] = useState('');
  const [geocodeQuery, setGeocodeQuery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // India center
  const [stations, setStations] = useState([]);
  const [activeStationId, setActiveStationId] = useState(null);
  const [error, setError] = useState('');
  const [geolocating, setGeolocating] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef(null);

  const handleSearch = useCallback(() => {
    if (!search.trim()) return;
    setLoading(true);
    setError('');
    setStations([]);
    setActiveStationId(null);
    setHasSearched(true);
    setGeocodeQuery(search.trim());
  }, [search]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleGeocodeResult = useCallback(({ lat, lng, formattedAddress }) => {
    const generatedStations = MOCK_STATIONS.map((s) => ({
      ...s,
      lat: lat + s.offsetLat,
      lng: lng + s.offsetLng,
      address: formattedAddress.split(',').slice(0, 2).join(',') + s.addressSuffix,
    }));
    setMapCenter({ lat, lng });
    setStations(generatedStations);
    setLoading(false);
  }, []);

  const handleGeocodeError = useCallback((msg) => {
    setError(msg);
    setLoading(false);
  }, []);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setGeolocating(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const generatedStations = MOCK_STATIONS.map((s) => ({
          ...s,
          lat: lat + s.offsetLat,
          lng: lng + s.offsetLng,
          address: 'Your Location' + s.addressSuffix,
        }));
        setMapCenter({ lat, lng });
        setStations(generatedStations);
        setSearch('Current Location');
        setGeolocating(false);
        setHasSearched(true);
        setGeocodeQuery(null);
      },
      () => {
        setError('Unable to retrieve your location. Please allow location access.');
        setGeolocating(false);
      }
    );
  };

  const noApiKey = !MAPS_API_KEY || MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY_HERE';

  return (
    <div style={{ padding: '6rem 1rem 4rem', maxWidth: '1300px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="section-title">Polling Station Locator</h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '620px', margin: '0 auto' }}>
          Find your designated polling booth instantly. Enter your locality, area name, or EPIC number to see nearby stations on the map.
        </p>
      </div>

      {/* API Key Warning */}
      {noApiKey && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, #fef3c7, #fffbeb)',
            border: '1px solid #fcd34d',
            borderRadius: '16px',
            padding: '1.2rem 1.8rem',
            marginBottom: '2.5rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start',
          }}
        >
          <AlertCircle size={20} color="#d97706" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <strong style={{ color: '#92400e', fontSize: '0.95rem' }}>Google Maps API Key Required</strong>
            <p style={{ color: '#b45309', fontSize: '0.85rem', margin: '4px 0 0' }}>
              Add your Maps JavaScript API key as <code>VITE_GOOGLE_MAPS_API_KEY</code> in <code>.env</code>.{' '}
              <a
                href="https://developers.google.com/maps/documentation/javascript/get-api-key?utm_source=gmp-code-assist"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#d97706', fontWeight: 600 }}
              >
                Get a key →
              </a>
            </p>
          </div>
        </motion.div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 380px) 1fr',
        gap: '2.5rem',
        alignItems: 'start',
      }}>
        {/* ── Left Panel: Search ── */}
        <div className="card" style={{ padding: '2.5rem', position: 'sticky', top: '120px' }}>
          <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.1rem' }}>
            <Compass size={20} color="var(--primary-accent)" /> Search Your Booth
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {/* Search input */}
            <div style={{ position: 'relative' }}>
              <input
                ref={inputRef}
                type="text"
                id="booth-search-input"
                placeholder="Enter locality, area or EPIC no."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  width: '100%',
                  padding: '1rem 3rem 1rem 1.2rem',
                  borderRadius: '14px',
                  border: '1.5px solid var(--border)',
                  background: '#f8fafc',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border 0.2s, box-shadow 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => {
                  e.target.style.border = '1.5px solid var(--primary-accent)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
                }}
                onBlur={e => {
                  e.target.style.border = '1.5px solid var(--border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <Search
                size={16}
                style={{ position: 'absolute', right: '1.2rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }}
              />
            </div>

            {/* Find button */}
            <button
              id="booth-find-btn"
              className="btn btn-primary"
              onClick={handleSearch}
              disabled={loading || !search.trim()}
              style={{ padding: '1rem', justifyContent: 'center' }}
            >
              {loading ? (
                <>
                  <span style={{
                    display: 'inline-block',
                    width: '16px', height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                  Locating Booths…
                </>
              ) : (
                <><MapPin size={16} /> Find Polling Stations</>
              )}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              or
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>

            {/* Use My Location button */}
            <button
              id="booth-location-btn"
              className="btn"
              onClick={handleUseLocation}
              disabled={geolocating}
              style={{
                padding: '0.9rem',
                justifyContent: 'center',
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1.5px solid rgba(99, 102, 241, 0.2)',
                color: '#6366f1',
                borderRadius: '14px',
                fontWeight: 600,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <LocateFixed size={16} />
              {geolocating ? 'Locating…' : 'Use My Location'}
            </button>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  marginTop: '1.5rem',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '12px',
                  padding: '1rem 1.2rem',
                  display: 'flex',
                  gap: '0.7rem',
                  alignItems: 'flex-start',
                }}
              >
                <AlertCircle size={16} color="#ef4444" style={{ marginTop: '2px', flexShrink: 0 }} />
                <p style={{ fontSize: '0.83rem', color: '#b91c1c', margin: 0 }}>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info tip */}
          <div style={{
            marginTop: '2rem',
            padding: '1.2rem',
            background: 'rgba(59,130,246,0.05)',
            borderRadius: '14px',
            border: '1px solid rgba(59,130,246,0.1)',
          }}>
            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
              <Info size={16} color="var(--primary-accent)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                Your polling booth is assigned based on the address in the official electoral roll. Click any marker on the map to view booth details.
              </p>
            </div>
          </div>

          {/* Station list (results) */}
          <AnimatePresence>
            {stations.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
              >
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                  {stations.length} Stations Found
                </p>
                {stations.map((s) => (
                  <motion.button
                    key={s.id}
                    whileHover={{ x: 4 }}
                    onClick={() => setActiveStationId(activeStationId === s.id ? null : s.id)}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'flex-start',
                      background: activeStationId === s.id
                        ? 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))'
                        : '#f8fafc',
                      border: activeStationId === s.id
                        ? '1.5px solid rgba(99,102,241,0.3)'
                        : '1.5px solid var(--border)',
                      borderRadius: '14px',
                      padding: '1rem 1.2rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px',
                      background: activeStationId === s.id
                        ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
                        : 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <MapPin size={15} color="#fff" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', marginBottom: '2px' }}>
                        {s.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Booth {s.boothNo} · {s.distance}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right Panel: Map ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Map container */}
          <div style={{
            borderRadius: '28px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
            border: '1px solid var(--border)',
            height: '520px',
            position: 'relative',
          }}>
            <APIProvider
              apiKey={MAPS_API_KEY}
              solutionChannel="gmp_mcp_codeassist_v0.1_github"
            >
              <Map
                mapId="DEMO_MAP_ID"
                defaultCenter={mapCenter}
                defaultZoom={hasSearched ? 14 : 5}
                gestureHandling="greedy"
                disableDefaultUI={false}
                style={{ width: '100%', height: '100%' }}
              >
                {/* Geocode trigger */}
                {geocodeQuery && (
                  <GeocoderComponent
                    query={geocodeQuery}
                    onResult={handleGeocodeResult}
                    onError={handleGeocodeError}
                  />
                )}

                {/* Pan map to result */}
                {stations.length > 0 && <MapPanner center={mapCenter} />}

                {/* Station markers */}
                {stations.length > 0 && (
                  <StationMarkers
                    stations={stations}
                    activeId={activeStationId}
                    onMarkerClick={(id) => setActiveStationId(prev => prev === id ? null : id)}
                    onClose={() => setActiveStationId(null)}
                  />
                )}
              </Map>
            </APIProvider>

            {/* Empty state overlay */}
            {!hasSearched && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(248,250,252,0.75)',
                backdropFilter: 'blur(6px)',
                pointerEvents: 'none',
              }}>
                <Globe size={56} style={{ opacity: 0.15, marginBottom: '1rem' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>
                  Search to see polling stations on the map
                </p>
              </div>
            )}
          </div>

          {/* Station detail cards (shown after search) */}
          <AnimatePresence mode="wait">
            {stations.length > 0 && (
              <motion.div
                key="station-cards"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}
              >
                {stations.map((s, i) => (
                  <motion.div
                    key={s.id}
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -3 }}
                    style={{
                      padding: '1.8rem 2rem',
                      borderLeft: `5px solid ${activeStationId === s.id ? '#6366f1' : 'var(--primary-accent)'}`,
                      cursor: 'pointer',
                      outline: activeStationId === s.id ? '2px solid rgba(99,102,241,0.2)' : 'none',
                      transition: 'all 0.2s',
                    }}
                    onClick={() => setActiveStationId(prev => prev === s.id ? null : s.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{s.name}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.83rem', margin: '4px 0 0' }}>
                          Booth No: <strong>{s.boothNo}</strong>
                        </p>
                      </div>
                      <span style={{
                        background: '#dcfce7', color: '#166534',
                        padding: '0.35rem 0.9rem', borderRadius: '100px',
                        fontSize: '0.78rem', fontWeight: 800, flexShrink: 0,
                      }}>
                        {s.distance}
                      </span>
                    </div>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 1.2rem' }}>
                      <MapPin size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                      {s.address}
                    </p>

                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      paddingTop: '1.2rem', borderTop: '1px solid var(--border)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <div style={{
                          background: '#f1f5f9', padding: '0.5rem',
                          borderRadius: '10px', display: 'flex', alignItems: 'center',
                        }}>
                          <Phone size={16} color="#64748b" />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>BLO: {s.blo}</div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{s.bloPhone}</div>
                        </div>
                      </div>

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{ textDecoration: 'none' }}
                      >
                        <button
                          className="btn btn-primary"
                          style={{ padding: '0.7rem 1.3rem', fontSize: '0.83rem', gap: '0.5rem' }}
                        >
                          <Navigation size={14} /> Get Directions
                        </button>
                      </a>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .booth-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Attribution */}
      <p style={{
        textAlign: 'center', marginTop: '3rem',
        fontSize: '0.72rem', color: 'var(--text-muted)', opacity: 0.6,
      }}>
        Map data ©{new Date().getFullYear()} Google · Polling data is illustrative for demo purposes
      </p>
    </div>
  );
};

export default BoothLocator;
