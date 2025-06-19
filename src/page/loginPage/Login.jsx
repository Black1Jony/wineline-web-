import './logincss.css';
import { Form, Input, Button, Checkbox } from "antd";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  return (
    <>
      <div className="min-h-screen min-w-full flex items-center justify-center bg-[radial-gradient(circle_at_center,_#ff5e5e_0%,#b91c1c_30%,#7f1d1d_70%,#450a0a_100%)]">
        <div className="bg-[#9d1a1a]/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-[#ef4444]/30 w-[90%] flex flex-col items-center min-h-[450px] 2xl:w-[25%] xl:w-[32%] lg:w-[37%] md:w-[56%] sm:w-[70%]">
          <h1 className="text-3xl font-extrabold text-center text-white mb-8 font-mono tracking-wider">
            wineLIne
          </h1>

          <Form
            name="login_form"
            initialValues={{ remember: true }}
            layout="vertical"
            className="w-full"
          >
            <Form.Item
              label={
                <span className="text-white/80 text-sm font-medium">
                  Username
                </span>
              }
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                className="bg-[#7f1d1d]/50 border-[#ef4444]/30 hover:border-[#ef4444]/50 text-white placeholder-white/50 rounded-lg h-10"
                placeholder="Enter your username"
                onChange={(e) => setUsername(e.target.value)}
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
              ]}
            >
              <Input.Password
                className="bg-[#7f1d1d]/50 border-[#ef4444]/30 hover:border-[#ef4444]/50 text-white placeholder-white/50 rounded-lg h-10"
                placeholder="Enter your password"
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" className="mb-6 flex items-center">
              <Checkbox className="[&>span]:text-white/80 [&>span:hover]:text-white">
                Remember me
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-gradient-to-r from-[#ef4444] to-[#b91c1c] hover:from-[#dc2626] hover:to-[#991b1b] text-white font-medium h-10 rounded-lg shadow-md transition-all duration-300 border-none"
              >
                Sign In
              </Button>
            </Form.Item>

            <div className="text-center mt-4">
              <span
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Forgot password?
              </span>
            </div>
          </Form>

          <div className="mt-8 text-white/60 text-xs">
            Don't have an account?{" "}
           <span className="text-white/80 hover:text-white font-medium " onClick={()=> navigate('/signup')}>
              Sign up
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
