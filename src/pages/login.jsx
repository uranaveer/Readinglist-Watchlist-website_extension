import {Link} from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";

const Linkstyle ={
  textDecoration: "none",
  color:"blue"
}

function Login() {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    setToken("this is a test token");
    navigate("/", { replace: true });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-80 space-y-2">
        <label htmlFor="username" className="text-sm font-medium text-gray-700">Username / Email</label>
        <input
          type="text"
          placeholder="username / abc@xyz.com"
          className="w-full px-4 py-2 border rounded"
        />
        <label htmlFor="username" className="text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded"
        />
        <button onClick = {handleLogin}
          id="login_button"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
        <p>Don't have an account? <Link to="/sign_up" style={Linkstyle}>Sign up</Link></p>
        
      </div>
    </div>
  );
}


export default Login;
