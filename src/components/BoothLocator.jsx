import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  APIProvider,
  Map,
  Marker,
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

// ─── Distance Calculation Helper ──────────────────────────────────────────────
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return (R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))).toFixed(1);
}

// ─── Location Services Hook Helper ───────────────────────────────────────────
function LocationServicesComponent({ request, onResult, onError }) {
  const geocodingLib = useMapsLibrary('geocoding');
  const placesLib = useMapsLibrary('places');
  const map = useMap();

  useEffect(() => {
    if (!geocodingLib || !placesLib || !map || !request) return;

    const geocoder = new geocodingLib.Geocoder();
    const placesService = new placesLib.PlacesService(map);

    const processLocation = (lat, lng, formattedAddress) => {
      placesService.nearbySearch(
        { location: { lat, lng }, radius: 2000, type: 'school' },
        (results, status) => {
          if (status === placesLib.PlacesServiceStatus.OK && results) {
            const stations = results.slice(0, 5).map((place, i) => {
              const pLat = place.geometry.location.lat();
              const pLng = place.geometry.location.lng();
              return {
                id: place.place_id || i,
                name: place.name,
                address: place.vicinity || formattedAddress,
                lat: pLat,
                lng: pLng,
                distance: getDistance(lat, lng, pLat, pLng) + ' km',
                blo: 'Assigned Officer',
                bloPhone: '1950',
                boothNo: 'B-' + Math.floor(Math.random() * 900 + 100),
              };
            });
            onResult({ lat, lng, formattedAddress, stations });
          } else {
            onError('Could not find nearby polling stations.');
          }
        }
      );
    };

    if (request.type === 'address') {
      geocoder.geocode({ address: request.query + ', India', region: 'IN' }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const loc = results[0].geometry.location;
          processLocation(loc.lat(), loc.lng(), results[0].formatted_address);
        } else {
          onError(`Location not found (${status}).`);
        }
      });
    } else if (request.type === 'gps') {
      geocoder.geocode({ location: { lat: request.lat, lng: request.lng } }, (results, status) => {
        let address = 'Your Location';
        if (status === 'OK' && results[0]) {
          address = results[0].formatted_address;
        }
        processLocation(request.lat, request.lng, address);
      });
    }
  }, [geocodingLib, placesLib, map, request]);

  return null;
}

