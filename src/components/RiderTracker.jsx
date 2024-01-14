import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { Icon } from "leaflet";
import Location from "../imgs/location.png";
import userLocationMarker from "../imgs/userLocationMarker.png";
import "leaflet/dist/leaflet.css";
import socketIOClient from "socket.io-client";

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
  const [position, setPosition] = useState([23.6079, 89.8415]); // Default center for the map
  const [distance, setDistance] = useState(0); // Distance in meters
  const [price, setPrice] = useState(0); // Calculated price
  const [rickshawPullers, setRickshawPullers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socketId, setSocketId] = useState(null); // State to hold the socket ID
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);

  const customIcon = new Icon({
    iconUrl: Location,
    iconSize: [52, 52],
  });
  const userLocationIcon = new Icon({
    iconUrl: userLocationMarker,
    iconSize: [52, 52],
  });

  const serverUrl = "https://backendofrickshawmama.onrender.com";
  const socket = socketIOClient(serverUrl);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userEmail = searchParams.get("userEmail");

  const checkLocationPermission = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({
        name: "geolocation",
      });

      if (permissionStatus.state === "granted") {
        setLocationPermissionGranted(true);
      } else {
        const permissionResult = await navigator.permissions.request({
          name: "geolocation",
        });

        if (permissionResult.state === "granted") {
          setLocationPermissionGranted(true);
        } else {
          console.error("Geolocation permission denied.");
          // Handle denial of geolocation permission
        }
      }
    } catch (error) {
      console.error("Error checking geolocation permission:", error);
    }
  };

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
        // Update the rickshaw puller locations and routes in the state
        socket.on("rickshawPullerUpdate", (updatedPullers) => {
          setRickshawPullers((prevPullers) =>
            updatedPullers.map((updatedPuller) => {
              const existingPuller = prevPullers.find(
                (puller) => puller.id === updatedPuller.id
              );

              // Update the route by adding the new position
              const updatedRoute = existingPuller
                ? [...existingPuller.route, updatedPuller.location.coordinates]
                : [updatedPuller.location.coordinates];

              return {
                ...updatedPuller,
                route: updatedRoute,
              };
            })
          );
        });
      }
    } catch (error) {
      console.error("Error checking rickshaw pullers:", error);
    }
  };

  useEffect(() => {
    checkLocationPermission();
  }, []);

  useEffect(() => {
    if (locationPermissionGranted) {
      // If location permission is granted, proceed with getting the current position
      socket.on("connect", () => {
        setLoading(false);
      });

      const getCurrentPosition = async () => {
        try {
          const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
            });
          });

          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          setSocketId(socket.id); // Set the socket ID after it is available

          // Call the server to check for rickshaw pullers within 1km radius
          checkRickshawPullers({
            lat: latitude,
            lon: longitude,
            socketId: socket.id, // Use the socket ID obtained from the state
          });
        } catch (error) {
          console.error("Error getting current position:", error);
        }
      };

      // Listen for the 'connect' event to ensure that the socket connection is established
      getCurrentPosition();
      const intervalId = setInterval(getCurrentPosition, 5000);

      return () => {
        // Disconnect from the Socket.io server when the component is unmounted
        socket.disconnect();
        clearInterval(intervalId);
      };
    }
  }, [locationPermissionGranted, socketId, userEmail]);

  const handleInputChange = (input, setLocation, setSuggestions) => {
    setLocation((prevLocation) => ({ ...prevLocation, areaName: input }));

    // Show suggestions only when input length is less than or equal to three
    if (input.length <= 3) {
      // Filter suggestions based on input
      const filteredSuggestions = allSuggestions.filter((suggestion) =>
        suggestion.areaName.toLowerCase().includes(input.toLowerCase())
      );

      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]); // Clear suggestions if input length is more than two
    }
  };

  const handleStartLocationChange = (input) => {
    handleInputChange(input, setStartLocation, setStartSuggestions);
    setEndSuggestions([]); // Clear end location suggestions
  };

  const handleEndLocationChange = (input) => {
    handleInputChange(input, setEndLocation, setEndSuggestions);
    setStartSuggestions([]); // Clear start location suggestions
  };

  const handleSuggestionClick = (suggestion, setLocation, setSuggestions) => {
    setLocation({
      lat: suggestion.lat,
      lon: suggestion.lon,
      areaName: suggestion.areaName,
    });
    setSuggestions([]); // Clear suggestions after selecting one
  };

  const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000; // Distance in meters
    return distance;
  };

  const handleSubmit = () => {
    // Calculate distance between start and end locations
    const distanceBetweenLocations = calculateHaversineDistance(
      startLocation.lat,
      startLocation.lon,
      endLocation.lat,
      endLocation.lon
    );
    setDistance(distanceBetweenLocations);

    // Calculate price based on distance with specific conditions
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

    // Open the modal
    setModalDistance(true);
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
            onClick={() => {
              handleSubmit();
            }}
            className="w-44 h-12 bg-white rounded-md shadow-md shadow-slate-400 text-slate-950"
          >
            Get Road Data
          </button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="w-[70%] h-full overflow-auto">
            <MapContainer
              center={position}
              zoom={15}
              scrollWheelZoom={true}
              className="w-full h-screen"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {/* Display user location on the map */}
              <Marker position={position} icon={userLocationIcon}>
                <Popup>Your Location</Popup>
              </Marker>

              {/* Display rickshaw pullers on the map */}
              {rickshawPullers.length > 0 &&
                rickshawPullers.map((puller) => (
                  <Marker
                    key={puller.id}
                    position={[
                      puller.location.coordinates[1],
                      puller.location.coordinates[0],
                    ]}
                    icon={customIcon}
                  >
                    <Popup>
                      <div className="flex flex-col justify-center items-center w-full h-full">
                        <p className="text-xl text-slate-950">
                          name: {puller.name}
                        </p>
                        <p className="text-xl text-slate-950">
                         phone: {puller.phone}
                        </p>
                        <div className="w-[60%] h-[60%] rounded-full overflow-hidden border">
                          <img
                            src={puller.image}
                            className="w-full h-full object-cover rounded-full"
                            alt={puller.name}
                          />
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              {rickshawPullers.map((puller) => (
    <Polyline
      key={puller.id}
      positions={puller.route} // Assuming 'route' is an array of coordinates
      color="blue"
    />
  ))}
            </MapContainer>
          </div>
        )}
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
