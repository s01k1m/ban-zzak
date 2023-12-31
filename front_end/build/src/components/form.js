import React from "react";
import axios from "axios";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
// date-time

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";


// import Autocomplete from "@mui/material/Autocomplete";

// import Box from "@mui/material/Box";
// import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import IconButton from "@mui/material/IconButton";

import FormControl from "@mui/material/FormControl";
// Get a set of latitude and longitude coordinates for a specific location using the Google Maps API
export default function Form() {
  const [address, setAddress] = React.useState("");
  const [coordinates, setCoordinates] = React.useState({
    lat: null,
    lng: null,
  });

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setAddress(value);
    setCoordinates(latLng);
  };

  // Get a set of lat and lon coordinates of current User's location
  const [show, setShow] = React.useState(false);
  console.log(show);
  const findMyLocation = () => {
    setShow(true);
    console.log("findmylocation 시작");
    console.log(navigator.geolocation);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log(pos);
        setShow(false);
        setCoordinates(pos);
      });
    } else {
      console.log("현재 위치를 가져올 수 없음");
    }
  };

  const [img64, setimg64] = React.useState("");

  // Get the birthday
  const [dateValue, setDateValue] = React.useState("");

  // const handleDate = (event) => {
  //   setDateValue(event.target.value);
  //   console.log("date:", dateValue);
  // };

  // Get the birth time
  const [timeValue, setTimeValue] = React.useState("");
  // const when = dateValue + " " + timeValue;

  // const handleTime = (event) => {
  //   setTimeValue(event.target.value);
  // };
  const [imgFile, setImgFile] = React.useState("");
  // Combine the birthday and birth time to create JSON data to send to our backend API and Send it
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('click')
    const when = dateValue + "" + timeValue;
    const formData = new FormData();
    formData.append("lat", coordinates.lat);
    formData.append("lon", coordinates.lng);
    formData.append("when", when);
    axios({
      method: "get",
      url: "http://43.202.12.99/api/v1/get_sky/",
      data: formData,
      // responseType: 'arraybuffer'
    })
      .then((result) => {
        console.log("요청성공");
        const buffer64 = Buffer.from(result.data,'binary').toString('base64')
        setimg64(buffer64)

      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div id='formWrapper'>
        <FormControl sx={{ mx: 'auto', p:1, width: 300 }} className="form">
        <h1>강아지가 온<br/>⭐️을 찾아보세요</h1> 
          <span name="loading" className={show ? "show" : "not-show"}>
            당신의 위치를 가져오는 중..
          </span>
          <label htmlFor='coordinates'>
            Latitude: {coordinates.lat}<br/>
            Longitude: {coordinates.lng}</label>
          <PlacesAutocomplete
            value={address}
            onChange={setAddress}
            onSelect={handleSelect}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div className="auto-complete">
                <TextField id='coordinates'
                sx={{ width: 300}}  
                  {...getInputProps({ placeholder: "Type address" })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton sx={{ m: 0, p:0 }}aria-label="GpsFixedIcon" id='getlocation' onClick={findMyLocation}>
                          <GpsFixedIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <div className="auto-list">
                  {loading ? <div>...loading</div> : null}
                  {suggestions.map((suggestion) => {
                    const style = {
                      // 선택되면
                      padding: "10px",
                      backgroundColor: suggestion.active ? "#7895CB" : ""
                    }

                    return (
                      <div
                        key={suggestion.description}
                        {...getSuggestionItemProps(suggestion, { style })}
                      >
                        {suggestion.description}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
          <label htmlFor='birthday'>Birthday</label>
          <DatePicker
            id='birthday'
            disableFuture
            onChange={(value) => {
              console.log(value.format("YYYY-MM-DD"));
              setDateValue(value.format("YYYY-MM-DD"));
            }}
            mask="____-__-__"
            format="YYYY-MM-DD"
            value={dateValue}
          />
          <label htmlFor='birthtime'>Birth time</label>
          <TimePicker
            id='birthtime'
            onChange={(value) => {
              console.log(value.format("HH:MM"));
              setTimeValue(value.format("HH:MM"));
            }}
            ampm={false}
            value={timeValue}
          />
          <label for='dogPic'>Dog's Photo</label>
          <input id='dogPic' type='file'
              onChange={(e) => {
                setImgFile(e.target.files[0])
                console.log(e.target.files)}}/>
          <br></br>
          <button type="submit" onClick={handleSubmit}>
            submit
          </button>
        </FormControl>
        {img64 != null && <img src = {`data:image;base64,${img64}`} alt="" />}
      </div>
    </LocalizationProvider>
  );
}
