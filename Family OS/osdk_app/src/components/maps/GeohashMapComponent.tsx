import { useMemo } from 'react';
import ngeohash from 'ngeohash';
import * as PropTypes from "prop-types"

/**
 * GeohashMap: renders a static OpenStreetMap image with markers decoded from geohashes.
 *
 * Props:
 *   - geohashes: string[]   array of geohash strings to plot
 *   - width: number         image width in pixels (default: 600)
 *   - height: number        image height in pixels (default: 400)
 */
export default function GeohashMap({ geohashes = [], width = 600, height = 400 }) {
  // Decode geohashes into {lat, lng}
  const points = useMemo(
    () => geohashes.map(code => {
      const { latitude, longitude } = ngeohash.decode(code);
      return { lat: latitude, lng: longitude };
    }),
    [geohashes]
  );

  // If no points, render placeholder
  if (points.length === 0) {
    return <div style={{ width: `${width}px`, height: `${height}px`, background: '#eee' }}>No locations</div>;
  }

  // Compute bounding box
  const lats = points.map(p => p.lat);
  const lngs = points.map(p => p.lng);
  const north = Math.max(...lats);
  const south = Math.min(...lats);
  const east = Math.max(...lngs);
  const west = Math.min(...lngs);

  // Build markers parameter (OSM static maps expects "lat,lng,markerStyle") joined by |
  const markersParam = points
    .map(p => `${p.lat},${p.lng},red-pushpin`)
    .join('|');

  // Construct static map URL
  const mapUrl = `https://staticmap.openstreetmap.de/staticmap.php?bbox=${west},${south},${east},${north}&size=${width}x${height}&markers=${markersParam}`;

  return (
    <img
      src={mapUrl}
      width={width}
      height={height}
      alt="Static map of geohash locations"
      style={{ display: 'block' }}
    />
  );
}

GeohashMap.propTypes = {
  geohashes: PropTypes.arrayOf(PropTypes.string).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
}