import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="w-full min-h-96 bg-gray-900 text-white py-8 relative   flex_center">
      <div className="container w-[90%] mx-auto flex flex-col md:flex-row justify-between items-center gap-x-2">
        <div className="flex flex-col items-center md:items-start gap-y-12 mb-4 md:mb-0">
          <h2 className="text-2xl font-bold mb-2">Rickshaw Mama</h2>
          <p className="text-sm text-center md:text-left">Your trusted ride-sharing platform for convenient and affordable transportation.</p>
        </div>
        <div className="w-full md:w-1/2 flex justify-around items-center gap-x-14">
          <ul className="list-none">
            <li className="mb-2"><a href="#" className="text-sm hover:text-blue-400">About Us</a></li>
            <li className="mb-2"><a href="#" className="text-sm hover:text-blue-400">Contact Us</a></li>
            <li className="mb-2"><a href="#" className="text-sm hover:text-blue-400">Terms of Service</a></li>
            <li className="mb-2"><a href="#" className="text-sm hover:text-blue-400">Privacy Policy</a></li>
          </ul>
          <ul className="list-none flex_col_start">
            <li className="mb-2"><a href="#" className="text-sm hover:text-blue-400">FAQ</a></li>
            <li className="mb-2"><a href="#" className="text-sm hover:text-blue-400">Careers</a></li>
            <li className="mb-2"><a href="#" className="text-sm hover:text-blue-400">Blog</a></li>
          </ul>
        </div>
        <div className="ml-4 w-38  h-44  flex_col_center gap-y-16">
       <div className='flex_col_center gap-y-4'>
       <p className="text-sm">© {new Date().getFullYear()} Rickshaw Mama</p>
        <p className="text-sm">All rights reserved</p>
       </div>

          <div className="flex gap-x-4 text-2xl">
            <a href="#" className="text-white hover:text-blue-400"><FaFacebook /></a>
            <a href="#" className="text-white hover:text-blue-400"><FaTwitter /></a>
            <a href="#" className="text-white hover:text-blue-400"><FaInstagram /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
