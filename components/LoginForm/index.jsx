import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";

function LoginForm({ onLogin }) {
    const [loginName, setLoginName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            onLogin(loginName, password);
        } catch (err) {
            setError("Login failed. Please check your login name.");
            console.log(err);
        }
    };

    return (
        <>
            <div className="login-form">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Login Name:
                        <input
                            type="text"
                            value={loginName}
                            onChange={(e) => setLoginName(e.target.value)}
                            required
                        />
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Submit</button>
                    {error && <p className="error">{error}</p>}
                </form>
            </div>
            <div className="account-link">
                <Link to="/registerView">I don&apos;t have an account</Link>
            </div>
        </>
    );
}

export default LoginForm;
