import React, { useState, useEffect, useRef } from 'react';
import './index.css';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [cityInput, setCityInput] = useState('London');
  const [forecastData, setForecastData] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchWeatherData();
    fetchWeatherForecast();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 600px) and (max-height: 1280px)');

    // Función para actualizar el estado basado en la media query
    const handleMediaQueryChange = (e) => {
      setIsMobile(e.matches);
    };

    // Agregar el listener
    mediaQuery.addListener(handleMediaQueryChange);

    // Verificar inicialmente la condición
    handleMediaQueryChange(mediaQuery);

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }, []);

  const btnRef = useRef(null);
  const btnRef2 = useRef(null);
  const appRef = useRef(null);

  const fetchWeatherData = async () => {
    if (cityInput.trim() === '') {
      alert('Please enter a city');
      return;
    }

    try {
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_ACCESS_TOKEN_SECRET}&q=${cityInput}`);

      if (!response.ok) {
        throw new Error('City not found, please try again');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error('City not found, please try again');
      }

      setWeatherData(data);
      setCityInput('');
      changeBackground(data);
    } catch (error) {
      alert('Failed to fetch weather data, please try again');
      console.error('Error fetching weather data:', error);
    }
  };

  const fetchWeatherForecast = async () => {
    try {
      const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_ACCESS_TOKEN_SECRET}&q=${cityInput}&days=7&aqi=no&alerts=no`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setForecastData(data.forecast.forecastday.slice(1));
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
    }
  };
  

  const changeBackground = async (data) => {

    let timeOfDay = "day";
    if (!data.current.is_day) {
      timeOfDay = "night";
    }

    const code = data.current.condition.code;

    const app = appRef.current;
    const btn = btnRef.current;
    const btn2 = btnRef2.current

    let imageUrl;

    if (code == 1000) {
      imageUrl = await import(`./assets/images/${timeOfDay}/clear.jpg`);

      if (btn) {
        btn.style.background = "#e5ba92";
      }
      if (btn2) {
        btn2.style.background = "#e5ba92";
      }

      if (timeOfDay == "night") {
        if(btn){
          btn.style.background = "#181e27"
        }
        if (btn2) {
          btn2.style.background = "#181e27"
        }

      }
    } else if (
      code == 1003 ||
      code == 1006 ||
      code == 1009 ||
      code == 1030 ||
      code == 1069 ||
      code == 1087 ||
      code == 1135 ||
      code == 1273 ||
      code == 1276 ||
      code == 1279 ||
      code == 1282
    ) {
      imageUrl = await import(`./assets/images/${timeOfDay}/cloudy.jpg`);
      if (btn) {
        btn.style.background = "#fa6d1b"
      }
      if (btn2) {
        btn2.style.background = "#fa6d1b"
      }


      if (timeOfDay == "night") {
        if (btn) {
          btn.style.background = "#181e27"
        }
        if (btn2) {
          btn2.style.background = "#181e27"
        }

      }
    } else if (
      code == 1063 ||
      code == 1069 ||
      code == 1072 ||
      code == 1150 ||
      code == 1153 ||
      code == 1180 ||
      code == 1183 ||
      code == 1186 ||
      code == 1189 ||
      code == 1192 ||
      code == 1195 ||
      code == 1204 ||
      code == 1207 ||
      code == 1240 ||
      code == 1243 ||
      code == 1246 ||
      code == 1249 ||
      code == 1252
    ) {
      imageUrl = await import(`./assets/images/${timeOfDay}/rainy.jpg`);
      if (btn) {
        btn.style.background = "#647d75"
      }
      if (btn2) {
        btn2.style.background = "#647d75"
      }


      if (timeOfDay == "night") {
        if (btn) {
          btn.style.background = "#325c80"
        }
        if (btn2) {
          btn2.style.background = "#325c80"
        }

      }
    } else {
      imageUrl = await import(`./assets/images/${timeOfDay}/snowy.jpg`);
      if (btn) {
        btn.style.background = "#4d72aa"
      }
      if (btn2) {
        btn2.style.background = "#4d72aa"
      }


      if (timeOfDay == "night") {
        if (btn) {
          btn.style.background = "#1b1b1b"
        }
        if (btn2) {
          btn2.style.background = "#1b1b1b"
        }

      }
    }
    setBackgroundImage(`url(${imageUrl.default})`);
    // Fade in the page once all is done
    app.style.opacity = "1"
  };

  const getDayName = (dateStr) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateStr);
    // Sumar 1 para obtener el día siguiente
    let dayOfWeek = date.getDay() + 1;
    // Si es sábado, el día siguiente es domingo
    if (dayOfWeek === 7) dayOfWeek = 0;
    return daysOfWeek[dayOfWeek];
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[date.getDay()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${dayOfWeek} ${day}, ${date.getMonth() + 1} ${year}`;
  };

  // Función para mostrar u ocultar el panel en dispositivos Samsung
  const togglePanelVisibility = () => {
    if (window.matchMedia('(max-width: 600px) and (max-height: 1280px)').matches) {
      setIsPanelVisible(!isPanelVisible);
    }
  };

  return (
    <div ref={appRef} className='relative min-h-screen bg-cover bg-center bg-no-repeat text-white transition-opacity duration-500' style={{ backgroundImage: backgroundImage }}>
      <div className='absolute inset-0 bg-black bg-opacity-30 z-0'>
        <div className='absolute top-0 left-0 w-full h-full flex justify-between items-start flex-col p-8 pt-12 pb-16'>
          <h3 className="brand">The Weather</h3>
          <div className='flex justify-center items-center flex-col md:flex-row'>
            <div className='mb-4 md:mb-0'>
              <h1 className='text-7xl m-0'>{weatherData?.current?.temp_c}&#176;</h1>
            </div>
            <div className='mx-4 mb-4 md:mb-0 text-center md:text-left'>
              <h1 className='m-0 mb-1 text-3xl'>{weatherData?.location?.name}</h1>
              <small>
                <span>{weatherData?.location?.localtime.split(' ')[1]}</span> - <span>{formatDate(weatherData?.location?.localtime)}</span>
              </small>
            </div>

            {isMobile ? (
              <div className='mx-4 text-center md:text-left'>
                <div className="flex flex-col items-center md:flex-row md:items-start justify-center">
                  <img src={`http:${weatherData?.current?.condition?.icon}`} className='block mx-0 w-10 h-10' alt="icon" width="50" height="50" />
                  <span className="text-lg">{weatherData?.current?.condition?.text}</span>
                </div>
              </div>

            ) : (

              <div className='mx-4 text-center md:text-left'>
                <div className="flex md:flex-col">
                  <img src={`http:${weatherData?.current?.condition?.icon}`} className='block mx-0 w-10 h-10' alt="icon" width="50" height="50" />
                  <span className="text-lg m-1">{weatherData?.current?.condition?.text}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={`absolute top-0 right-0 w-full md:w-2/5 h-full bg-gray-400 bg-opacity-25 shadow-lg backdrop-filter backdrop-blur-lg border border-white border-opacity-25 z-10 p-8 overflow-y-auto ${isPanelVisible ? 'block' : 'hidden md:block'}`}>
          <form onSubmit={(e) => {
            e.preventDefault();
            fetchWeatherData();
            fetchWeatherForecast();
          }} id="locationInput" className='mb-12'>
            {isPanelVisible && (
              <div className=''>
                <button type="button" onClick={togglePanelVisibility} className="absolute left-2 top-1 p-1">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}

            <input type="text"
              className="bg-transparent border-b border-gray-300 px-4 py-2 w-4/5 text-white text-lg focus:outline-none"
              placeholder="Search Location..." value={cityInput} onChange={(e) => setCityInput(e.target.value)} />
            <button type="submit" ref={btnRef} className="absolute top-0 right-0 p-6 m-0 border-none outline-none bg-orange-500 text-white cursor-pointer text-lg transition-colors duration-400 hover:text-black">
              <i className="fas fa-search"></i>
            </button>
          </form>

          <ul className="py-0 my-8 border-b border-gray-300">
            <h4 className='my-12'>Weather Details</h4>
            <li className='text-gray-300 my-10 flex justify-between items-center'>
              <span className='text-gray-100'>Cloudy</span>
              <span className="text-gray-100">{weatherData?.current?.cloud}%</span>
            </li>
            <li className='text-gray-300 my-10 flex justify-between items-center'>
              <span className='text-gray-100'>Humidity</span>
              <span className='text-gray-100'>{weatherData?.current?.humidity}%</span>
            </li>
            <li className='text-gray-300 my-10 flex justify-between items-center'>
              <span className='text-gray-100'>Wind</span>
              <span className='text-gray-100'>{weatherData?.current?.wind_kph}km/h</span>
            </li>
          </ul>

          <h4>3 - Day Forecast</h4>
          <ul>
            {forecastData.map((day, index) => (
              <li key={index} className="flex justify-between items-center border border-gray-300 bg-gray-100 bg-opacity-15 p-2 my-6">
                <div className="flex-1 flex justify-center items-center">{getDayName(day.date)}</div>
                <div className="flex-1 flex justify-center items-center">
                  <div className="text-center">
                    <span>{day.day?.maxtemp_c}&#176;C</span><br />
                    <span>Max Temp</span>
                  </div>
                </div>
                <div className="flex-1 flex justify-center items-center">
                  <div className="text-center">
                    <span>{day.day?.mintemp_c}&#176;C</span><br />
                    <span>Min Temp</span>
                  </div>
                </div>
                <div className="flex-1 flex justify-center items-center">
                  <div className="text-center">
                    <img src={`http:${day.day?.condition?.icon}`} className="mx-auto h-12 w-12" alt="icon" />
                    <p className="mt-1 text-sm">{day.day?.condition?.text}</p>
                  </div>
                </div>
              </li>
            ))}
            <div className="mt-8 border-b border-gray-300"></div>
          </ul>
        </div>

          <button ref={btnRef2} onClick={togglePanelVisibility} className="absolute top-0 right-0 p-6 m-0 border-none outline-none bg-orange-500 text-white cursor-pointer text-lg transition-colors duration-400 hover:text-black">
            <i className="fas fa-search"></i>
          </button>          
      </div>
    </div>
  );
};

export default App;
