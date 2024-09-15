import React from "react";
import "./WeatherDetails.css";

const WeatherDetails = (props) => {
  return (
    <div className="wind">
      <div className="details">
        <img src={props.image} alt="" />
        <h4 className="weather_details">{props.name}</h4>
      </div>
      <p className="value">
        {props.value} {props.unit}
      </p>
    </div>
  );
};

export default WeatherDetails;
