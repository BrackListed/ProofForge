import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Scrutinizer } from "./pages/Scrutinizer";
import { Home } from "./pages/Home";
import { Intermission } from "./pages/Intermission";
import { Debate } from "./pages/Debate";
import { Risk } from "./pages/Risk";

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path = "/" element={<Home/>}/>
        <Route path = "/scrutinize" element={<Scrutinizer/>}></Route>
        <Route path = "/intermission" element={<Intermission/>}></Route>
        <Route path = "/debate" element={<Debate/>}/>
        <Route path = "/risk" element={<Risk/>}/>
      </Routes>
    </BrowserRouter>
  )
}