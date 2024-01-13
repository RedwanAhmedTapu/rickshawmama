import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import socketIOClient from "socket.io-client";

import userLocationMarker from "../imgs/userLocationMarker.png";
// import rickshawPullerIcon from "../imgs/rickshawPullerIcon.png"; // Adjust the path based on your project structure

const RoadTrackingSystem = () => {
  const [modalDistance, setModalDistance] = useState(false);
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
  const [position, setPosition] = useState([89.8415, 23.6079]); // Default center for the map
  const [distance, setDistance] = useState(0); // Distance in meters
  const [price, setPrice] = useState(0); // Calculated price
  const [rickshawPullers, setRickshawPullers] = useState([]);
  const serverUrl = "http://localhost:5001";
  const socket = socketIOClient(serverUrl);
  const mapContainerRef = React.useRef(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userEmail = searchParams.get("userEmail");
  console.log(userEmail);

  mapboxgl.accessToken =
    "pk.eyJ1IjoicmVkd2FuMTIiLCJhIjoiY2xyNjRsMXZxMjFkZjJxbjg2Y3p4Y3ZndCJ9.9rxprb8OkkAO0f6ux3Dd2A";
   

  useEffect(() => {
    const mapContainer = mapContainerRef.current;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: position,
      zoom: 15,
    });

    if (!mapContainer) {
      return;
    }

    const getCurrentPosition = async () => {
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
          });
        });

        const { latitude, longitude } = pos.coords;
        setPosition([longitude, latitude]);

        // Add user marker to the map
        new mapboxgl.Marker({ color: "blue" })
          .setLngLat([longitude, latitude])
          .addTo(map);

        // Check for rickshaw pullers
        checkRickshawPullers({
          lat: latitude,
          lon: longitude,
          socketId: socket.id,
        });
      } catch (error) {
        console.error("Error getting current position:", error);
      }
    };

    socket.on("connect", () => {
      getCurrentPosition();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const checkRickshawPullers = async (location) => {
    try {
      const response = await fetch(`${serverUrl}/getNearbyRickshawPullers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lat: location.lat,
          lon: location.lon,
          socketId: location.socketId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        socket.on("rickshawPullerUpdate", (updatedPullers) => {
          setRickshawPullers(updatedPullers);

          // Remove previous markers
          map.removeLayer("rickshawPullers");
          map.removeSource("rickshawPullers");

          // Create a GeoJSON feature collection for rickshaw pullers
          const geojson = {
            type: "FeatureCollection",
            features: updatedPullers.map((puller) => ({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [
                  puller.location.coordinates[1],
                  puller.location.coordinates[0],
                ],
              },
              properties: {
                title: "Rickshaw Puller",
              },
            })),
          };

          // Add a source and layer for rickshaw pullers
          map.addSource("rickshawPullers", {
            type: "geojson",
            data: geojson,
          });

          map.addLayer({
            id: "rickshawPullers",
            type: "symbol",
            source: "rickshawPullers",
            layout: {
              "icon-image": "rickshaw-puller-icon",
              "icon-allow-overlap": true,
            },
          });

          // Add rickshaw puller icon to the map
          map.loadImage(userLocationMarker, (error, image) => {
            if (error) throw error;
            map.addImage("rickshaw-puller-icon", image);
          });
        });
      }
    } catch (error) {
      console.error("Error checking rickshaw pullers:", error);
    }
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
    } else if (
      distanceBetweenLocations > 1500 &&
      distanceBetweenLocations < 2000
    ) {
      calculatedPrice -= 15;
    } else if (
      distanceBetweenLocations > 1000 &&
      distanceBetweenLocations < 1500
    ) {
      calculatedPrice -= 12;
    }
    setPrice(calculatedPrice);

    setModalDistance(true);
  };

  const allSuggestions = [
    // Sample suggestions for Faridpur district
  ];

  return (
    <>
      <div className="w-full h-screen flex_center relative top-24">
        <div className="w-[30%] h-full flex_col_center gap-y-16">
          <div className="relative">
            <input
              type="text"
              placeholder="Start Location"
              className="w-[90%] px-3 py-2 bg-[#dbdbdb] placeholder-gray-400 text-gray-900 rounded-lg border-none focus:ring-0 focus:border-none"
              value={startLocation.areaName}
              onChange={(e) => handleStartLocationChange(e.target.value)}
            />
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
            onClick={() => {
              handleSubmit();
            }}
            className="w-44 h-12 bg-white rounded-md shadow-md shadow-slate-400 text-slate-950"
          >
            Get Road Data
          </button>
        </div>
        <div className="w-[70%] h-full">
          <div
            ref={mapContainerRef}
            className="w-full h-screen"
            style={{ border: "1px solid #ddd", borderRadius: "8px" }}
          ></div>
        </div>
      </div>
      {modalDistance && (
        <div className="w-full h-full flex_center absolute bottom-52 z-50">
          <div className="w-1/3 h-44 flex flex-col items-center justify-center gap-y-8 bg-gray-200 p-6 rounded-md shadow-md">
            <div>
              <p className="text-lg font-semibold">
                Distance: {distance.toFixed(2)} meters
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold">
                Price: ৳{price.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RoadTrackingSystem;
