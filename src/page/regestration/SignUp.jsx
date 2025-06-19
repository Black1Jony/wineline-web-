import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  return (
    <>
      <div className="min-h-screen min-w-full flex items-center justify-center bg-[radial-gradient(circle_at_center,_#ff5e5e_0%,#b91c1c_30%,#7f1d1d_70%,#450a0a_100%)]">
        <div className="bg-[#9d1a1a]/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-[#ef4444]/30 w-[90%] flex flex-col items-center min-h-[400px]  2xl:w-[25%] xl:w-[32%] lg:w-[37%] md:w-[56%] sm:w-[70%]">
          <h1 className="text-3xl font-extrabold text-center text-white mb-8 font-mono tracking-wider">
            wineLIne
          </h1>

          <Form
            name="register_form"
            initialValues={{ remember: true }}
            layout="vertical"
            className="w-full"
          >
            <Form.Item
              label={
                <span className="text-white/80 text-sm font-medium">
                  Full Name
                </span>
              }
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
              
            >
              <Input
                className="bg-[#7f1d1d]/50 border-[#ef4444]/30 hover:border-[#ef4444]/50 text-white placeholder-white/50 rounded-lg h-10"
                placeholder="Enter your full name"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-white/80 text-sm font-medium">Email</span>
              }
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                className="bg-[#7f1d1d]/50 border-[#ef4444]/30 hover:border-[#ef4444]/50 text-white placeholder-white/50 rounded-lg h-10"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-white/80 text-sm font-medium">
                  Password
                </span>
              }
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
            >
              <Input.Password
                className="bg-[#7f1d1d]/50 border-[#ef4444]/30 hover:border-[#ef4444]/50 text-white placeholder-white/50 rounded-lg h-10"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-white/80 text-sm font-medium">
                  Confirm Password
                </span>
              }
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                className="bg-[#7f1d1d]/50 border-[#ef4444]/30 hover:border-[#ef4444]/50 text-white placeholder-white/50 rounded-lg h-10"
                placeholder="Confirm your password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-gradient-to-r from-[#ef4444] to-[#b91c1c] hover:from-[#dc2626] hover:to-[#991b1b] text-white font-medium h-14 rounded-lg shadow-md transition-all  duration-300 border-none"
              >
                зарегистрироваться
              </Button>
            </Form.Item>
          </Form>

          <div className="mt-8 text-white/60 text-xs">
            уже есть аккаунт?
            <span
              onClick={() => navigate("/")}
              className="text-white/80 hover:text-white font-medium"
            >
              войти
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
