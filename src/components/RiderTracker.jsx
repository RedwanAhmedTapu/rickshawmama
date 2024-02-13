import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { Icon } from "leaflet";
import LocationIcon from "../imgs/location.png";
import UserLocationIcon from "../imgs/userLocationMarker.png";
import "leaflet/dist/leaflet.css";
import socketIOClient from "socket.io-client";

const RoadTrackingSystem = () => {
  const [position, setPosition] = useState([23.6079, 89.8415]); // Default center for the map
  const [rickshawPullers, setRickshawPullers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socketId, setSocketId] = useState(null); // State to hold the socket ID
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);

  const customIcon = new Icon({
    iconUrl: LocationIcon,
    iconSize: [52, 52],
  });
  const userLocationIcon = new Icon({
    iconUrl: UserLocationIcon,
    iconSize: [52, 52],
  });
  const serverUrl='https://backendofrickshawmama.onrender.com';

  // const serverUrl = 'http://localhost:5001';
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
        const permissionResult = await navigator.geolocation.request({
          name: "geolocation",
        });

        if (permissionResult.state === "granted") {
          setLocationPermissionGranted(true);
        } else {
          console.error("Geolocation permission denied.");
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
        socket.on("rickshawPullerUpdate", (updatedPullers) => {
          setRickshawPullers(updatedPullers);
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
          setSocketId(socket.id);

          checkRickshawPullers({
            lat: latitude,
            lon: longitude,
            socketId: socket.id,
          });
        } catch (error) {
          console.error("Error getting current position:", error);
        }
      };

      getCurrentPosition();
      const intervalId = setInterval(getCurrentPosition, 1000);

      return () => {
        socket.disconnect();
        clearInterval(intervalId);
      };
    }
  }, [locationPermissionGranted, socketId, userEmail]);

  const mapContainer = useMemo(
    () => (
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={true}
        className="w-full h-screen"
        style={{ zIndex: 1 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Marker position={position} icon={userLocationIcon}>
          <Popup>Your Location</Popup>
        </Marker>

        {rickshawPullers.length > 0 &&
          rickshawPullers.map((puller) => (
            <React.Fragment key={puller.id}>
              <Marker
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

              <Polyline
                positions={[
                  [position[0], position[1]],
                  [
                    puller.location.coordinates[1],
                    puller.location.coordinates[0],
                  ],
                ]}
                color="blue"
              />
            </React.Fragment>
          ))}
      </MapContainer>
    ),
    [position, rickshawPullers,userEmail]
  );

  return (
    <>
      <div className="w-full h-screen flex_col_center relative top-24 gap-y-4">
        <div className="w-full h-10 flex_center rel text-3xl text-slate-100 font-extralight">
          Look over your rider on the map
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="w-[90%] h-[80%] overflow-auto">{mapContainer}</div>
        )}
      </div>
    </>
  );
};

export default RoadTrackingSystem;
