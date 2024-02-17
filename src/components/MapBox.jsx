import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import socketIOClient from "socket.io-client";
import userLocationMarker from "../imgs/userLocationMarker.png";

const RoadTrackingSystem = () => {
  const [position, setPosition] = useState([89.8415, 23.6079]); // Default center for the map
  const [rickshawPullers, setRickshawPullers] = useState([]);
  const serverUrl = "http://localhost:5001";
  const socket = socketIOClient(serverUrl);
  const mapContainerRef = React.useRef(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userEmail = searchParams.get("userEmail");

  mapboxgl.accessToken =
    "pk.eyJ1IjoicmVkd2FuMTIiLCJhIjoiY2xyNjRsMXZxMjFkZjJxbjg2Y3p4Y3ZndCJ9.9rxprb8OkkAO0f6ux3Dd2A";

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: position,
      zoom: 15,
    });

    // Add user marker to the map
    new mapboxgl.Marker({ color: "blue" })
      .setLngLat(position)
      .addTo(map);

    socket.on("connect", () => {
      getCurrentPosition();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getCurrentPosition = async () => {
    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
        });
      });

      const { latitude, longitude } = pos.coords;
      setPosition([longitude, latitude]);

      // Remove previous markers
      map.removeLayer("rickshawPullers");
      map.removeSource("rickshawPullers");

      // Create a GeoJSON feature collection for rickshaw pullers
      const geojson = {
        type: "FeatureCollection",
        features: rickshawPullers.map((puller) => ({
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
    } catch (error) {
      console.error("Error getting current position:", error);
    }
  };

  return (
    <div className="w-full h-screen flex_center relative top-24">
      <div className="w-[70%] h-[50%]">
        <div
          ref={mapContainerRef}
          className="w-full h-screen"
          style={{ border: "1px solid #ddd", borderRadius: "8px" }}
        ></div>
      </div>
    </div>
  );
};

export default RoadTrackingSystem;
