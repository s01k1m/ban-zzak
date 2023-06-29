import React from "react";
import './App.css'
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";

export default function App() {
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
      <input type="date" />
      <br></br>
      <input type="time" />
      <button type="submit">submit</button>
      </form>
    </div>
  );
}
