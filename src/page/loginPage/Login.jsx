import { useState, useEffect } from "react";
import "./logincss.css";
import { useNavigate } from "react-router-dom";
import {
  registerWithEmail,
  loginWithEmail,
} from "../../utils/firebase/auth/loginAuth";
import {
  signInWithGoogle,
  signInWithGitHub,
} from "../../utils/firebase/auth/signWithprovider";
import { FaGithub } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { message } from "antd";
export default function LoginPage() {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage()
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const token = localStorage.getItem("token");
  
  const navigate = useNavigate();
useEffect(() => {
  if (token) {
    navigate("/");
   
  }
  
}, []);
  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginWithEmail(email, password);
      if (res !== "error" && res !== "errorData") {
        localStorage.setItem("token", res.accessToken);
        navigate("/");
      } else {
        setError("Неверный email или пароль");
      }
    } catch (err) {
      setError("Ошибка при входе");
      console.log(err);
      
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== repeatPassword) {
      setError("Пароли не совпадают");
      setLoading(false);
      return;
    }

    try {
      const res = await registerWithEmail(
        email,
        password,
        repeatPassword,
        name
      );
      if (res !== "error" && res !== "errorData") {
        localStorage.setItem("token", res.accessToken);
        navigate("/");
      } else {
        setError("Ошибка при регистрации");
      }
    } catch (err) {
      setError("Ошибка при регистрации");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const messageAlreadyHAveAccount = ()=>{
    messageApi.open(
    {
      type: 'error',
      content: 'Уже есть аккаунт',
    }
    )
  }
  return (
    <>
      {contextHolder}
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-side gradient-bg">
            <h2>Добро пожаловать!</h2>
            <p>Войдите или зарегистрируйтесь для доступа к сервису.</p>
            <div className="social-buttons">
              <FaGoogle 
               className="w-12 h-12"
                onClick={async () => {
                  const result = await signInWithGoogle();

                  if (result.success) {
                    localStorage.setItem("token", result.token);
                    navigate("/");
                  } else if (
                    result.error?.code ===
                    "auth/account-exists-with-different-credential"
                  ) {
                    setError(
                      "Учетная запись уже существует с другим способом входа"
                    );
                  } else {
                    setError("Ошибка входа через Google");
                  }
                }}
              />
              <FaGithub
                className="w-12 h-12"
                onClick={async () => {
                  const result = await signInWithGitHub();

                  if (result.success) {
                    localStorage.setItem("token", result.token);
                    navigate("/");
                  } else if (result.conflict) {
                    setError(
                      "Учетная запись уже существует с другим способом входа"
                    );
                  } else {
                    setError("Ошибка входа через GitHub");
                  }
                }}
              />
            </div>
          </div>

          <div className="auth-form-container justify-center items-center">
            <div className={`form-toggle ${isLoginForm ? "" : "flipped"}`}>
              <div className="form-front mt-13">
                <h2>Вход в аккаунт</h2>
                {error && <div className="error-message">{error}</div>}

                <form className="auth-form" onSubmit={handleLogin}>
                  <div className="input-group">
                    <i className="fas fa-envelope"></i>
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <i className="fas fa-lock"></i>
                    <input
                      type="password"
                      placeholder="Пароль"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="form-options">
                    <label>
                      <input type="checkbox" /> Запомнить меня
                    </label>
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
                {error && <div className="error-message">{error}</div>}

                <form className="auth-form" onSubmit={handleRegister}>
                  <div className="input-group">
                    <i className="fas fa-user"></i>
                    <input
                      type="text"
                      placeholder="Имя"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <i className="fas fa-envelope"></i>
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <i className="fas fa-lock"></i>
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
                    <i className="fas fa-lock"></i>
                    <input
                      type="password"
                      placeholder="Повторите пароль"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      minLength={6}
                    />
                  </div>

                  <label className="terms-checkbox">
                    <input type="checkbox" required />Я согласен с{" "}
                    <button type="button" className="text-link">
                      условиями
                    </button>
                  </label>

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