// ─── Markers + InfoWindows rendered inside the Map ────────────────────────────
function StationMarkers({ stations, activeId, onMarkerClick, onClose }) {
  return (
    <>
      {stations.map((station) => (
        <Marker
          key={station.id}
          position={{ lat: station.lat, lng: station.lng }}
          title={station.name}
          onClick={() => onMarkerClick(station.id)}
        />
      ))}

      {activeId && (() => {
        const s = stations.find(st => st.id === activeId);
        if (!s) return null;
        return (
          <InfoWindow
            position={{ lat: s.lat, lng: s.lng }}
            onCloseClick={onClose}
            pixelOffset={[0, -50]}
          >
            <div className="booth-infowindow-container">
              <div className="booth-infowindow-title">{s.name}</div>
              <div className="booth-infowindow-address">{s.address}</div>
              <div className="booth-infowindow-meta">
                <span className="booth-distance-tag">{s.distance}</span>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="booth-directions-link"
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
  const defaultLat = 28.6139;
  const defaultLng = 77.2090;
  
  const initialStations = MOCK_STATIONS.map((s) => ({
    ...s,
    lat: defaultLat + s.offsetLat,
    lng: defaultLng + s.offsetLng,
    address: 'Connaught Place, New Delhi' + s.addressSuffix,
  }));

  const [search, setSearch] = useState('');
  const [locationRequest, setLocationRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: defaultLat, lng: defaultLng }); // Default to New Delhi
  const [stations, setStations] = useState(initialStations);
  const [activeStationId, setActiveStationId] = useState(null);
  const [error, setError] = useState('');
  const [geolocating, setGeolocating] = useState(false);
  const [hasSearched, setHasSearched] = useState(true); // Default to true so zoom is correct and stations show
  const inputRef = useRef(null);

  const handleSearch = useCallback(() => {
    if (!search.trim()) return;
    setLoading(true);
    setError('');
    setStations([]);
    setActiveStationId(null);
    setHasSearched(true);
    setLocationRequest({ type: 'address', query: search.trim() });
  }, [search]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleLocationResult = useCallback(({ lat, lng, stations }) => {
    setMapCenter({ lat, lng });
    setStations(stations);
    setLoading(false);
    setGeolocating(false);
  }, []);

  const handleLocationError = useCallback((msg) => {
    setError(msg);
    setLoading(false);
    setGeolocating(false);
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
        setLocationRequest({ type: 'gps', lat: pos.coords.latitude, lng: pos.coords.longitude });
        setHasSearched(true);
      },
      () => {
        setError('Unable to retrieve your location. Please check browser permissions.');
        setGeolocating(false);
      },
      { timeout: 10000 }
    );
  };

  const noApiKey = !MAPS_API_KEY;

  return (
    <div className="help-center-container">
      {/* Header */}
      <div className="section-header-center">
        <h1 className="section-title">Polling Station Locator</h1>
        <p className="section-description">
          Find your designated polling booth instantly. Enter your locality, area name, or EPIC number to see nearby stations on the map.
        </p>
      </div>

      {/* API Key Warning */}
      {noApiKey && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="api-key-warning"
        >
          <AlertCircle size={20} className="api-key-warning-icon" />
          <div>
            <strong className="api-key-warning-title">Google Maps API Key Required</strong>
            <p className="api-key-warning-text">
              Add your Maps JavaScript API key as <code>VITE_GOOGLE_MAPS_API_KEY</code> in <code>.env</code>.{' '}
              <a
                href="https://developers.google.com/maps/documentation/javascript/get-api-key?utm_source=gmp-code-assist"
                target="_blank"
                rel="noopener noreferrer"
                className="api-key-warning-link"
              >
                Get a key →
              </a>
            </p>
          </div>
        </motion.div>
      )}

      <div className="booth-layout">
        {/* ── Left Panel: Search ── */}
        <div className="card booth-search-panel">
          <h3 className="booth-search-header">
            <Compass size={20} color="var(--primary-accent)" /> Search Your Booth
          </h3>

          <div className="flex-column-gap-md">
            {/* Search input */}
            <div className="booth-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                id="booth-search-input"
                className="form-input"
                placeholder="Enter locality, area or EPIC no."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Search
                size={16}
                className="booth-search-icon"
              />
            </div>

            {/* Find button */}
            <button
              id="booth-find-btn"
              className="btn btn-primary w-full justify-center"
              onClick={handleSearch}
              disabled={loading || !search.trim()}
            >
              {loading ? 'Locating...' : <><MapPin size={16} /> Find Stations</>}
            </button>

            {/* Divider */}
            <div className="booth-divider">
              <div className="booth-divider-line" />
              or
              <div className="booth-divider-line" />
            </div>

            {/* Use My Location button */}
            <button
              id="booth-location-btn"
              className="btn btn-secondary w-full justify-center"
              onClick={handleUseLocation}
              disabled={geolocating}
            >
              <LocateFixed size={16} />
              {geolocating ? 'Locating…' : 'Use My Location'}
            </button>
            
            {/* Error Message */}
            {error && (
              <div className="booth-error-msg">
                <AlertCircle size={16} /> {error}
              </div>
            )}
          </div>

          {/* Station list (results) */}
          <AnimatePresence>
            {stations.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="booth-station-list mobile-hidden"
              >
                <p className="booth-results-count">
                  {stations.length} Stations Found
                </p>
                {stations.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveStationId(activeStationId === s.id ? null : s.id)}
                    className={`station-result-card ${activeStationId === s.id ? 'active' : ''}`}
                  >
                    <div className="booth-station-icon-box">
                      <MapPin size={15} color="#fff" />
                    </div>
                    <div>
                      <div className="booth-station-name">
                        {s.name}
                      </div>
                      <div className="booth-station-meta">
                        Booth {s.boothNo} · {s.distance}
                      </div>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="booth-directions-link"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--primary-accent)', fontWeight: '600', textDecoration: 'none' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Navigation size={14} /> Get Directions
                      </a>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right Panel: Map ── */}
        <div className="booth-map-panel">
          {/* Map container */}
          <div className="booth-map-container">
            <APIProvider
              apiKey={MAPS_API_KEY}
            >
              {locationRequest && (
                <LocationServicesComponent
                  request={locationRequest}
                  onResult={handleLocationResult}
                  onError={handleLocationError}
                />
              )}
              <Map
                defaultCenter={mapCenter}
                defaultZoom={hasSearched ? 14 : 5}
                gestureHandling="greedy"
                disableDefaultUI={false}
                className="booth-map-canvas"
                style={{ width: '100%', height: '100%' }}
              >
                {stations.length > 0 && <MapPanner center={mapCenter} />}
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

            {!hasSearched && (
              <div className="booth-map-empty-overlay">
                <Globe size={56} className="booth-map-overlay-icon" />
                <p className="booth-map-overlay-text">
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
                className="booth-station-list"
              >
                <p className="booth-results-count">Found {stations.length} Polling Stations Near You</p>
                {stations.map((s, i) => (
                  <motion.div
                    key={s.id}
                    className={`card booth-detail-card ${activeStationId === s.id ? 'active' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setActiveStationId(prev => prev === s.id ? null : s.id)}
                  >
                    <div className="booth-detail-card-header">
                      <div>
                        <h3 className="booth-detail-card-title">{s.name}</h3>
                        <p className="booth-detail-card-subtitle">
                          Booth No: <strong>{s.boothNo}</strong>
                        </p>
                      </div>
                      <span className="booth-detail-card-badge">
                        {s.distance}
                      </span>
                    </div>

                    <p className="booth-detail-card-address">
                      <MapPin size={13} />
                      {s.address}
                    </p>

                    <div className="booth-detail-card-footer">
                      <div className="booth-detail-card-contact">
                        <div className="booth-contact-icon-box">
                          <Phone size={16} color="var(--text-muted)" />
                        </div>
                        <div>
                          <div className="booth-contact-label">BLO: {s.blo}</div>
                          <div className="booth-contact-value">{s.bloPhone}</div>
                        </div>
                      </div>

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-decoration-none"
                      >
                        <button className="btn btn-primary booth-directions-btn">
                          <Navigation size={14} /> Directions
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

      {/* Attribution */}
      <p className="booth-attribution">
        Map data ©{new Date().getFullYear()} Google · Polling data is illustrative for demo purposes
      </p>

    </div>

  );
};

export default BoothLocator;
