import logo from "../logo.svg";
import { useAuth } from "../contexts/auth";
import { useNavigate, Navigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const onClickLogin = async () => {
    await login(() => navigate("/"))
  }

  return (
    user
      ? <Navigate to="/" replace />
      : (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>You haven't login yet. Login to see your account details.</p>
            <button className="App-link" onClick={onClickLogin}>
              Login
            </button>
          </header>
        </div>
      )
  );
}

export default Login