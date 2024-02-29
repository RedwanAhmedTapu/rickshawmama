import { useNavigate } from "react-router-dom";

const LoginChoice = ({currentLanguage}) => {
  const navigate = useNavigate();

  const handleLogin = (userType) => {
    if (userType === "rider") {
        navigate("/rider-login");
    } else if (userType === "rickshawmama") {
        navigate("/rickshawmama-login");
    }
  };

  return (
    <div className="w-full h-screen flex_center bg-[#18324D]">
      <div className="w-[50%] h-1/2 flex_col_center gap-y-8">
        <button
          onClick={() => handleLogin("rider")}
          className="w-96 h-16 bg-white rounded-md shadow-md shadow-slate-400 text-slate-950 text-2xl"
        >
                 {currentLanguage === "en" ? "Login as user" : " ব্যবহারকারী হিসেবে লগইন করুন"}

        </button>
        <button
          onClick={() => handleLogin("rickshawmama")}
          className="w-96 h-16 bg-white rounded-md shadow-md shadow-slate-400 text-slate-950 text-2xl"
        >
                          {currentLanguage === "en" ? "Login as rickshawmama " : " রিকশামামা হিসেবে লগইন করুন"}

        </button>
      </div>
    </div>
  );
};

export default LoginChoice;
