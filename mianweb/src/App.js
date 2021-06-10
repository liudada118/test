import logo from './logo.svg';
import './App.css';
import React, { Component,useState } from 'react'


function App() {
  const [deviceId , setDeviceID] = useState('')
  const fetchData = () => {
    
  }
  return (
    <div className="App">
     <input type="text" name="" id="" value={deviceId} onChange={(e) => {setDeviceID(e.target.value)}}/>
     <button onClick={()=> {fetchData()} } >请求</button>
     <button>删除</button>
    </div>
  );
}

export default App;
