import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import Location from "../imgs/location.png";
import userLocationMarker from "../imgs/userLocationMarker.png";
import "leaflet/dist/leaflet.css";

// Wrapper component to handle forwardRef
const ForwardRefMap = forwardRef(({ center, zoom, children }, ref) => {
  return <MapContainer ref={ref} center={center} zoom={zoom}>{children}</MapContainer>;
});

const RoadTrackingSystem = forwardRef((props, ref) => {
  const [startLocation, setStartLocation] = useState({
    lat: 0,
    lon: 0,
    areaName: "",
  });
  const [endLocation, setEndLocation] = useState({
    lat: 0,
    lon: 0,
    areaName: "",
  });
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const [position, setPosition] = useState([23.6079, 89.8415]);
  const [distance, setDistance] = useState(0);
  const [price, setPrice] = useState(0);
  const [rickshawPullers, setRickshawPullers] = useState([]);

  const customIcon = new Icon({
    iconUrl: Location,
    iconSize: [52, 52],
  });
  const userLocationIcon = new Icon({
    iconUrl: userLocationMarker,
    iconSize: [52, 52],
  });
  const serverUrl = "http://localhost:5001";

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        checkRickshawPullers({ lat: latitude, lon: longitude });
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const checkRickshawPullers = async (location) => {
    await fetch(`${serverUrl}/trackRickshawPullers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lat: location.lat,
        lon: location.lon,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((pullers) => {
        console.log(pullers);
      })
      .catch((error) => {
        console.error("Error checking rickshaw pullers:", error);
      });
  };

  const handleInputChange = (input, setLocation, setSuggestions) => {
    setLocation((prevLocation) => ({ ...prevLocation, areaName: input }));

    if (input.length <= 3) {
      const filteredSuggestions = allSuggestions.filter((suggestion) =>
        suggestion.areaName.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleStartLocationChange = (input) => {
    handleInputChange(input, setStartLocation, setStartSuggestions);
    setEndSuggestions([]);
  };

  const handleEndLocationChange = (input) => {
    handleInputChange(input, setEndLocation, setEndSuggestions);
    setStartSuggestions([]);
  };

  const handleSuggestionClick = (suggestion, setLocation, setSuggestions) => {
    setLocation({
      lat: suggestion.lat,
      lon: suggestion.lon,
      areaName: suggestion.areaName,
    });
    setSuggestions([]);
  };

  const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000;
    return distance;
  };

  const handleSubmit = () => {
    const distanceBetweenLocations = calculateHaversineDistance(
      startLocation.lat,
      startLocation.lon,
      endLocation.lat,
      endLocation.lon
    );
    setDistance(distanceBetweenLocations);

    let calculatedPrice = distanceBetweenLocations * 0.029668;
    if (distanceBetweenLocations > 2000 && distanceBetweenLocations < 2700) {
      calculatedPrice -= 20;
    } else if (distanceBetweenLocations > 1500 && distanceBetweenLocations < 2000) {
      calculatedPrice -= 15;
    } else if (distanceBetweenLocations > 1000 && distanceBetweenLocations < 1500) {
      calculatedPrice -= 12;
    }
    setPrice(calculatedPrice);
  };

   // Sample suggestions for Faridpur district
   const allSuggestions = [
    {
      areaName: "bytulaman bazar",
      lat: 23.592971445573284,
      lon: 89.86179262364149,
    },
    {
      areaName: "faridpur engineering college",
      lat: 23.59774950773296,
      lon: 89.85467490388451,
    },
    {
      areaName: "rajendra college road",
      lat: 23.604845924443442,
      lon: 89.8418120421188,
    },
    {
      areaName: "faridpur govt. college",
      lat: 23.597989815876847,
      lon: 89.85341628001842,
    },
    { areaName: "chanmari", lat: 23.59901724459213, lon: 89.8474959646478 },
    { areaName: "janata mor", lat: 23.601918815680836, lon: 89.83334400301604 },
    {
      areaName: "tetul tolar mor",
      lat: 23.605593629772574,
      lon: 89.84781071835934,
    },
    {
      areaName: "bottola(div)",
      lat: 23.601806105407448,
      lon: 89.84679391093692,
    },
    { areaName: "anath mor", lat: 23.598828925953566, lon: 89.83926046217896 },
    {
      areaName: "ramkrishno mission",
      lat: 23.596392926382418,
      lon: 89.83918888148683,
    },
    {
      areaName: "saroda sundari college",
      lat: 23.59862472047795,
      lon: 89.8358307556598,
    },
    {
      areaName: "mujib sarak",
      lat: 23.606975277334364,
      lon: 89.8410111825902,
    },
    {
      areaName: "rainforest ambika road",
      lat: 23.59887356378682,
      lon: 89.83528955851594,
    },
    {
      areaName: "rainforest(2) khan bahadur road",
      lat: 23.59726362420514,
      lon: 89.83951888284086,
    },
  ];


  // Use forwardRef to expose functions or state to the parent component
  useImperativeHandle(ref, () => ({
    getRoadData: () => {
      handleSubmit();
    },
    // ... (you can add more functions or state to expose)
  }));

  return (
    <div className="w-full h-screen flex_center">
      <div className="w-[30%] h-full flex_col_center gap-y-16">
        <div className="relative">
        <input
            type="text"
            placeholder="Start Location"
            className="w-[90%] px-3 py-2 bg-[#dbdbdb] placeholder-gray-400 text-gray-900 rounded-lg border-none focus:ring-0 focus:border-none"
            value={startLocation.areaName}
            onChange={(e) => handleStartLocationChange(e.target.value)}
          />
          {/* Display suggestions for start location in a scrollable div */}
          <div className="suggestion-container">
            {startSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion"
                onClick={() =>
                  handleSuggestionClick(
                    suggestion,
                    setStartLocation,
                    setStartSuggestions
                  )
                }
              >
                {suggestion.areaName}
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="End Location"
            value={endLocation.areaName}
            className="w-[90%] px-3 py-2 bg-[#dbdbdb] placeholder-gray-400 text-gray-900 rounded-lg border-none focus:ring-0 focus:border-none"
            onChange={(e) => handleEndLocationChange(e.target.value)}
          />
          {/* Display suggestions for end location in a scrollable div */}
          <div className="suggestion-container">
            {endSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion"
                onClick={() =>
                  handleSuggestionClick(
                    suggestion,
                    setEndLocation,
                    setEndSuggestions
                  )
                }
              >
                {suggestion.areaName}
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="w-44 h-12 bg-white rounded-md shadow-md shadow-slate-400 text-slate-950"
        >
          Get Road Data
        </button>
      </div>
      </div>
      <div className="w-[70%] h-full overflow-auto">
        <ForwardRefMap ref={ref} center={position} zoom={15}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
         {/* Display user location on the map */}
         <Marker position={[startLocation.lat,startLocation.lon]} icon={userLocationIcon}>
            <Popup>Your Location</Popup>
          </Marker>

          {/* Display rickshaw pullers on the map */}
          {rickshawPullers && rickshawPullers.map((puller) => (
            <Marker
              key={puller.id}
              position={[puller.lat, puller.lon]}
              icon={customIcon}
            >
              <Popup>Rickshaw Puller</Popup>
            </Marker>
          ))}
        </ForwardRefMap>
      </div>
         <div className="w-[30%] h-full flex_col_center gap-y-8">
        <div>
          <p>Distance: {distance.toFixed(2)} meters</p>
        </div>
        <div>
          <p>Price: ${price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
});

export default RoadTrackingSystem;
