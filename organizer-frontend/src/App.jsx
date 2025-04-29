//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
//import './App.css'

//export default function App() {
//const [count, setCount] = useState(0)

//return (
//<>
//  <div>
//    <a href="https://vite.dev" target="_blank">
//      <img src={viteLogo} className="logo" alt="Vite logo" />
//    </a>
//    <a href="https://react.dev" target="_blank">
//      <img src={reactLogo} className="logo react" alt="React logo" />
//    </a>
//  </div>
//  <h1>Vite + React</h1>
//  <div className="card">
//    <button onClick={() => setCount((count) => count + 1)}>
//      count is {count}
//    </button>
//    <p>
//      Edit <code>src/App.jsx</code> and save to test HMR
//    </p>
//  </div>
//  <p className="read-the-docs">
//    Click on the Vite and React logos to learn more
//  </p>
//</>
//)
//}



import './App.css';
import React from "react";
import imgcr from "./create.jpg";
import img from "./img.jpg";
import img2 from "./img2.jpg";
import img3 from "./img3.jpg";
import logoimg from "./logo.png";

const EventBox = ({ imgg, text }) => {
    return (
        <div style={{
            width: "300px",
            height: "400px",
            background: "#87D2A7",
            //border: "2px solid gray",
            borderRadius: "40px",
            margin: "40px",
            color: "black"
        }}>

            <img alt="it sucks((" src={imgg} style={{
                width: "300px",
                height: "300px",
                borderRadius: "38px 38px 0px 0px"
            }} />
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}> {text}</div>
        </div>
    );
};
export default function App() {

    return (
        <><header><img className="logoimg" src={logoimg}></img>Оборот           событий</header>
            
        <div style={{ display: "flex" }}>
            
            <EventBox imgg={imgcr} text="создать мероприятие" />
            <EventBox imgg={img} text="одно крутое мероприятие"  />
            <EventBox imgg={img2} text="второе крутое мероприятие" />
            <EventBox imgg={img3} text="еще одно мероприятие" />
            </div>
        </>
    );
}

