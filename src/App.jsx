import Login from "./page/loginPage/Login"
import { Routes, Route } from "react-router-dom";

import MainPage from "./page/mainPages/main/MainPage";
import LoginPage from "./page/loginPage/Login";
function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage/>}/>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  )
}

export default App
