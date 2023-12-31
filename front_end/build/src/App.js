import React, { useEffect, useState } from 'react';
import './App.css';
import Form from './components/form.js';
import earth from './assets/earth.png';


export default function App() {
  const [img64, setimg64] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [coordinates, setCoordinates] = React.useState({
    lat: null,
    lng: null
  });
  const handleSelect = async value => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setAddress(value);
    setCoordinates(latLng);
  };
  

  const [show, setShow] = React.useState(false);
  console.log(show)
  const findMyLocation = () => {
    setShow(true)
    console.log('findmylocation 시작')
    console.log(navigator.geolocation)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log(pos)
        setShow(false)
        setCoordinates(pos)

      })
    } else {
      console.log("현재 위치를 가져올 수 없음")
    }
  }


  const [dateValue, setDateValue] = React.useState('')

  const handleDate = (event) => {
    setDateValue(event.target.value)
    console.log('date:', dateValue)
  }




  const handleSubmit = (e) => {
    e.preventDefault();
    
    const when = dateValue+''+timeValue
    const formData = new FormData();
    formData.append('lat', coordinates.lat);
    formData.append('lon', coordinates.lng);
    formData.append('when', when);
    axios({
      method:'get',
      url:'http://43.202.12.99/api/v1/get_sky/',
      data: formData,
      responseType: 'arraybuffer'
    })
    .then((response)=>{
      console.log('요청성공');
      const buffer64 = Buffer.from(response.data,'binary').toString('base64')
      console.log(buffer64)
      setimg64(buffer64)
  }).catch(err => {
        console.log(err)
    });
  }
  
  return (
    <div className="App">
      <form>
      <button type="button" onClick={findMyLocation}>현재위치 가져오기</button>
      <span name="loading" className={show ? "show" : "notshow"}>로딩중.. 기다려</span>
      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <p>Latitude: {coordinates.lat}</p>
            <p>Longitude: {coordinates.lng}</p>

            <input {...getInputProps({ placeholder: "Type address" })} />

            <div>
              {loading ? <div>...loading</div> : null}

              {suggestions.map(suggestion => {
                const style = {
                  // 선택되면
                  backgroundColor: suggestion.active ? "#41b6e6" : "#fff"
                };

                return (
                  <div {...getSuggestionItemProps(suggestion, { style })}>
                    {suggestion.description}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
      <input type="date" onChange={handleDate}/>
      date: {dateValue}
      <br></br>
      <input type="time" onChange={handleTime}/>
      time: {timeValue}
      <br>
      </br>
      {when}
      <button type="submit" onClick={handleSubmit}>submit</button>
      </form>
      {img64 != null && <img src = {`data:image;base64,${img64}`} alt="" />}


    </div>
  );
}
