import React, { useEffect, useRef, useState } from "react";
import "./Weather.css";
import Rain from "../assets/rain.png";
import Cloud from "../assets/cloud.png";
import Clear from "../assets/clear.png";
import Drizzle from "../assets/drizzle.png";
import Snow from "../assets/snow.png";
import Search from "../assets/search.png";
import Face from "../assets/happy-face.png";
import Humidity from "../assets/humidity.png";
import Pressure from "../assets/pressure.png";
import Windy from "../assets/windy.png";
import Location from "../assets/location.png";
import Clock from "../assets/clock.png";
import WeatherDetails from "./WeatherDetails";

const bgColor = {
  Clear: "#fff7c6",
  Rainy: "#4682B4",
  Snow: "#9fd4ff",
  Cloudy: "#758694",
};

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(false);
  const [currentColor, setCurrentColor] = useState(bgColor.clear);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentDay, setCurrentDay] = useState("");

  const allIcons = {
    "01d": Clear,
    "01n": Clear,
    "02d": Cloud,
    "02n": Cloud,
    "03d": Cloud,
    "03n": Cloud,
    "04d": Drizzle,
    "04n": Drizzle,
    "09d": Rain,
    "09n": Rain,
    "10d": Rain,
    "10n": Rain,
    "13d": Snow,
    "13n": Snow,
  };

  const changeColor = (condition) => {
    switch (condition) {
      case "Clear":
        setCurrentColor(bgColor.Clear);
        break;
      case "Rain":
      case "Drizzle":
        setCurrentColor(bgColor.Rainy);
        break;
      case "Snow":
        setCurrentColor(bgColor.Snow);
        break;
      case "Clouds":
      case "Thunderstorm":
        setCurrentColor(bgColor.Cloudy);
        break;
      default:
        setCurrentColor(bgColor.Clear);
        break;
    }
  };

  const formatTime = (timestamp, timezoneOffset) => {
    const localTime = new Date((timestamp + timezoneOffset) * 1000);
    let hours = localTime.getUTCHours();
    const minutes = localTime.getUTCMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;

    const time = `${hours}:${minutes} ${ampm}`;

    const date = localTime.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const day = localTime.toLocaleDateString("en-IN", { weekday: "long" });

    return { time, date, day };
  };

  const search = async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
        import.meta.env.VITE_APP_ID
      }`;
      const response = await fetch(url);
      const data = await response.json();
      const icon = allIcons[data.weather[0].icon] || Clear;
      const condition = data.weather[0].main;

      const { time, date, day } = formatTime(data.dt, data.timezone);

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        country: data.sys.country,
        icon: icon,
        condition: condition,
        feels_like: data.main.feels_like,
      });

      setCurrentTime(time);
      setCurrentDate(date);
      setCurrentDay(day);
      changeColor(condition);
    } catch (error) {
      console.error("Error fetching weather data", error);
    }
  };

  useEffect(() => {
    search("Tokyo");
  }, []);

  return (
    <>
      <h1 className="heading">Weather Dashboard</h1>
      <div className="search_box">
        <input ref={inputRef} type="text" placeholder="Enter a city..." />
        <img
          src={Search}
          alt=""
          onClick={() => search(inputRef.current.value)}
        />
      </div>
      <div className="weather_container">
        <div className="weather_top" style={{ backgroundColor: currentColor }}>
          <div className="weather_top_left">
            <img src={weatherData.icon} alt="" className="rain_img" />
            <div className="day_date">
              <h2>{currentDay}</h2>
              <p className="bold">{currentDate}</p>
            </div>
          </div>
          <div className="weather_top_right">
            <div className="country_temp_weather">
              <div className="location">
                <img src={Location} alt="" />
                <p className="bold">
                  {weatherData.location}, {weatherData.country}
                </p>
              </div>
              <h1 className="temp">{weatherData.temperature}&deg;C</h1>
              <p className="bold">{weatherData.condition}</p>
            </div>
            <div className="time">
              <img src={Clock} alt="" />
              <h3>{currentTime}</h3>
            </div>
          </div>
        </div>
        <div className="weather_bottom">
          <WeatherDetails
            image={Face}
            name="Feels Like"
            value={Math.floor(weatherData.feels_like)}
            unit="&deg;C"
          />
          <WeatherDetails
            image={Windy}
            name="Wind Speed"
            value={weatherData.windSpeed}
            unit="m/s"
          />
          <WeatherDetails
            image={Humidity}
            name="Humidity"
            value={weatherData.humidity}
            unit="%"
          />
          <WeatherDetails
            image={Pressure}
            name="Pressure"
            value={weatherData.pressure}
            unit="hPa"
          />
        </div>
      </div>
    </>
  );
};

export default Weather;
