import React, { useState } from "react";
import "./styles/login.css";
import axios from "axios";
import { useEffect } from "react";
import CachedIcon from "@mui/icons-material/Cached";
import { useNavigate } from "react-router-dom";
import { SpinnerCircular } from "spinners-react";

const Login = () => {
  const [isSignUpActive, setSignUpActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleToggle = () => {
    setSignUpActive(!isSignUpActive);
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginEmail, setloginEmail] = useState("");
  const [loginPassword, setloginPassword] = useState("");
  const [recaptchaText, setrecaptchaText] = useState("");
  const [ranNum, setRanNum] = useState();
  const [retest, setRetest] = useState(false);
  const [image, setImage] = useState("");
  const [test, setTest] = useState(false);
  const [submit, setSubmit] = useState(false);
  const navigate = useNavigate();

  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const isValidPassword = (value) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/;
    return regex.test(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordValid(isValidPassword(value));

    if (!isValidPassword(value)) {
      setPasswordErrorMessage(
        <i style={{ color: "#FA8072", textAlign: "justify" }}>
          "Password must be 6-10 characters with at least one lowercase,
          uppercase, digit, and special character."{" "}
        </i>
      );
    } else {
      setPasswordErrorMessage("");
    }
  };

  //-----------------------Checkbox------------------------------------------------------

  const handleCheckboxChange = () => {
    setRetest(!retest);
  };

  //-------------------- FUNCTION FOR SIGNUP -------------------------------------------
  async function onHandleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api/register", {
        email: email,
        password: password,
      });

      if (response.data == "success") {
        handleToggle();

        setEmail("");
        setPassword("");
        alert("Check your mail for verification Link");
        navigate("/qrcode", { state: { emailData : email } });
      }

      if (response.data == "User already exist") {
        alert("User already exists!!!");
      }
    } catch (err) {
      alert("User Registation Failed😢");
    } finally {
      setLoading(false);
    }
  }

  //---------------------Function for Login------------------------------------------------
  async function save(event) {
    event.preventDefault();
    if (retest == true) {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/signin/${loginEmail}/${loginPassword}`
        );

        if (response.data !== "") {
          const userId = response.data.id;
          const userEmail = response.data.email;
          localStorage.setItem("userId", JSON.stringify(userId));
          localStorage.setItem("userEmail", JSON.stringify(userEmail));
          localStorage.setItem("admin", false);

          if (response.data.email === "jatinjain.2011@gmail.com") {
            localStorage.setItem("admin", true);
          }

          setloginEmail("");
          setloginPassword("");
          navigate("/loginotp", { state: { loginEmail: response.data.email } });
        } else {
          alert("Incorrect Email / password");
        }
      } catch (error) {
        alert("User Already Exists");
      }
    } else {
      alert("Captcha not validated");
    }
  }

  //-------------Fucntion For random generation captcha-----------------------------------
  const randomNumberInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  useEffect(() => {
    if (loginEmail.length && loginPassword.length) {
      setSubmit(true);
    }
  }, [loginEmail, loginPassword]);

  const num = randomNumberInRange(1, 5000);

  //---------------------get captcha image ------------------------------------------------
  useEffect(() => {
    const getimage = async () => {
      const rn = randomNumberInRange(1, 5000);
      setRanNum(rn);
      // console.log(rn);
      const response = await axios.get(
        `http://localhost:8080/api/generate/${rn}`
      );
      // console.log(response);
      setImage(response.data.imageUrl);
      setRetest(false);
      // randomNumberInRange(1,5000);
    };
    getimage();
  }, [test]);

  //-----------------------to verify the captcha -----------------------------------------------
  async function validate(event) {
    try {
      // console.log(ranNum);
      const response = await axios.post(
        `http://localhost:8080/api/validate/${ranNum}?enteredText=${recaptchaText}`
      );
      // console.log(response);
      if (response.data == "Captcha is valid") {
        setRetest(true);
      }
    } catch (error) {
      alert("Incorrect Text");
    }
  }

  console.log(recaptchaText.length);

  return (
    <div
      className={`container ${isSignUpActive ? "active" : ""}`}
      id="container"
    >
      <div
        className={`form-container ${isSignUpActive ? "sign-up" : "sign-in"}`}
      >
        {isSignUpActive ? (
          <form>
            {/* SIGNUP */}
            <h1>Create Account</h1>

            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={(e) => handlePasswordChange(e.target.value)}
              required
            />

            {passwordErrorMessage && (
              <div className="error-message">{passwordErrorMessage}</div>
            )}
            <button onClick={onHandleSubmit} disabled={!passwordValid}>
              {loading ? (
                <SpinnerCircular color={"#ffffff"} width={"2rem"} size={20} />
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        ) : (
          <form>
            <h1>Sign In</h1>

            <input
              type="email"
              placeholder="Email"
              onChange={(e) => {
                setloginEmail(e.target.value);
              }}
            />
            <input
              type="password"
              placeholder="Password"
              required
              onChange={(e) => {
                setloginPassword(e.target.value);
              }}
            />

            <div style={{ display: "flex" }}>
              <img
                src={image}
                alt="ttes"
                height={"50px"}
                style={{ borderRadius: "1 0px", marginTop: "10px" }}
              />
              <CachedIcon
                style={{ margin: "auto 10px", fontSize: "30px" }}
                onClick={() => setTest(!test)}
              ></CachedIcon>
              
              {recaptchaText.toString().length === 4 && (
                <input
                  style={{ margin: "auto 10px", width: "30px", height: "30px" }}
                  type="checkbox"
                  disabled
                  checked={retest}
                  onChange={handleCheckboxChange}
                />
              )}

              <input
                type="text"
                placeholder="Enter Captcha"
                style={{
                  width: "120px",
                  marginLeft: "20px",
                  marginTop: "15px",
                }}
                onChange={(e) => {
                  setrecaptchaText(e.target.value);
                }}
              />

              <br></br>
            </div>

            {recaptchaText.toString().length === 4 && (
              <div style={{ marginTop: "20px" }} onClick={validate}>
                <button type="button">
                  Check
                </button>
              </div>
            )}

            <button
              style={{ marginTop: "30px" }}
              disabled={!submit}
              onClick={save}
            >
              Sign In
            </button>
          </form>
        )}
      </div>
      <div className="toggle-container">
        <div className="toggle">
          <div
            className={`toggle-panel ${
              isSignUpActive ? "toggle-left" : "toggle-right"
            }`}
          >
            {isSignUpActive ? (
              <>
                <h1>Welcome Back!</h1>
                <p>Enter your email and password to login</p>
                <button onClick={handleToggle}>Sign In</button>
              </>
            ) : (
              <>
                <h1>Hello, Friend!</h1>
                <p>Register with your email</p>
                <button onClick={handleToggle}>Sign Up</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
