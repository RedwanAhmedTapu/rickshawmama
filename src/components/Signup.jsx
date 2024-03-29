import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CountdownTimer from "./CountdownTimer";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
// import jwt_decode from "jwt-decode";

const Signup = ({currentLanguage}) => {
  const [user, setUser] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });
  const [code, setCode] = useState("");
  const [isOtp, setIsOtp] = useState(false);

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const clientID=process.env.CLIENTID;
  // const clientID =
    // "937173192475-srjkndb4hln721ut5f40m08d3u6e0tq2.apps.googleusercontent.com"; //for localhost
  const server=process.env.SERVER_URL;
  // const server = "http://localhost:5001";
  console.log(server)

  const handleSubmit = async () => {
    try {
      const { fname, lname, email, password } = user;
      if (
        fname.trim() === "" ||
        lname.trim() === "" ||
        email.trim() === "" ||
        password.trim() === ""
      ) {
        alert("please fill all the data");
      } else {
        await fetch(`${server}/user/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fname, lname, email, password }),
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            if (data.message === "successfully studentInfo saved") {
              setIsOtp(true);
            } else {
              alert(data.message);
            }
          });
      }
    } catch {
      console.log("error");
    }
  };
  console.log(user);

  const handleInputChange = (e) => {
    const value = e.target.value;
    // const numericValue = value.replace(/\D/g, '');
    setCode(value.trim());
  };

  const handleSendOtp = async () => {
    const { email } = user;

    await fetch(`${server}/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.message === "Email verified successfully") {
          navigate("/login");
        } else {
          alert(data.message);
          navigate("/signup");
        }
      });
  };
  // const handleVerificationAuth = async (otpData, userEmail) => {
  //   console.log("codecamp", `${userEmail + otpData}`);
  //   try {
  //     const res = await fetch(
  //       `${server}/auth/googleAuth-verfication`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ userEmail, otpData }),
  //       }
  //     );

  //     const data = await res.json();

  //     if (data.message === "Email verified successfully" || data.message==="Invalid verification code") {
  //       navigate(`/rickshawpuller-tracking`);

  //     } else {
  //      navigate("/signup");
  //     }
  //   } catch (error) {
  //     console.error("Error during email verification:", error);
  //   }
  // };

  const handleAuthuser = async (userData) => {

    try {
      const res = await fetch(`${server}/auth/registration`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      console.log(data);
      if (data) {
        if (data.message === "user already exist" || data.message==="User created successfully") {
          navigate(`/rickshawpuller-tracking`);
        }
      }
    } catch (error) {
      console.error("Error during user registration:", error);
    }
  };

  return (
    <div className="w-full h-screen bg-[#18324D] flex_center max-[500px]:relative     overflow-hidden ">
      <div className="sm:w-[70%] sm:h-[70%]  w-[90%] h-[90%]  flex_col_center gap-y-16  rounded-lg shadow-md shadow-slate-950 relative p-4 pt-8">
        <div className="w-full h-12 flex_center max-[323px]:text-[1rem] text-xl md:text-4xl font-mono text-white font-bold">
        {currentLanguage === "en" ? "create account as a user" : " ব্যবহারকারী হিসেবে অ্যাকাউন্ট তৈরি করুন"}
        </div>
        <div className="w-full h-12 flex_center gap-x-4">
          <input
            type="text"
            name="fname"
            id="fname"
            className="w-[40%] px-1 py-2 bg-[#dbdbdb] max-[500px]:placeholder:text-[0.8rem] placeholder-gray-400 text-gray-900 rounded-lg  ring-2 ring-white"
            placeholder={currentLanguage === "en" ? "enter firstname..." : " প্রথম নাম দিন "}
            value={user && user.fname}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lname"
            id="lname"
            className="w-[40%] px-1 py-2 bg-[#dbdbdb] max-[500px]:placeholder:text-[0.8rem] placeholder-gray-400 text-gray-900 rounded-lg  ring-2 ring-white"
            placeholder={currentLanguage === "en" ? "enter lastname..." : "শেষ নাম দিন "}
            value={user && user.lname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="w-full h-12 flex_center gap-x-4">
          <input
            type="email"
            name="email"
            id="email"
            className="w-[40%] px-1 py-2 bg-[#dbdbdb] max-[500px]:placeholder:text-[0.8rem] placeholder-gray-400 text-gray-900 rounded-lg  ring-2 ring-white"
            placeholder={currentLanguage === "en" ? "enter email..." : "ইমেইল দিন "}
            value={user && user.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            className="w-[40%] px-1 py-2 bg-[#dbdbdb] placeholder-gray-400 text-gray-900 rounded-lg max-[500px]:placeholder:text-[0.8rem]  ring-2 ring-white"
            placeholder=        {currentLanguage === "en" ? "enter password..." : "পাসওয়ার্ড দিন "}

            name="password"
            id="password"
            value={user && user.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-y-8 w-[50%]">
          <div className="flex_center w-full h-10 gap-x-2 border-2 border-slate-300 rounded-lg">
            <GoogleOAuthProvider clientId={clientID}>
              <div className="w-full h-full flex_center bg-white rounded-lg">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    console.log(credentialResponse);
                    // var decoded = jwt_decode(credentialResponse.credential);

                    //       console.log(decoded);
                    //       const { family_name, given_name, email } = decoded;
                    //       const fname = family_name;
                    //       const lname = given_name;
                    if (credentialResponse) {
                    handleAuthuser({token:credentialResponse.credential});
                    }else{
                      alert("wrong credentials");
                    }
                    // localStorage.setItem("loggedUser", JSON.stringify({ email, fname, lname }));
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

          <div
            className="w-[60%] max-[500px]:w-full h-10 flex_center self-center cursor-pointer rounded-lg text-xl text-gray-900 font-bold bg-[#ffffff]"
            onClick={handleSubmit}
          >
                   {currentLanguage === "en" ? "sign up" : " নিবন্ধন করুন"}

          </div>
        </div>
      </div>
      {isOtp && (
        <div className="w-full h-screen flex_center  absolute ">
          <div className=" bg-slate-900 rounded-lg">
            <div className="max-w-md mx-auto p-4  rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-center text-white">
              {currentLanguage === "en" ? "Enter OTP" : "OTP দিন"}

              </h2>
              <CountdownTimer />

              <input
                type="text"
                className="w-full p-2 border text-black rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter OTP"
                value={code}
                onChange={handleInputChange}
              />
              <button
                className="mt-4 px-1 py-2 self-center bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                onClick={handleSendOtp}
              >
              
              {currentLanguage === "en" ? "  Send OTP for email verification" : "সেন্ড OTP"}

              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
