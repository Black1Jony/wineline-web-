import Header from "../../components/Header/Header";
import { useState } from "react";
import Users from "../../components/AdminComponents/users/Users";
import Footer from "../../components/Footer/Footer";
import AdminDeleteTovars from "../../components/AdminComponents/Tovars/adminDeleteTovars";
import Add from "../../components/AdminComponents/Add/Add";
import AddEvents from "../../components/AdminComponents/AddEvents/AddEvents";
import { useEffect } from "react";
import api from "../../utils/api";

const AdminPage = () => {
  const [currentOperation, setCurrentOperation] = useState("Пользовтели");
  const [loading, setLoading] = useState(true); // Add loading state
  const categories = ["Пользовтели", "товары", "Добавить товары", "Добавить мероптиятие"];

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      window.location.pathname = "/";
      return;
    }

    let isMounted = true;

    const isAdmin = async () => {
      try {
        const resp = await api.get(`/users/${user}`);
        if (isMounted) {
          if (resp.data.role !== "admin") {
            window.location.pathname = "/";
          } else {
            setLoading(false); 
          }
        }
      } catch (error) {
        console.error("Error verifying admin:", error);
        if (isMounted) {
          window.location.pathname = "/";
        }
      }
    };

    isAdmin();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while checking
  }

  return (
    <>
      <Header show={true} />
      <div className="flex flex-col gap-8 w-[92%] self-center justify-self-center font-Arial mt-[20vh]">
        <div className="w-full flex flex-col gap-8 hide-scrollbar md:flex-row">
          {categories.map((i) => (
            <h1
              className={`text-xl cursor-pointer scale-y-110 font-Arial !font-semibold ${
                currentOperation === i ? "text-[#c42222]" : "text-[#0f0f0f]"
              }`}
              key={i}
              onClick={() => setCurrentOperation(i)}
            >
              {i}
            </h1>
          ))}
        </div>
        <div className="w-full min-h-[75vh]">
          <div className="w-full min-h-[75vh]">
            {
              {
                Пользовтели: <Users />,
                товары: <AdminDeleteTovars />,
                "Добавить товары": <Add />,
                "Добавить мероптиятие": <AddEvents />,
              }[currentOperation]
            }
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminPage;
