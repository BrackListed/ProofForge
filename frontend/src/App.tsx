import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Scrutinizer } from "./pages/Scrutinizer";
import { Home } from "./pages/Home";
import { Intermission } from "./pages/Intermission";

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path = "/" element={<Home/>}/>
        <Route path = "/scrutinize" element={<Scrutinizer/>}></Route>
        <Route path = "/intermission" element={<Intermission/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}