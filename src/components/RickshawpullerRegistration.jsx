import { useState, useEffect } from 'react';
import axios from 'axios';

const RickshawpullerRegistration = () => {
  const [formData, setFormData] = useState({
    image: null,
    nidImage: null,
    name: '',
    nid: '',
    phone: '',
    password: '', // Add the password field
    location: {
      type: 'Point',
      coordinates: [0, 0],
    },
  });

  const [userLocation, setUserLocation] = useState({
    lat: 'Loading...',
    lon: 'Loading...',
  });
  const serverUrl = "https://backendofrickshawmama.onrender.com";


  useEffect(() => {
    const watchUserLocation = async () => {
      try {
        const watchId = navigator.geolocation.watchPosition(
          (pos) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              location: {
                type: 'Point',
                coordinates: [pos.coords.latitude, pos.coords.longitude],
              },
            }));

            setUserLocation({
              lat: pos.coords.latitude,
              lon: pos.coords.longitude,
            });
          },
          (err) => {
            console.error('Error watching user location:', err);
          },
          { enableHighAccuracy: true }
        );

        return () => {
          navigator.geolocation.clearWatch(watchId);
        };
      } catch (error) {
        console.error('Error getting user location:', error);
      }
    };

    watchUserLocation();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'image' || e.target.name === 'nidImage') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [e.target.name]: e.target.files[0],
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleImageUpload = async (file, endpoint) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await axios.post(`${serverUrl}/${endpoint}`, formData);

      return response.data.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const faceImageUrl = await handleImageUpload(formData.image, '/upload-Face-Image');
      const nidImageUrl = await handleImageUpload(formData.nidImage, '/upload-Nid-Image');

      const formDataWithLocation = {
        ...formData,
        location: {
          type: 'Point',
          coordinates: [parseFloat(userLocation.lat), parseFloat(userLocation.lon)],
        },
        image: faceImageUrl,
        nidImage: nidImageUrl,
      };

      // Make an HTTP POST request to your backend endpoint
      const response = await axios.post(`${serverUrl}/rickshawpuller/registration`, formDataWithLocation);

      // Handle the response as needed (e.g., show a success message)
      console.log('Registration successful', response.data);
    } catch (error) {
      // Handle errors (e.g., show an error message)
      console.error('Error registering Rickshawpuller', error);
    }
  };

  return (
    <div className='w-full h-full flex_start absolute top-24'>
      <div className="container mx-auto mt-8 h-44  max-[500px]:p-4">
        <form onSubmit={handleSubmit} className="max-w-lg max-h-[30rem] mx-auto  overflow-auto scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent bg-white p-8 border rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Rickshawpuller Registration</h2>
          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-700 font-medium">
              Regular Image:
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
            <label htmlFor="nidImage" className="block text-gray-700 font-medium">
              National ID Image:
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
              Name:
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
              National ID:
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
              Phone:
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
            <label htmlFor="password" className="block text-gray-700 font-medium">
              Password:
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
          <p className="text-gray-600">
            Latitude: {userLocation.lat} | Longitude: {userLocation.lon}
          </p>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Register Rickshawpuller
          </button>
        </form>
      </div>
    </div>
  );
};

export default RickshawpullerRegistration;
