import React from 'react'
import { Routes, Route } from "react-router-dom";
// import PlayMe from "./PlayMe";
import './style.css';
// import Home from "./Home";

import LandingPage from "./LandingPage";
import HeroNftMarketPlace from './HeroNftMarketPlace';
import HomeBase from './HomeBase';
import ResourceMap from './ResourceMap';

const App = () => {
  return (
    <Routes>

          <Route path="/" element={<LandingPage />} />
          <Route path="/hero-NFT-marketPlace" element={<HeroNftMarketPlace />} />
        

          <Route path="/home-base" element={<HomeBase />}/>
          <Route path="/resource-map" element={<ResourceMap />}/>
        </Routes>
  )
}

export default App
