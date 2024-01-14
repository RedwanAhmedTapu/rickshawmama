import { Route, HashRouter as Router, Routes } from "react-router-dom";


import Nav from "./components/Nav";
import Home from "./components/Home";
import Login from "./components/Login";
import LoginChoice from "./components/Loginchoice";
import RickshamamaLogin from "./components/RickshamamaLogin";
import Signup from "./components/Signup";
import RickshawpullerRegistration from "./components/RickshawpullerRegistration";
import RiderTracker from "./components/RiderTracker";
import RickshawpullerDashboard from "./components/RickshawpullerDashboard";
const App = () => {
  const base="/";
  return (
    <>
     

      <Router basename={base}>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rider-login" element={<Login />} />
          <Route path="/login" element={<LoginChoice />} />
          <Route path="/rickshawmama-login" element={<RickshamamaLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/rickshawpuller-registration" element={<RickshawpullerRegistration />} />
          <Route path="/rickshawpuller-tracking" element={<RiderTracker />} />
          <Route path="/rickshawpuller-dashboard" element={<RickshawpullerDashboard />} />
         
        </Routes>
      </Router>
    </>
  );
};

export default App;
