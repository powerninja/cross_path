import React from "react";
import "./App.css";

export const App = () => {
  return (
    <div
      style={{
        height: "auto",
        margin: "0 auto",
        maxWidth: 800,
        width: "100%",
      }}
    >
      <h1>パス変換</h1>
      <div className="d-flex flex-row">
        <div className="form-group my-box w-25">
          <label>windows Path:</label>
          <textarea id="textarea" className="form-control"></textarea>
        </div>

        <div className="form-group my-box w-25">
          <label>mac Path:</label>
          <textarea id="textarea" className="form-control"></textarea>
        </div>
      </div>
    </div>
  );
};
