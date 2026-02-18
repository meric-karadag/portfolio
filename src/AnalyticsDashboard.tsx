import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, COLLECTION_PATH } from './firebase';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const geoUrl = import.meta.env.BASE_URL + "world-110m.json";

interface AnalyticsEvent {
  id: string;
  event_type: string;
  view?: string;
  timestamp: any;
  location?: {
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  ip?: string; 
}

const AnalyticsDashboard = () => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const q = query(
          collection(db, COLLECTION_PATH.ANALYTICS),
          orderBy('timestamp', 'desc'),
          limit(50)
        );
        const querySnapshot = await getDocs(q);
        const fetchedEvents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as AnalyticsEvent));
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Filter for events with location data for the map
  const mapData = events.filter(e => e.location?.latitude && e.location?.longitude);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 pb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#D4693F] to-orange-400 bg-clip-text text-transparent">
            Analytics Command Center
          </h1>
          <div className="text-sm text-gray-400">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            Live Local View
          </div>
        </div>

        {/* World Map Section */}
        <div className="bg-[#2C2C2C] rounded-2xl border border-gray-700 p-6 overflow-hidden relative min-h-[500px]">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="text-2xl">🌍</span> Global Traffic Map
          </h2>
          
          <div className="w-full h-full flex items-center justify-center">
             <ComposableMap 
                projection="geoMercator" 
                projectionConfig={{ scale: 140 }}
                className="w-full h-full max-h-[600px]"
             >
                <Geographies geography={geoUrl}>
                  {({ geographies }: { geographies: any[] }) =>
                    geographies.map((geo: any) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#3C3C3C"
                        stroke="#4A4A4A"
                        strokeWidth={0.5}
                        style={{
                            default: { outline: "none" },
                            hover: { fill: "#4A4A4A", outline: "none" },
                            pressed: { outline: "none" },
                        }}
                      />
                    ))
                  }
                </Geographies>

                {mapData.map((event) => (
                  <Marker 
                    key={event.id} 
                    coordinates={[event.location?.longitude || 0, event.location?.latitude || 0]}
                  >
                    <circle r={6} fill="#D4693F" opacity={0.4} className="animate-ping" />
                    <circle r={3} fill="#D4693F" stroke="#fff" strokeWidth={1} />
                  </Marker>
                ))}
            </ComposableMap>
          </div>
        </div>

        {/* Recent Access List */}
        <div className="bg-[#2C2C2C] rounded-2xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold flex items-center gap-2">
               <span className="text-2xl">📡</span> Recent Signals
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#242424] text-xs uppercase font-medium text-gray-500">
                <tr>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                    <tr><td colSpan={4} className="p-8 text-center text-gray-500">Loading signals...</td></tr>
                ) : events.map((event) => (
                  <tr key={event.id} className="hover:bg-[#363636] transition-colors">
                    <td className="px-6 py-4 font-mono text-[#D4693F]">
                      {event.timestamp?.seconds ? new Date(event.timestamp.seconds * 1000).toLocaleString() : 'Just now'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.event_type === 'cv_download' 
                            ? 'bg-blue-900/50 text-blue-200 border border-blue-800' 
                            : 'bg-green-900/50 text-green-200 border border-green-800'
                      }`}>
                        {event.event_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {event.location?.city}, {event.location?.country}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {event.view || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsDashboard;
