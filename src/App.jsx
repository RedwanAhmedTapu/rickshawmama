import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { useState,useEffect } from "react";

import Nav from "./components/Nav";
import Home from "./components/Home";
import Login from "./components/Login";
import LoginChoice from "./components/Loginchoice";
import RickshamamaLogin from "./components/RickshamamaLogin";
import Signup from "./components/Signup";
import ContactPage from "./components/ContactPage";
import RickshawpullerRegistration from "./components/RickshawpullerRegistration";
import RiderTracker from "./components/RiderTracker";
import RickshawpullerDashboard from "./components/RickshawpullerDashboard";
import Footer from "./components/Footer";

const App = () => {
  const base="/";
  const [currentLanguage, setCurrentLanguage] = useState(localStorage.getItem("lang"));
console.log(currentLanguage)

useEffect(() => {
  const language = navigator.language;
  // setUserLanguage(language);
}, []); 
  const switchLanguage = () => {
    const lang = localStorage.getItem("lang");
     console.log(lang)
    
    if (lang === "en") {
      localStorage.setItem("lang", "bn");
      setCurrentLanguage("bn");
    } else {
      localStorage.setItem("lang", "en");
      setCurrentLanguage("en");
    }
  };
  
  return (
    <>
      <Router basename={base}>
        <Nav currentLanguage={currentLanguage} switchLanguage={switchLanguage} />
        <Routes>
          <Route path="/" element={<Home currentLanguage={currentLanguage} />} />
          <Route path="/rider-login" element={<Login currentLanguage={currentLanguage} />} />
          <Route path="/login" element={<LoginChoice currentLanguage={currentLanguage} />} />
          <Route path="/rickshawmama-login" element={<RickshamamaLogin currentLanguage={currentLanguage} />} />
          <Route path="/signup" element={<Signup currentLanguage={currentLanguage} />} />
          <Route path="/contact" element={<ContactPage currentLanguage={currentLanguage} />} />
          <Route path="/rickshawpuller-registration" element={<RickshawpullerRegistration currentLanguage={currentLanguage} />} />
          <Route path="/rickshawpuller-tracking" element={<RiderTracker currentLanguage={currentLanguage} />} />
          <Route path="/rickshawpuller-dashboard" element={<RickshawpullerDashboard currentLanguage={currentLanguage} />} />
        </Routes>
        <Footer currentLanguage={currentLanguage}/>
      </Router>
    </>
  );
};

export default App;
