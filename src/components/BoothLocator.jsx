import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  MapPin, Search, Navigation, Phone,
  Globe, Compass, LocateFixed, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Fix for default Leaflet markers in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// ─── Mock polling stations relative to searched location ──────────────────────
const MOCK_STATIONS = [
  {
    id: 1,
    name: 'Central Public School – Room 4',
    addressSuffix: ', Near Community Center',
    offsetLat: 0.003,
    offsetLng: 0.002,
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

// ─── Map panner – moves map to searched location ──────────────────────────────
function MapPanner({ center }) {
  const map = useMap();
  useEffect(() => {
    if (map && center) {
      map.flyTo([center.lat, center.lng], 15, { animate: true });
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
    distance: getDistance(defaultLat, defaultLng, defaultLat + s.offsetLat, defaultLng + s.offsetLng) + ' km',
    address: 'Connaught Place, New Delhi' + s.addressSuffix,
  }));

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: defaultLat, lng: defaultLng }); // Default to New Delhi
  const [stations, setStations] = useState(initialStations);
  const [activeStationId, setActiveStationId] = useState(null);
  const [error, setError] = useState('');
  const [geolocating, setGeolocating] = useState(false);
  const [hasSearched, setHasSearched] = useState(true);
  const inputRef = useRef(null);

  const processLocation = (lat, lng, formattedAddress) => {
    const generatedStations = MOCK_STATIONS.map((s) => {
      const pLat = lat + s.offsetLat;
      const pLng = lng + s.offsetLng;
      return {
        ...s,
        lat: pLat,
        lng: pLng,
        address: formattedAddress.split(',').slice(0, 2).join(', ') + s.addressSuffix,
        distance: getDistance(lat, lng, pLat, pLng) + ' km',
      };
    });
    setMapCenter({ lat, lng });
    setStations(generatedStations);
    setLoading(false);
    setGeolocating(false);
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    setLoading(true);
    setError('');
    setStations([]);
    setActiveStationId(null);
    setHasSearched(true);
    
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(search.trim())}, India&format=json&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        processLocation(parseFloat(data[0].lat), parseFloat(data[0].lon), data[0].display_name);
      } else {
        setError('Location not found. Please try a different search.');
        setLoading(false);
      }
    } catch (err) {
      setError('Error connecting to map service.');
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setGeolocating(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setHasSearched(true);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const data = await res.json();
          processLocation(lat, lng, data.display_name || 'Your Location');
        } catch (err) {
          processLocation(lat, lng, 'Your Location');
        }
      },
      () => {
        setError('Unable to retrieve your location. Please check browser permissions.');
        setGeolocating(false);
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="help-center-container">
      {/* Header */}
      <div className="section-header-center">
        <h1 className="section-title">Polling Station Locator</h1>
        <p className="section-description">
          Find your designated polling booth instantly. Enter your locality, area name, or EPIC number to see nearby stations on the map.
        </p>
      </div>

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
          <div className="booth-map-container" style={{ zIndex: 0 }}>
            <MapContainer 
              center={[mapCenter.lat, mapCenter.lng]} 
              zoom={hasSearched ? 14 : 5} 
              style={{ width: '100%', height: '100%', zIndex: 0 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {stations.length > 0 && <MapPanner center={mapCenter} />}
              {stations.map(station => (
                <Marker 
                  key={station.id} 
                  position={[station.lat, station.lng]}
                  eventHandlers={{
                    click: () => setActiveStationId(station.id)
                  }}
                >
                  <Popup>
                    <div className="booth-infowindow-container" style={{ minWidth: '200px' }}>
                      <div className="booth-infowindow-title" style={{ fontWeight: 'bold', marginBottom: '4px' }}>{station.name}</div>
                      <div className="booth-infowindow-address" style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>{station.address}</div>
                      <div className="booth-infowindow-meta">
                        <span className="booth-distance-tag" style={{ background: 'var(--primary-accent)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>
                          {station.distance}
                        </span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {!hasSearched && (
              <div className="booth-map-empty-overlay" style={{ zIndex: 1000 }}>
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
      <p className="booth-attribution" style={{ textAlign: 'center', margin: '2rem 0', color: '#666', fontSize: '0.85rem' }}>
        Map Data &copy; OpenStreetMap Contributors &middot; Polling data is illustrative for demo purposes
      </p>
    </div>
  );
};

export default BoothLocator;
