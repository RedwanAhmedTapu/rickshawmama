import { useState } from 'react';
import axios from 'axios';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [showModal, setShowModal] = useState(false);

  const server = process.env.SERVER_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send form data to the server
      await axios.post(`${server}/contact`, formData);

      // Reset form data
      setFormData({
        name: '',
        email: '',
        message: ''
      });

      // Show success modal
      setShowModal(true);
    } catch (error) {
      console.error('Error submitting form data:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-white max-w-md w-full rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-center mb-4">Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" required />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" required />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700 font-medium mb-1">Message</label>
            <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows="4" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" required></textarea>
          </div>
          <div className="text-center">
            <button type="submit" className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">Submit</button>
          </div>
        </form>
      </div>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-semibold mb-4">Success!</h2>
            <p className="text-gray-700">Your message has been sent successfully.</p>
            <button onClick={closeModal} className="mt-4 bg-blue-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactPage;
