import Header from "../../components/Header/Header";
import { useState } from "react";
import Users from "../../components/AdminComponents/users/Users";
import Footer from "../../components/Footer/Footer";
import AdminDeleteTovars from "../../components/AdminComponents/Tovars/adminDeleteTovars";
import Add from "../../components/AdminComponents/Add/Add";
import AddEvents from "../../components/AdminComponents/AddEvents/AddEvents";
import { useEffect } from "react";
import axios from "axios";
const AdminPage = () => {
  const [currentOperation, setCurrentOperation] = useState("Пользовтели");
  const categories = ["Пользовтели", "товары", "Добавить товары", "Добавить мероптиятие"];
  useEffect(()=>{
    const user = localStorage.getItem('user')
    if(!user) window.location.pathname = "/";
    const isAdmin = async()=>{
     const resp = await axios.get(`http://localhost:3000/users/${user}`);
     if(resp.data.role !== 'admin' ) window.location.pathname = '/'
    }
    isAdmin()
  }, [])
  return (
    <>
      <Header show={true} />
      <div className="flex flex-col gap-8 w-[92%] self-center justify-self-center font-Arial mt-[20vh]">
        <div className="w-full flex flex-col gap-8 hide-scrollbar md:flex-row">
          {categories.map((i, ind) => (
            <h1
              className={`text-xl cursor-pointer   scale-y-110 font-Arial !font-semibold ${
                currentOperation == i ? "text-[#c42222]" : "text-[#0f0f0f]"
              }`}
              key={ind}
              onClick={() => setCurrentOperation(i)}
            >
              {i}
            </h1>
          ))}
        </div>
        <div className="w-full min-h-[75vh]">
          {currentOperation === "Пользовтели" && <Users />}
          {currentOperation === "товары" && <AdminDeleteTovars />}
          {currentOperation === "Добавить товары" && <Add />}
          {currentOperation === "Добавить мероптиятие" && <AddEvents/>}
        </div>
      </div>
      <Footer />
    </>
  );
};


export default AdminPage;
