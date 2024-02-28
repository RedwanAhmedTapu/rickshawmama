import WhiteRickshaw from "../imgs/rickshawlogin.svg";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { GoogleOAuthProvider } from "@react-oauth/google";
// import { GoogleLogin } from "@react-oauth/google";
// import jwt_decode from "jwt-decode";
import axios from "axios";

const RickshamamaLogin = ({currentLanguage}) => {
  const [user, setUser] = useState({
    nid: "",
    password: "",
  });


  // const clientID="993913645019-gjbsgomsu7sgo0bv7rkas1d9irgp2upv.apps.googleusercontent.com";//for vercel
  // const clientID="937173192475-srjkndb4hln721ut5f40m08d3u6e0tq2.apps.googleusercontent.com";//for localhost
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const server=process.env.SERVER_URL;
  
  // const server='http://localhost:5001';
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { nid, password } = user;

      if (nid.trim() === "" || password.trim() === "") {
        alert("Please fill in all the data");
      } else {
        await axios
          .post(`${server}/user/rickshawpullerlogin`, user)
          .then((res) => {
            console.log(res.data);

            if (res.data.message === "not any user") {
              alert("Wrong password and National ID");
            } else {
              if (res.data.token) {
                console.log(res.data.token);
                axios.defaults.headers.common[
                  "Authorization"
                ] = ` ${res.data.token}`;

                const { nid, fname, isLoggedin, isVerified, lname } =
                  res.data.user;
                console.log({ nid, fname, isLoggedin, isVerified, lname });
                localStorage.setItem(
                  "loggedUser",
                  JSON.stringify({
                    nid,
                    fname,
                    isLoggedin,
                    isVerified,
                    lname,
                  })
                );

                if (nid === "admin") {
                  navigate("/adminDashboard");
                } else {
                  navigate(`/rickshawpuller-dashboard?userNid=${nid}`);
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
      console.error("Failed to login:", error);
    }
  };

  // const handleVerificationAuth = async (otpData, userNid) => {
  //   try {
  //     const res = await fetch(
  //       `${server}/auth/googleAuth-verfication`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ userNid, otpData }),
  //       }
  //     );

  //     const data = await res.json();
  //     console.log(data);

  //     if (data.message === "Email verified successfully") {
  //       navigate(`/?userNid=${userNid}`);
  //     } else if (data.message === "Invalid verification code") {
  //       navigate(`/?userNid=${userNid}`);
  //     } else {
  //       navigate("/login");
  //     }
  //   } catch (error) {
  //     console.error("Error during email verification:", error);
  //   }
  // };

  // const handleAuthUser = async (userData) => {
  //   try {
  //     const res = await fetch(
  //       `${server}/auth/registration`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(userData),
  //       }
  //     );

  //     const data = await res.json();
  //     console.log(data);
  //     if (data) {
  //       await handleVerificationAuth(data.message, userData.nid);
  //     }
  //   } catch (error) {
  //     console.error("Error during user registration:", error);
  //   }
  // };

  return (
    <div className="w-full h-screen text-white max-[800px]:flex_col_center flex_center">
      <div className="flex_center max-[650px]:w-full w-[50%] h-full ">
        <img src={WhiteRickshaw} className="w-[100%] h-[100%]  " />
      </div>
      <div className="flex_center max-[650px]:w-full w-[50%] h-full ">
        <div className="loginrightDiv w-72 h-96 flex_col_around bg-slate-100 relative rounded-lg shadow-2xl shadow-slate-300 ">
          <div className="w-full h-12 text-start text-4xl text-[#3C1263] font-extrabold pl-4 ">
          {currentLanguage === "en" ? "sign in" : "সাইন ইন "}

          </div>
          <input
            type="text"
            name="nid"
            id="nid"
            value={user && user.nid}
            onChange={handleChange}
            className="w-[90%] px-3 py-2 bg-[#dbdbdb] placeholder-gray-400 text-gray-900 rounded-lg border-none focus:ring-0 focus:border-none"
            placeholder= {currentLanguage === "en" ? "Enter National NID No" : "জাতীয় এনআইডি নম্বর দিন "}
          />
          <input
            type="password"
            name="password"
            id="password"
            value={user && user.password}
            onChange={handleChange}
            className="w-[90%] px-3 py-2 bg-[#dbdbdb] placeholder-gray-400 text-gray-900 rounded-lg border-none focus:ring-0 focus:border-none"
            placeholder= {currentLanguage === "en" ? "enter password..." : "পাসওয়ার্ড দিন "}
          />
          {/* <div className="w-[90%] h-8 flex_center rounded-lg text-gray-400 bg-[#dbdbdb]">
          <GoogleOAuthProvider clientId={clientID}>

              <div className="w-full h-full flex_center bg-white rounded-lg">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    console.log(credentialResponse);
                    var decoded = jwt_decode(credentialResponse.credential);

                    console.log(decoded);
                    const { family_name, given_name, email } = decoded;
                    const fname = family_name;
                    const lname = given_name;

                    handleAuthUser({ fname, lname, nid: email });
                    localStorage.setItem(
                      "loggedUser",
                      JSON.stringify({ nid: email, fname, lname })
                    );
                  }}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                  logo_alignment="center"
                  text="Continue with Google"
                  type="standard"
                  className="w-full h-full"
                  useOneTap="true"
                  select_account
                />
              </div>
            </GoogleOAuthProvider>
          </div> */}
          <div
            className="w-[60%] h-8 flex_center text-gray-50 font-medium bg-[#3e3eea] rounded-lg "
            onClick={handleSubmit}
          >
             {currentLanguage === "en" ? "sign in" : "সাইন ইন "}

          </div>
        </div>
      </div>
    </div>
  );
};

export default RickshamamaLogin;
