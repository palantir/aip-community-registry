import { useParams, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import Map, { Marker, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState } from 'react';
import { client } from './api/client';
import { $Queries, WhaleActivity, Whales } from '@whaletail/sdk';

interface WhaleProfile {
  commonName?: string;
  externalResource?: string;
  higherGeography?: string;
  locality?: string;
  occurrenceRemarks?: string;
  organismId: string;
  organismName?: string;
  organismRemarks?: string;
  scientificName?: string;
  sex?: string;
  speciesName?: string;
  verbatimLocality?: string;
  vernacularName?: string;
  waterBody?: string;
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface RouteData {
  route: string;
  zoological_reasoning: string;
}

interface ActivityStats {
  totalSightings: number;
  regionCounts: { [key: string]: number };
}

function WhaleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [parsedRoute, setParsedRoute] = useState<any>(null);
  const [profile, setProfile] = useState<WhaleProfile | null>(null);
  const [isMigrationOpen, setIsMigrationOpen] = useState(false);
  const [activityStats, setActivityStats] = useState<ActivityStats>({
    totalSightings: 0,
    regionCounts: {}
  });

  useEffect(() => {
    async function fetchWhaleData() {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const whaleId = id.split('/').pop();
        const fullWhaleUrl = `https://happywhale.com/individual/${whaleId}`;
        
        const result = await client($Queries.whaleLocation).executeFunction({
          whale: fullWhaleUrl
        });
        console.log('API Response:', result);
        setRouteData(result);
      } catch (err) {
        console.error('Error fetching whale:', err);
        setError(`Failed to load whale data: ${error}`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWhaleData();
  }, [id]);

  useEffect(() => {
    if (routeData?.route) {
      try {
        const parsed = JSON.parse(routeData.route);
        setParsedRoute(parsed);
      } catch (err) {
        console.error('Error parsing route data:', err);
      }
    }
  }, [routeData]);

  useEffect(() => {
    async function fetchWhaleProfile() {
      if (!id) return;
      console.log('Fetching whale profile for:', `https://happywhale.com/individual/${id}`);
      try {
        const profileData = await client(Whales).fetchOne(`https://happywhale.com/individual/${id}`);
        setProfile(profileData);
      } catch (err) {
        console.error('Error fetching whale profile:', err);
      }
    }

    fetchWhaleProfile();
  }, [id]);

  useEffect(() => {
    async function fetchActivityStats() {
      if (!profile?.organismId) return;
      
      try {
        const response = await client(WhaleActivity)
          .where({
            organismId: { $eq: profile.organismId }
          })
          .fetchPage({ $pageSize: 100 });

        // Calculate stats from response.data
        const regionCounts = response.data.reduce((acc, activity) => {
          const region = activity.higherGeography || 'Unknown';
          acc[region] = (acc[region] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number });

        setActivityStats({
          totalSightings: response.data.length,
          regionCounts
        });
      } catch (err) {
        console.error('Error fetching whale activity:', err);
      }
    }

    fetchActivityStats();
  }, [profile?.organismId]);

  // Calculate map bounds based on all features
  const getBounds = () => {
    if (!parsedRoute?.features) return null;
    
    // Find the first point coordinate
    const firstPoint = parsedRoute.features.find((f: any) => f.geometry.type === 'Point');
    
    if (!firstPoint) return null;
    
    return {
      longitude: firstPoint.geometry.coordinates[0],
      latitude: firstPoint.geometry.coordinates[1],
      zoom: 8.5,
      padding: { top: 20, bottom: 20, left: 20, right: 20 }
    };
  };

  function MapLoadingSpinner() {
    return (
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
        <div className="flex flex-col items-center">
          <div className="animate-spin text-6xl mb-4">🌏</div>
          <div className="text-lg font-medium text-gray-600">Loading whale migration data...</div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/')}
          className="mb-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <span className="text-lg">←</span>
          Back to Whales
        </button>

        {/* Whale Profile Header */}
        {profile && (
          <div className="mb-8 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3">
                <img
                  src={profile.externalResource}
                  alt={profile.organismName}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="p-6 md:w-2/3">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{profile.organismName}</h1>
                  {profile.sex && (
                    <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                      {profile.sex}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 italic mb-4">{profile.scientificName}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Species</div>
                    <div className="font-medium">{profile.speciesName}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Region</div>
                    <div className="font-medium">{profile.higherGeography}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Water Body</div>
                    <div className="font-medium">{profile.waterBody}</div>
                  </div>
                </div>

                {profile.organismRemarks && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">About</h3>
                    <p className="text-gray-700">{profile.organismRemarks}</p>
                  </div>
                )}

                <div className="space-y-2">
                  {profile.locality && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">📍</span>
                      <span>{profile.locality}</span>
                    </div>
                  )}
                  {profile.vernacularName && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">🏷️</span>
                      <span>{profile.vernacularName}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Whale Activity Stats */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Sightings</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {activityStats.totalSightings}
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-sm font-medium text-gray-500">Unique Regions</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {Object.keys(activityStats.regionCounts).length}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-sm font-medium text-gray-500">Most Common Region</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {Object.entries(activityStats.regionCounts)
                .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
            </p>
          </div>
        </div>

        {/* Region Distribution */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Region Distribution</h3>
          <div className="space-y-3">
            {Object.entries(activityStats.regionCounts)
              .sort(([,a], [,b]) => b - a)
              .map(([region, count]) => (
                <div key={region} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{region}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ 
                          width: `${(count / activityStats.totalSightings) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 w-16 text-right">
                    {count} sightings
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Migration Pattern Details */}
        {routeData && (
          <div className="mb-4">
            {/* Zoological Reasoning */}
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h2 className="text-xl font-semibold mb-3">Migration Pattern</h2>
              <p className="text-gray-700 leading-relaxed">
                {routeData.zoological_reasoning}
              </p>
            </div>

            {/* Technical Details Collapsible */}
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <button
                onClick={() => setIsMigrationOpen(!isMigrationOpen)}
                className="w-full px-4 py-2 flex items-center justify-between text-sm text-gray-600 hover:bg-gray-200"
              >
                <span>Detailed Sighting Information</span>
                <span className={`transform transition-transform ${isMigrationOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {isMigrationOpen && (
                <div className="p-4 space-y-4">
                  {parsedRoute?.features.map((feature: any, index: number) => (
                    <div key={index} className="text-sm text-gray-600">
                      {feature.properties.title && (
                        <strong className="block text-gray-700 mb-1">
                          {feature.properties.title}
                        </strong>
                      )}
                      <p>{feature.properties.description}</p>
                      <div className="mt-1 text-xs text-gray-500">
                        Coordinates: [{feature.geometry.coordinates.join(', ')}]
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Map Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-[600px] relative">
            {isLoading && <MapLoadingSpinner />}
            <Map
              initialViewState={getBounds() || {
                longitude: -40,
                latitude: 40,
                zoom: 2
              }}
              padding={{ top: 50, bottom: 50, left: 50, right: 50 }}
              style={{ width: '100%', height: '100%' }}
              mapStyle="mapbox://styles/mapbox/light-v11"
              mapboxAccessToken={MAPBOX_TOKEN}
            >
              {parsedRoute?.features.map((feature: any, index: number) => {
                if (feature.geometry.type === 'LineString') {
                  return (
                    <Source
                      key={`route-${index}`}
                      id={`route-${index}`}
                      type="geojson"
                      data={feature}
                    >
                      <Layer
                        id={`route-${index}`}
                        type="line"
                        paint={{
                          'line-color': '#2563eb',
                          'line-width': 2
                        }}
                      />
                    </Source>
                  );
                } else if (feature.geometry.type === 'Point') {
                  return (
                    <Marker
                      key={`point-${index}`}
                      longitude={feature.geometry.coordinates[0]}
                      latitude={feature.geometry.coordinates[1]}
                    >
                      <div 
                        className="text-2xl cursor-pointer"
                        title={feature.properties.description}
                      >
                        🐋
                      </div>
                    </Marker>
                  );
                }
                return null;
              })}
            </Map>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default WhaleDetail;
