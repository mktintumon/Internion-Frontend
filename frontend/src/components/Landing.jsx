import React from "react";
import "./styles/landing.css";

const Landing = () => {
  return (
    <div className="formify-container">
      <header className="formify-header">
        <img src="/logoMain.png" width="400rem" alt="" />
        <p style={{color:"black",fontSize:"1.5rem",marginTop:"1.5rem"}}>The ultimate solution for seamless form management</p>
      </header>

      <div><h2 style={{color:"black",marginTop:"4rem"}}>Let's dive into our features</h2></div>
      <section className="formify-features">
        <div className="feature">
          <h2>Simlified Form Filling</h2>
          <p>
          Glide through the journey of unparalleled simplicity with our crafted
            UI.
          </p>
        </div>

        <div className="feature">
          <h2>Fortified Protection</h2>
          <p>
            Advanced security with Multi-Factor Authentication, captcha ,
            email verification, and PDF passwords.
          </p>
        </div>

        <div className="feature">
          <h2>Dashboard Management</h2>
          <p>Effortlessly manage your dashboards for a seamless experience.</p>
        </div>

        <div className="feature">
          <h2>Form & PDF Management</h2>
          <p>Send , upload, download PDFs with ease and magic with security features.</p>
        </div>
      </section>
    </div>
  );
};

export default Landing;
