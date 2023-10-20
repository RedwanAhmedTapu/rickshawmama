import { Route, BrowserRouter as Router, Routes } from "react-router-dom";


import Nav from "./components/nav";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
const App = () => {
  return (
    <>
     

      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
         
        </Routes>
      </Router>
    </>
  );
};

export default App;
