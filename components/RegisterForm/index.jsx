import React, { useState } from "react";
import axios from "axios";
//import "./styles.css";

function LoginForm({ onLogin }) {
    //const [loginName, setLoginName] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            onLogin(loginName);
        } catch (err) {
            setError("Login failed. Please check your login name.");
            console.log(err);
        }
    };

    return (
        <div className="register-form">
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
                </label>
                <button type="submit">Submit</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
}

export default LoginForm;
