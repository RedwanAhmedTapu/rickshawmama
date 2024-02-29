import React, { useState, useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { Icon } from "leaflet";
import LocationIcon from "../imgs/location.png";
import UserLocationIcon from "../imgs/userLocationMarker.png";
import RickhswpullerLocationIcon from "../imgs/location-animated-logo.svg";
import "leaflet/dist/leaflet.css";

const RoadTrackingSystem = ({ currentLanguage }) => {
  const [position, setPosition] = useState([23.6079, 89.8415]);
  const [rickshawPullers, setRickshawPullers] = useState([]);
  const [selectedRickshawPullerRoute, setSelectedRickshawPullerRoute] =
    useState([]);

  const customIcon = new Icon({
    iconUrl: LocationIcon,
    iconSize: [52, 52],
  });
  const userLocationIcon = new Icon({
    iconUrl: UserLocationIcon,
    iconSize: [52, 52],
  });
  const rickshawpullerLocationIcon = new Icon({
    iconUrl: RickhswpullerLocationIcon,
    iconSize: [100, 100],
  });

  // const serverUrl = "http://localhost:5001";
  const serverUrl = process.env.SERVER_URL;

  const updateRouteOfRickshawPuller = (pullerId) => {
    const updatedRoute = rickshawPullers
      .map((puller) => {
        if (puller && puller.nid === pullerId && puller.location) {
          console.log(puller);
          const route = puller.route;
          console.log(puller.route);
          setSelectedRickshawPullerRoute(puller.route);

          return route;
        }
        return null;
      })
      .filter(Boolean);
  };
  selectedRickshawPullerRoute.map((route, index) => {
    console.log(`Route ${index + 1}:`, route);
  });

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
        const responseData = await response.json();
        setRickshawPullers(responseData);
      }
    } catch (error) {
      console.error("Error checking rickshaw pullers:", error);
    }
  };

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
                icon={rickshawpullerLocationIcon}
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

             {/* {selectedRickshawPullerRoute && selectedRickshawPullerRoute.map((route, index) => (
    <Polyline
        positions={[
            position,
            [route.coordinates[0], route.coordinates[1]],
        ]}
        key={index}
        color="blue"
    />
))} */}


              <Polyline
                positions={
                  selectedRickshawPullerRoute &&
                  selectedRickshawPullerRoute.map((point) => [
                   
                    point.coordinates[0],
                    point.coordinates[1],
                  ])
                }
                color="blue"
              />
            </React.Fragment>
          ))}
      </MapContainer>
    ),
    [position, rickshawPullers, selectedRickshawPullerRoute]
  );

  return (
    <>
      <div className="w-full h-screen flex_col_center  relative top-8 gap-y-4 ">
        <div className="w-full h-[10]  flex_center rel text-xl md:text-3xl text-[#4c7ce4] font-extralight">
          {currentLanguage === "en"
            ? " Look over your rider on the map"
            : " আপনার রাইডারকে ম্যাপে দেখুন"}
        </div>
        <div className="w-[95%] h-[80%] rounded-lg border-4 border-slate-800 overflow-auto">{mapContainer}</div>
      </div>
    </>
  );
};

export default RoadTrackingSystem;
