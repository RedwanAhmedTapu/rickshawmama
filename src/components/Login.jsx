import WhiteRickshaw from "../imgs/whiteRickshaw.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import axios from "axios";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { email, password } = user;
      console.log(email, password);
      if (email.trim() === "" || password.trim() === "") {
        alert("please fill all the data");
      } else {
         await axios
          .post("http://localhost:5000/user/login", user)
          .then((res) => {
            console.log(res.data);

            if (res.data.message === "not any user") {
              alert("wrong password and email");
            } else {
              if (res.data.token) {
                console.log(res.data.token);
                axios.defaults.headers.common[
                  "Authorization"
                ] = ` ${res.data.token}`;
                // setToken(true);

                const { email, fname, isLoggedin, isVerified, lname } =
                  res.data.user;
                console.log({ email, fname, isLoggedin, isVerified, lname });
                localStorage.setItem(
                  "loggedUser",
                  JSON.stringify({
                    email,
                    fname,
                    isLoggedin,
                    isVerified,
                    lname,
                  })
                );

                if (email === "admin@gmail.com") {
                  navigate("/adminDashboard");
                } else {
                  navigate(`/select-level?userEmail=${email}`);
                }
              } else {
                delete axios.defaults.headers.common["Authorization"];
              }
            }
          })
          .catch((error) => {
            if (error.response) {
              // The server responded with a status code outside of the 2xx range
              console.error(
                "Server responded with an error:",
                error.response.status,
                error.response.data
              );
            } else if (error.request) {
              // The request was made, but no response was received
              console.error("No response received from the server");
            } else {
              // Something happened in setting up the request
              console.error(
                "An error occurred while sending the request:",
                error.message
              );
            }
          });
      }
    } catch (error) {
      console.error("Failed to login :", error);
    }
  };
  // for google signin
  const handleVerificationAuth = async (otpData, userEmail) => {
    console.log("codecamp", `${userEmail + otpData}`);
    try {
      const res = await fetch(
        "http://localhost:5000/auth/googleAuth-verfication",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userEmail, otpData }),
        }
      );

      const data = await res.json();
      console.log(data);

      if (data.message === "Email verified successfully") {
        navigate(`/?userEmail=${userEmail}`);
      } else if (data.message === "Invalid verification code") {
        navigate(`/?userEmail=${userEmail}`);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during email verification:", error);
    }
  };

  const handleAuthuser = async (userData) => {
    try {
      const res = await fetch(
        "http://localhost:5000/auth/registration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await res.json();
      console.log(data);
      if (data) {
        await handleVerificationAuth(data.message, userData.email);
      }
    } catch (error) {
      console.error("Error during user registration:", error);
    }
  };
  return (
    <div className="w-full h-screen text-white flex_center">
      <div className="flex_center w-[50%] h-full ">
        <img src={WhiteRickshaw} className="w-[80%] h-[80%] object-cover" />
      </div>
      <div className="flex_center w-[50%] h-full ">
        <div className="loginrightDiv w-72 h-96 flex_col_around bg-slate-100 relative rounded-lg shadow-2xl shadow-slate-300 ">
          <div className="w-full h-12 text-start text-4xl text-[#3C1263] font-extrabold pl-4 ">
            sign in
          </div>
          <input
            type="email"
            name="email"
            id="email"
            value={user && user.email}
            onChange={handleChange}
            className="w-[90%] px-3 py-2 bg-[#dbdbdb] placeholder-gray-400 text-gray-900 rounded-lg border-none focus:ring-0 focus:border-none"
            placeholder="Enter Email..."
          />
          <input
            type="password"
            name="password"
            id="password"
            value={user && user.password}
            onChange={handleChange}
            className="w-[90%] px-3 py-2 bg-[#dbdbdb] placeholder-gray-400 text-gray-900 rounded-lg border-none focus:ring-0 focus:border-none"
            placeholder="Enter password..."
          />
          <div className="w-[90%] h-8 flex_center rounded-lg text-gray-400 bg-[#dbdbdb]">
            {" "}
            <GoogleOAuthProvider clientId="937173192475-srjkndb4hln721ut5f40m08d3u6e0tq2.apps.googleusercontent.com">
              <div className="w-full h-full flex_center bg-white rounded-lg">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    console.log(credentialResponse);
                    var decoded = jwt_decode(credentialResponse.credential);

                    console.log(decoded);
                    const { family_name, given_name, email } = decoded;
                    const fname = family_name;
                    const lname = given_name;

                    handleAuthuser({ fname, lname, email });
                    localStorage.setItem(
                      "loggedUser",
                      JSON.stringify({ email, fname, lname })
                    );
                  }}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                  logo_alignment="center"
                  text="continue_with"
                  type="standard"
                  className="w-full h-full"
                  useOneTap="true"
                  select_account
                />
              </div>
            </GoogleOAuthProvider>
          </div>
          <div className="w-[60%] h-8 flex_center text-gray-50 font-medium bg-[#3e3eea] rounded-lg " onClick={handleSubmit}>
           
            sign in
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
