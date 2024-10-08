import React from "react";
import "./demo.css";
const demo = () => {
  return (
    <div>
      <div>
        <div className="laptop">
          <div className="screen">
            <div className="header"></div>
            <div className="text">Hello MackBook</div>
          </div>
          <div className="keyboard"></div>
        </div>
      </div>

      <div className="bg-gray-300 p-10 rounded-lg">
        <input id="switch" type="checkbox" />
        <div className="app">
          <div className="body">
            <div className="phone">
              <div className="menu">
                <div className="time">4:20</div>
                <div className="icons">
                  <div className="network"></div>
                  <div className="battery"></div>
                </div>
              </div>

              <div className="content">
                <div className="circle">
                  <div className="crescent"></div>
                </div>

                <label htmlFor="switch">
                  <div className="toggle"></div>
                  <div className="names">
                    <p className="light">Light</p>
                    <p className="dark">Dark</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default demo;
