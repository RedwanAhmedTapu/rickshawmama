import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = ({ currentLanguage }) => {
  return (
    <footer className="w-full min-h-96 bg-gray-900 text-white py-8 relative flex_center">
      <div className="container w-[90%] mx-auto flex flex-col md:flex-row justify-between items-center gap-x-2">
        <div className="flex flex-col items-center md:items-start gap-y-12 mb-4 md:mb-0">
          <h2 className="text-2xl font-bold mb-2">{currentLanguage === "en" ? "Rickshaw Mama" : "রিকশা মামা"}</h2>
          <p className="text-sm text-center md:text-left">{currentLanguage === "en" ? "Your trusted ride-sharing platform for convenient and affordable transportation." : "সুবিধাজনক এবং অবান্ধক পরিবহনের জন্য আপনার বিশ্বাসযোগ্য রাইড-শেয়ারিং প্ল্যাটফর্ম।"}</p>
        </div>
        <div className="w-full md:w-1/2 flex justify-around items-center gap-x-14">
          <ul className="list-none">
            <li className="mb-2"><a href="#" className="text-sm hover:text-blue-400">{currentLanguage === "en" ? "About Us" : "আমাদের সম্পর্কে"}</a></li>
            <li className="mb-2"><a href="#" className="text-sm hover:text-blue-400">{currentLanguage === "en" ? "Contact Us" : "যোগাযোগ করুন"}</a></li>
            <li className="mb-2"><a href="#" className="text-sm hover:text-blue-400">{currentLanguage === "en" ? "Terms of Service" : "সেবার শর্তাবলী"}</a></li>
            <li className="mb-2"><a href="#" className="text-sm hover:text-blue-400">{currentLanguage === "en" ? "Privacy Policy" : "গোপনীয়তা নীতি"}</a></li>
          </ul>
          <ul className="list-none flex_col_start">
            <li className="mb-2"><a href="#" className="text-sm hover:text-blue-400">{currentLanguage === "en" ? "FAQ" : "প্রায়শই জিজ্ঞাসিত প্রশ্ন"}</a></li>
            <li className="mb-2"><a href="#" className="text-sm hover:text-blue-400">{currentLanguage === "en" ? "Careers" : "ক্যারিয়ার"}</a></li>
            <li className="mb-2"><a href="#" className="text-sm hover:text-blue-400">{currentLanguage === "en" ? "Blog" : "ব্লগ"}</a></li>
          </ul>
        </div>
        <div className="ml-4 w-38 h-44 flex_col_center gap-y-16">
          <div className='flex_col_center gap-y-4'>
            <p className="text-sm">© {new Date().getFullYear()} Rickshaw Mama</p>
            <p className="text-sm">{currentLanguage === "en" ? "All rights reserved" : "সমস্ত অধিকার সংরক্ষিত"}</p>
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
