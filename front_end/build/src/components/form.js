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

import Autocomplete from "@mui/material/Autocomplete";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

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

  // Get the birthday
  const [dateValue, setDateValue] = React.useState("");

  const handleDate = (event) => {
    setDateValue(event.target.value);
    console.log("date:", dateValue);
  };

  // Get the birth time
  const [timeValue, setTimeValue] = React.useState("");
  const when = dateValue + " " + timeValue;

  const handleTime = (event) => {
    setTimeValue(event.target.value);
  };

  // Combine the birthday and birth time to create JSON data to send to our backend API and Send it
  const handleSubmit = (e) => {
    e.preventDefault();

    const when = dateValue + "" + timeValue;
    const formData = new FormData();
    formData.append("lat", coordinates.lat);
    formData.append("lon", coordinates.lng);
    formData.append("when", when);
    axios({
      method: "post",
      url: "http://43.202.12.99/api/v1/get_sky/",
      data: formData,
    })
      .then((result) => {
        console.log("요청성공");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword ? "text" : "password"}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
      </FormControl> */}
      <FormControl className="form">
        <button type="button" onClick={findMyLocation}>
          <GpsFixedIcon />
        </button>
        <span name="loading" className={show ? "show" : "not-show"}>
          로딩중.. 기다려
        </span>
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
              <input
                {...getInputProps({ placeholder: "Type address" })}
                endAdornment={
                  <IconButton position="end">
                    {" "}
                    type="button" sx={{ p: "10px" }} aria-label="search">
                    <GpsFixedIcon onClick={findMyLocation} />
                  </IconButton>
                }
              />
              <p>Latitude: {coordinates.lat}</p>
              <p>Longitude: {coordinates.lng}</p>

              <div classNAme="auto-list">
                {loading ? <div>...loading</div> : null}
                {suggestions.map((suggestion) => {
                  const style = {
                    // 선택되면
                    backgroundColor: suggestion.active ? "#41b6e6" : "",
                  };

                  return (
                    <div
                      key={suggestion.description}
                      {...getSuggestionItemProps(suggestion, { style })}
                    >
                      {suggestion.description}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
        date: {dateValue}
        <br></br>
        time: {timeValue}
        <br></br>
        {when}
        <DatePicker
          disableFuture
          onChange={(value) => {
            console.log(value.format("YYYY-MM-DD"));
            setDateValue(value.format("YYYY-MM-DD"));
          }}
          mask="____-__-__"
          format="YYYY-MM-DD"
          value={dateValue}
          label="Birthday"
        />
        <br></br>
        <TimePicker
          onChange={(value) => {
            console.log(value.format("HH:MM"));
            setTimeValue(value.format("HH:MM"));
          }}
          ampm={false}
          value={timeValue}
          label="Birth Time"
        />
        <br></br>
        <button type="submit" onClick={handleSubmit}>
          submit
        </button>
      </FormControl>
    </LocalizationProvider>
  );
}
