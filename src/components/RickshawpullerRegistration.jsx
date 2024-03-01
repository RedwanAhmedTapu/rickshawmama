import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Tesseract from "tesseract.js";

const RickshawpullerRegistration = ({currentLanguage}) => {
  const [formData, setFormData] = useState({
    image: null,
    nidImage: null,
    name: "",
    nid: "",
    phone: "",
    password: "",
    location: {
      type: "Point",
      coordinates: [0, 0],
    },
  });

  const [userLocation, setUserLocation] = useState({
    lat: "Loading...",
    lon: "Loading...",
  });

  const [ocrProgress, setOcrProgress] = useState(0);
  const [isOcrComplete, setIsOcrComplete] = useState(false);

  const server = process.env.SERVER_URL;
  // const server = "http://localhost:5001";
  const navigate = useNavigate();

  useEffect(() => {
    const watchUserLocation = async () => {
      try {
        const watchId = navigator.geolocation.watchPosition(
          (pos) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              location: {
                type: "Point",
                coordinates: [pos.coords.latitude, pos.coords.longitude],
              },
            }));

            setUserLocation({
              lat: pos.coords.latitude,
              lon: pos.coords.longitude,
            });
          },
          (err) => {
            console.error("Error watching user location:", err);
          },
          { enableHighAccuracy: true }
        );

        return () => {
          navigator.geolocation.clearWatch(watchId);
        };
      } catch (error) {
        console.error("Error getting user location:", error);
      }
    };

    watchUserLocation();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "image" || e.target.name === "nidImage") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [e.target.name]: e.target.files[0],
      }));

      // For the image file, perform OCR to extract text
      if (e.target.name === "nidImage") {
        extractTextFromImage(e.target.files[0]);
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const extractTextFromImage = async (imageFile) => {
    try {
      const result = await Tesseract.recognize(imageFile, "eng+ben", {
        logger: (info) => {
          console.log(info); // Log additional details for debugging
  
          if (info.status === "recognizing text") {
            setOcrProgress(info.progress);
          } else if (info.status === "done") {
            setOcrProgress(100);
          }
        },
      });
  
      console.log(result.data.text); // Output the full recognized text for debugging
  
      const text = result.data.text;
  
      // Match the name and ID number using regular expressions
      const nameMatch = text.match(/Name:\s*([^\n]+)/);
      const idMatch = text.match(/Ip No:\s*(\d+)/);
    

  
      console.log(nameMatch);
      console.log(idMatch);
  
      if (nameMatch && idMatch) {
        const name = nameMatch[1].trim();
        const id = idMatch[1].trim();
  
        // Now you can use the extracted name and ID number as needed
        console.log("Name:", name);
        console.log("ID Number:", id);
        setFormData((prev) => ({
          ...prev,
          nid: id,
          name: name
      }));
      
        // Perform further actions with the extracted data if required
      } else {
        console.error("Failed to extract name or ID number from text:", text);
      }
    } catch (error) {
      console.error("Error extracting text from image:", error);
    }
  };
  

  const handleImageUpload = async (file, endpoint) => {
    try {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await axios.post(`${server}${endpoint}`, formData);
      console.log(response.data.imageUrl)

      return response.data.imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const faceImageUrl = await handleImageUpload(
        formData.image,
        "/upload-Face-Image"
      );
      const nidImageUrl = await handleImageUpload(
        formData.nidImage,
        "/upload-Nid-Image"
      );

      const formDataWithLocation = {
        ...formData,
        location: {
          type: "Point",
          coordinates: [
            parseFloat(userLocation.lat),
            parseFloat(userLocation.lon),
          ],
        },
        image: faceImageUrl,
        nidImage: nidImageUrl,
      };

      // Make an HTTP POST request to your backend endpoint
      const response = await axios.post(
        `${server}/rickshawpuller/registration`,
        formDataWithLocation
      );

      // Handle the response as needed (e.g., show a success message)
      navigate("/rickshawmama-login");
      console.log("Registration successful", response.data);
    } catch (error) {
      // Handle errors (e.g., show an error message)
      console.error("Error registering Rickshawpuller", error);
    }
  };

  return (
    <div className="w-full min-h-screen flex_center relative ">
      <div className="container mx-auto mt-8 h-full max-[500px]:p-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-lg max-h-[30rem] bg-white mx-auto overflow-auto scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent  p-8 border rounded-md shadow-md"
        >
          <h2 className="text-2xl font-semibold mb-4">
          {currentLanguage === "en" ? "Rickshawmam Registration" : "রিকশামামা নিবন্ধন "}
          </h2>
          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-700 font-medium">
            {currentLanguage === "en" ? "Your Image" : " তোমার ছবি "}

            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={(e) => handleChange(e)}
              className="w-full mt-2 p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="nidImage"
              className="block text-gray-700 font-medium"
            >
                         {currentLanguage === "en" ? "Your NID Image" : " তোমার এনআইডি  ছবি "}

            </label>
            <input
              type="file"
              id="nidImage"
              name="nidImage"
              onChange={(e) => handleChange(e)}
              className="w-full mt-2 p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium">
            {currentLanguage === "en" ? "Name" : " নাম"}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => handleChange(e)}
              className="w-full mt-2 p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="nid" className="block text-gray-700 font-medium">
            {currentLanguage === "en" ? "National NID" : " জাতীয় পরিচয়পত্র"}

            </label>
            <input
              type="text"
              id="nid"
              name="nid"
              value={formData.nid}
              onChange={(e) => handleChange(e)}
              className="w-full mt-2 p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700 font-medium">
            {currentLanguage === "en" ? "phone" : " ফোন"}

            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={(e) => handleChange(e)}
              className="w-full mt-2 p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium"
            >
                         {currentLanguage === "en" ? "password" : "পাসওয়ার্ড"}

            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={(e) => handleChange(e)}
              className="w-full mt-2 p-2 border rounded-md"
              required
            />
          </div>
          {isOcrComplete && (
            <div className="mb-4">
              <p className="text-green-600">
                Text extraction from NID image is complete!
              </p>
            </div>
          )}
          <p className="text-gray-600">
            Latitude: {userLocation.lat} | Longitude: {userLocation.lon}
          </p>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300"
          >
                              {currentLanguage === "en" ? "sign up" : " নিবন্ধন করুন"}

          </button>
        </form>
      </div>
    </div>
  );
};

export default RickshawpullerRegistration;
