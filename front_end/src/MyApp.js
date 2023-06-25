import logo from './Mylogo.svg';
import './App.css';
import React from 'react';

function MyApp() {
  const today = new Date(); 
  const year = today.getFullYear();
  const month = String(today.getMonth()+1).padStart(2,0); // getMonth()는 0~11의 숫자로 해당 월을 반환 
  const day = String(today.getDate()).padStart(2,0);
  const formattedDate = `${year}-${month}-${day}`;
  const [userDate, setDate] = React.useState(formattedDate); // userDate의 초기값을 formmatedDate로 설정
  const [loading, setLoading] = React.useState(false)
  const onChange = (event) =>{
    console.log(event.target.value)
    setDate(event.target.value) // input value 변화에 반응하여 userDate value를 갱신
  }
  const pushDate = async () => {
    setLoading(true) // 응답 대기화면 호출
    console.log(userDate)
    const json = await (await fetch(
      `http://15.165.203.238/api/v2/`,
      {userDate}
      )).json()
    console.log(json)
    setLoading(false)
    }
    return (
    <div className="App">
      {loading ? <h1>Loading...</h1> : null}
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          날짜 정보를 입력하세요.
        </p>
        <input
          value={userDate}
          placeholder='yyyy-mm-dd'
          onChange={onChange}
        />
        <button
          className="App-link"
          onClick={()=>{pushDate()}}
        >
          {userDate}
        </button>
      </header>
    </div>
  );
}

export default MyApp;
