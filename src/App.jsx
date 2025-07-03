import Login from "./page/loginPage/Login"
import { Routes, Route } from "react-router-dom";
import SignUp from "./page/regestration/SignUp";
import MainPage from "./page/mainPages/main/MainPage";
function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage/>}/>

      </Routes>
    </>
  )
}

export default App
