import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import LocationIcon from "../imgs/location-animated-logo.svg";
import UserLocationIcon from "../imgs/userLocationMarker.png";
import RickhswpullerLocationIcon from "../imgs/rickshawlogin.svg";
import io from "socket.io-client";
import "leaflet/dist/leaflet.css";

const RoadTrackingSystem = ({ currentLanguage }) => {
  const [position, setPosition] = useState([23.6079, 89.8415]);
  const [rickshawPullers, setRickshawPullers] = useState([]);
  // const [selectedRickshawPullerRoute, setSelectedRickshawPullerRoute] =
  //   useState([]);
  const [pullerRoute, setPullerRoute] = useState(false);
  const [isRickshawmama, setRickshawmama] = useState(false);
  const [selectedPullerId, setSelectedPullerId] = useState(null);

  const customIcon = new Icon({
    iconUrl: RickhswpullerLocationIcon,
    iconSize: [100, 100],
  });
  const userLocationIcon = new Icon({
    iconUrl: UserLocationIcon,
    iconSize: [52, 52],
  });
  const rickshawpullerLocationIcon = new Icon({
    iconUrl: LocationIcon,
    iconSize: [100, 100],
  });

  const updateRouteOfRickshawPuller = (pullerId) => {
    setPullerRoute(true);
    setSelectedPullerId(pullerId);
  };
  const serverUrl = process.env.SERVER_URL;

  useEffect(() => {
    const socket = io(serverUrl);

    socket.on("connect", () => {
      console.log("WebSocket connection established");
      // Send notification to pullers
      socket.emit("userVisitedTrackingPage");
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
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        const responseData = await response.json();
        if (responseData.length <= 0) {
          setRickshawmama(true);
        }
        const permittedPullers = responseData.filter(
          (puller) => puller.ispermitted === true
        );
        setRickshawPullers(permittedPullers);
      }
    } catch (error) {
      console.error("Error checking rickshaw pullers:", error);
    }
  };
  // isRickshawmama && alert("no rickshawmama avilable at now");

  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchPositionId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);

          checkRickshawPullers({
            lat: latitude,
            lon: longitude,
          });
        },
        (error) => {
          console.error("Error getting current position:", error);
        },
        {
          enableHighAccuracy: true,
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchPositionId);
      };
    }
  }, []);

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
          rickshawPullers.map((puller, index) => (
            <React.Fragment key={index}>
              <Marker
                position={[
                  puller.location.coordinates[1],
                  puller.location.coordinates[0],
                ]}
                icon={
                  puller.nid === selectedPullerId
                    ? customIcon
                    : rickshawpullerLocationIcon
                }
                onClick={() => {
                  updateRouteOfRickshawPuller(puller.nid);
                }}
              >
                <Popup>
                  <div
                    className="flex flex-col justify-center items-center w-full h-full cursor-pointer"
                    onClick={() => {
                      updateRouteOfRickshawPuller(puller.nid);
                    }}
                  >
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
            </React.Fragment>
          ))}
      </MapContainer>
    ),
    [position, rickshawPullers, selectedPullerId]
  );

  return (
    <>
      <div className="w-full h-screen flex_col_center  relative top-8 gap-y-4 ">
        <div className="w-full h-[10]  flex_center rel text-xl md:text-3xl text-[#4c7ce4] font-bold">
          {currentLanguage === "en"
            ? " Look over your rider on the map"
            : " আপনার রাইডারকে ম্যাপে দেখুন"}
        </div>
        <div className="w-[95%] h-[80%] rounded-lg border-4 border-slate-800 overflow-auto">
          {mapContainer}
        </div>
      </div>
    </>
  );
};

export default RoadTrackingSystem;
