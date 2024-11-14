import React, { useState } from "react";
import { Divider } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import "./styles.css";

function RegisterForm({ onLogin }) {
    const [loginName, setLoginName] = useState("");
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [occupation, setOccupation] = useState("");

    const [passwordA, setPasswordA] = useState("");
    const [passwordB, setPasswordB] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            onLogin({
                loginName: loginName,
                passwordA: passwordA,
                passwordB: passwordB,
                name: name,
                location: location,
                occupation: occupation
            });
        } catch (err) {
            setError(`Login failed. ${err.message}`);
            console.log(err);
        }
    };

    return (
        <>
            <div className="register-form">
                <h2>Create an Account</h2>
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
                            value={passwordA}
                            onChange={(e) => setPasswordA(e.target.value)}
                            required
                        />
                        Re-enter Password:
                        <input
                            type="password"
                            value={passwordB}
                            onChange={(e) => setPasswordB(e.target.value)}
                            required
                        />
                        <Divider />
                        Name:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        Location:
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        Description:
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        Occupation:
                        <input
                            type="text"
                            value={occupation}
                            onChange={(e) => setOccupation(e.target.value)}
                        />
                    </label>
                    <button type="submit">Register Me</button>
                    {error && <p className="error">{error}</p>}
                </form>
            </div>
            <div className="account-link">
                <Link to="/loginView">I already have an account</Link>
            </div>
        </>
    );
}

export default RegisterForm;
