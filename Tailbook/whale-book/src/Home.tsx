import { Whales, WhaleActivity } from "@whaletail/sdk";
import css from "./Home.module.css";
import Layout from "./Layout";
import { useEffect, useCallback, useState } from "react";
import { client } from "./api/client";
import { Link } from "react-router-dom";

interface Whale {
  commonName?: string;
  locality?: string;
  waterBody?: string;
  scientificName?: string;
  verbatimLocality?: string;
  externalResource?: string;
  organismId?: string;
  organismName?: string;
  vernacularName?: string;
  speciesName?: string;
  higherGeography?: string;
  occurrenceRemarks?: string;
  organismRemarks?: string;
  $primaryKey?: string;
  $title?: string;
  distinctOrganismIdCount?: string;
}

function LoadingWhales() {
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-bounce mb-4 text-4xl">
        🐋
      </div>
      
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>

      <div className="text-center max-w-md">
        <p className="text-gray-600 text-sm mb-4">Finding whales nearby...</p>
        
        <div className="space-y-2 text-sm text-gray-500">
          {countdown > 45 && (
            <p className={css.loadingText}>
              Scanning ocean basins and{' '}
              <span className={css.bounce} style={{ animationDelay: '0.1s' }}>migration</span>{' '}
              <span className={css.bounce} style={{ animationDelay: '0.2s' }}>routes</span>...
            </p>
          )}
          {countdown > 30 && countdown <= 45 && (
            <p className={css.loadingText}>
              Analyzing{' '}
              <span className={css.bounce} style={{ animationDelay: '0.1s' }}>recent</span>{' '}
              <span className={css.bounce} style={{ animationDelay: '0.2s' }}>whale</span>{' '}
              <span className={css.bounce} style={{ animationDelay: '0.3s' }}>activity</span>{' '}
              in your area...
            </p>
          )}
          {countdown > 15 && countdown <= 30 && (
            <p className={css.loadingText}>
              Identifying the{' '}
              <span className={css.bounce} style={{ animationDelay: '0.1s' }}>most</span>{' '}
              <span className={css.bounce} style={{ animationDelay: '0.2s' }}>interesting</span>{' '}
              <span className={css.bounce} style={{ animationDelay: '0.3s' }}>whales</span>...
            </p>
          )}
          {countdown <= 15 && (
            <p className={css.loadingText}>
              Almost there!{' '}
              <span className={css.bounce} style={{ animationDelay: '0.1s' }}>Preparing</span>{' '}
              <span className={css.bounce} style={{ animationDelay: '0.2s' }}>your</span>{' '}
              <span className={css.bounce} style={{ animationDelay: '0.3s' }}>whale</span>{' '}
              <span className={css.bounce} style={{ animationDelay: '0.4s' }}>encounters</span>...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface WhaleStats {
  distinctLocations?: number;
  totalSightings?: number;
  activeWhales?: number;
}

function StatCard({ 
  icon, 
  title, 
  value, 
  description 
}: { 
  icon: string; 
  title: string; 
  value?: number | string; 
  description: string; 
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center space-x-3 mb-3">
        <div className="text-3xl">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      </div>
      <div className="space-y-2">
        <div className="text-3xl font-bold text-blue-600">
          {value ?? (
            <div className="animate-pulse h-8 w-24 bg-gray-200 rounded"></div>
          )}
        </div>
        <div className="text-sm text-gray-500">{description}</div>
      </div>
    </div>
  );
}

interface RegionStat {
  $group: {
    higherGeography: string;
  };
  $count: number;
}

function MiniStatCard({ region, count }: { region: string; count: number }) {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 shadow hover:shadow-md transition-shadow">
      <div className="text-xs font-medium text-gray-500">{region}</div>
      <div className="text-lg font-bold text-blue-600">{count.toLocaleString()}</div>
    </div>
  );
}

// Add this interface for the paginated response
interface WhaleResponse {
  nextPageToken?: string;
  data: {
    commonName?: string;
    locality?: string;
    waterBody?: string;
    scientificName?: string;
    verbatimLocality?: string;
    externalResource?: string;
    organismId?: string;
    organismName?: string;
    vernacularName?: string;
    speciesName?: string;
    higherGeography?: string;
    occurrenceRemarks?: string;
    organismRemarks?: string;
    $primaryKey?: string;
    $title?: string;
    distinctOrganismIdCount?: string;
  }[];
}

function Home() {
  const [stats, setStats] = useState<WhaleStats>({});
  const [locationStats, setLocationStats] = useState<RegionStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGeography, setSelectedGeography] = useState<string>("North Atlantic");
  const [filteredWhales, setFilteredWhales] = useState<Whale[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [totalActivities, setTotalActivities] = useState<number>(0);

  const handleGeographyChange = useCallback(async (geography: string) => {
    setSelectedGeography(geography);
    setIsLoading(true);
    setNextPageToken(undefined);
    setFilteredWhales([]); // Clear existing whales

    try {
      const response: WhaleResponse = await client(Whales)
        .where({
          higherGeography: geography,
          distinctOrganismIdCount: { $gt: 2 }
        })
        .fetchPage({ 
          $pageSize: 8,
          $nextPageToken: undefined
        });

      console.log('whal response',response);
      setFilteredWhales(response.data as Whale[]);
      setNextPageToken(response.nextPageToken);
    } catch (error) {
      console.error('Error fetching whales:', error);
      setError('Failed to fetch whales');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    handleGeographyChange(selectedGeography);
  }, []); // Only run on mount

  // Add the loadMore function
  const loadMore = useCallback(async () => {
    if (!nextPageToken || isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
      const response: WhaleResponse = await client(Whales)
        .where({
          higherGeography: selectedGeography,
          distinctOrganismIdCount: { $gt: 2 }
        })
        .fetchPage({ 
          $pageSize: 8,
          $nextPageToken: nextPageToken
        });

      setFilteredWhales(prev => [...prev, ...response.data]);
      setNextPageToken(response.nextPageToken);
    } catch (error) {
      console.error('Error loading more whales:', error);
      setError('Failed to load more whales');
    } finally {
      setIsLoadingMore(false);
    }
  }, [nextPageToken, isLoadingMore, selectedGeography]);

  // Add this useEffect for stats
  useEffect(() => {
    async function fetchStats() {
      try {
        // Get locations and counts
        const response = await client(Whales)
          .aggregate({
            $select: { $count: "unordered" },
            $groupBy: { higherGeography: "exact" }
          });

        setLocationStats(response.map(stat => ({
          $group: {
            higherGeography: stat.$group.higherGeography || 'Unknown'
          },
          $count: stat.$count
        })));

        // Calculate total sightings across all locations
        const totalSightings = response.reduce((acc, curr) => acc + curr.$count, 0);
        
        // Count the number of unique higher geography entries
        const uniqueLocations = response.length;
        
        setStats(prevStats => ({
          ...prevStats,
          distinctLocations: uniqueLocations,
          totalSightings: totalSightings,
          // Keep other stats if they exist
          activeWhales: prevStats.activeWhales
        }));

      } catch (error) {
        console.error('Error fetching whale stats:', error);
      }
    }

    fetchStats();
  }, []);

  // Add this useEffect for fetching total activities
  useEffect(() => {
    async function fetchTotalActivities() {
      try {
        const count = await client(WhaleActivity)
          .aggregate({
            $select: { $count: "unordered" },
          });
        console.log('count: ',count)
        setTotalActivities(count.$count);
      } catch (error) {
        console.error('Error fetching total activities:', error);
      }
    }
    fetchTotalActivities();
  }, []);

  return (
    <Layout>
      {/* Main Stats */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Global Whale Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon="🌎"
            title="Unique Locations"
            value={stats.distinctLocations}
            description="Different ocean basins with whale activity"
          />
          <StatCard
            icon="👀"
            title={`Sightings in ${selectedGeography}`}
            value={stats.totalSightings?.toLocaleString()}
            description="Number of whale sightings in this region"
          />
          <StatCard
            icon="🌊"
            title="Total Global Sightings"
            value={totalActivities.toLocaleString()}
            description="Total whale sightings worldwide"
          />
        </div>

        {/* Regional Breakdown */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Regional Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {locationStats.sort((a, b) => b.$count - a.$count).map((stat: RegionStat) => (
              <MiniStatCard
                key={stat.$group.higherGeography}
                region={stat.$group.higherGeography}
                count={stat.$count}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Whales in {selectedGeography}</h1>
        <div className="flex items-center gap-3">
          <select
            value={selectedGeography}
            onChange={(e) => handleGeographyChange(e.target.value)}
            className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="North Atlantic">North Atlantic (13,475)</option>
            <option value="North Pacific">North Pacific (149,852)</option>
            <option value="South Pacific">South Pacific (20,448)</option>
            <option value="Southern">Southern Ocean (11,340)</option>
            <option value="Indian">Indian Ocean (10,257)</option>
            <option value="South Atlantic">South Atlantic (7,202)</option>
            <option value="Arctic">Arctic Ocean (5,890)</option>
          </select>
        </div>
      </div>

      {isLoading && !isLoadingMore ? (
        <LoadingWhales />
      ) : error ? (
        <div className="text-red-600 py-4 text-center">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
            {filteredWhales.map((whale) => (
              <div key={whale.$primaryKey} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-square relative">
                  <img
                    src={whale.externalResource}
                    alt={`${whale.organismName} - ${whale.scientificName}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex justify-between items-end gap-2">
                      <div className="text-white min-w-0 flex-1">
                        <div className="text-xs font-medium truncate">{whale.waterBody}</div>
                        <div className="text-sm truncate">{whale.verbatimLocality}</div>
                      </div>
                      <Link 
                        to={`/whale/${whale.organismId?.split('/').pop()}`}
                        className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 whitespace-nowrap flex-shrink-0"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-lg leading-tight truncate">
                        {whale.organismName}
                      </h3>
                      <p className="text-sm text-gray-600 italic truncate">
                        {whale.scientificName}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-black-800 whitespace-nowrap flex-shrink-0">
                      {whale.distinctOrganismIdCount} Encounters
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📍</span>
                      {whale.locality}
                    </div>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {nextPageToken && (
            <div className="flex justify-center py-4">
              <button
                onClick={loadMore}
                className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                disabled={isLoadingMore}
              >
                {isLoadingMore ? 'Loading...' : 'Load More Whales'}
              </button>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}

export default Home;
