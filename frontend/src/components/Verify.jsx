import * as React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { NavLink, useLocation} from "react-router-dom";
import { useParams } from 'react-router-dom';
import axios from "axios"; 
 
export default function Verify() {
  const [verify, setVerify] = useState(false);
 
  const location = useLocation();
  const locationEmail = location.state?.emailData;
  const { paramEmail } = useParams();

  const email = locationEmail == undefined ? paramEmail : locationEmail

 
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/users/email/${email}`
        );
        setVerify(true);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
 
    fetchData();
  }, [email]);
 
  return (
    <>
      <h2
        className="common-heading"
        style={{ marginTop: "20px", marginBottom: "1rem" }}
      >
        Email verification
      </h2>
      <Stack
        style={{
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "8rem",
          marginBottom: "10rem",
          width: "30%",
        }}
      >
        {verify ? (
          <>
            <Alert style={{ fontSize: "1rem" }} severity="success">
              <AlertTitle style={{ fontSize: "2rem" }}>Success</AlertTitle>
              Congratulations!!! Email have been verified.
            </Alert>
 
            <NavLink to="/qrcode" state={{ emailData: email }}>
              <Button
                className="verify"
                variant="contained"
                color="success"
                style={{marginLeft:"9rem", marginTop:"2rem"}}
              >
                Proceed for QR-Scan
              </Button>
            </NavLink>
          </>
        ) : (
          <>
            <Alert
              style={{ fontSize: "1rem", fontFamily: "sans-serif" }}
              severity="error"
            >
              <AlertTitle style={{ fontSize: "2rem" }}>Pending</AlertTitle>
              Email verification is pending..Please verify your email
             
            </Alert>
           
          </>
        )}
      </Stack>
    </>
  );
}
