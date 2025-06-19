import Login from "./page/loginPage/Login"
import { Routes, Route } from "react-router-dom";
import SignUp from "./page/regestration/SignUp";
function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  )
}

export default App
