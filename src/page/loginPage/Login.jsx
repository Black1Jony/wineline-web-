import { useState, useEffect } from "react";
import "./logincss.css";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { message } from "antd";
import axios from "axios";

export default function LoginPage() {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      messageApi.info("Вы уже авторизованы");
      navigate("/");
    }
  }, []);

  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/signIn", {
        email,
        password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", res.data.id);
        messageApi.success("Вход выполнен");
        navigate("/");
      }
    } catch (err) {
      messageApi.error(err.response?.data?.message || "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== repeatPassword) {
      messageApi.error("Пароли не совпадают");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/signUp", {
        name,
        email,
        password,
      });

      if (res.data.user?.token) {
        localStorage.setItem("token", res.data.user.token);
        localStorage.setItem("user", res.data.user.id);
        messageApi.success("Регистрация успешна");
        navigate("/");
      }
    } catch (err) {
      messageApi.error(err.response?.data?.message || "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-side gradient-bg">
            <h2>Добро пожаловать!</h2>
            <p>Войдите или зарегистрируйтесь для доступа к сервису.</p>
            <div className="social-buttons">
              <button className="w-full rounded-2xl bg-orange-400 text-center p-1 h-10" onClick={()=> navigate('/')}>
                вернутся на главную
              </button>
            </div>
          </div>

          <div className="auth-form-container justify-center items-center">
            <div className={`form-toggle ${isLoginForm ? "" : "flipped"}`}>
              <div className="form-front mt-13">
                <h2>Вход в аккаунт</h2>
                <form className="auth-form" onSubmit={handleLogin}>
                  <div className="input-group">
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="password"
                      placeholder="Пароль"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={loading}
                  >
                    {loading ? "Загрузка..." : "Войти"}
                  </button>
                  <p className="form-switch">
                    Нет аккаунта?{" "}
                    <button
                      type="button"
                      onClick={toggleForm}
                      className="text-link"
                    >
                      Зарегистрироваться
                    </button>
                  </p>
                </form>
              </div>

              <div className="form-back">
                <h2>Создать аккаунт</h2>
                <form className="auth-form" onSubmit={handleRegister}>
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Имя"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="password"
                      placeholder="Пароль"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="password"
                      placeholder="Повторите пароль"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      minLength={6}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={loading}
                  >
                    {loading ? "Загрузка..." : "Зарегистрироваться"}
                  </button>
                  <p className="form-switch">
                    Уже есть аккаунт?{" "}
                    <button
                      type="button"
                      onClick={toggleForm}
                      className="text-link"
                    >
                      Войти
                    </button>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
