import  { useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


function RoadTrackingSystem() {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [roadData, setRoadData] = useState([]);

  const handleSubmit = async () => {
    try {
      // Use a hypothetical API to fetch road data between start and end locations
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${startLocation};${endLocation}?overview=full`
      );
      const data = await response.json();
      setRoadData(data);
    } catch (error) {
      console.error('Error fetching road data:', error);
    }
  };

  return (
    <div className='w-full h-screen flex_center '>
       <div className='w-[30%] h-full flex_col_center gap-y-16'>
       <input
        type="text"
        placeholder="Start Location"
        className="w-[90%] px-3 py-2 bg-[#dbdbdb] placeholder-gray-400 text-gray-900 rounded-lg border-none focus:ring-0 focus:border-none"

        value={startLocation}
        onChange={(e) => setStartLocation(e.target.value)}
      />
      <input
        type="text"
        placeholder="End Location"
        value={endLocation}
        className="w-[90%] px-3 py-2 bg-[#dbdbdb] placeholder-gray-400 text-gray-900 rounded-lg border-none focus:ring-0 focus:border-none"

        onChange={(e) => setEndLocation(e.target.value)}
      />
      <button onClick={handleSubmit} className='w-44 h-12 bg-white rounded-md shadow-md shadow-slate-400 text-slate-950'>Get Road Data</button>

       </div>
     <div className='w-[70%] h-full '>
      <MapContainer center={[51.505, -0.09]} zoom={13} className="w-full h-screen">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {roadData.length > 0 && (
          <Polyline
            positions={roadData}
            color="blue"
          />
        )}
      </MapContainer>
      </div>
    </div>
  );
}

export default RoadTrackingSystem;
