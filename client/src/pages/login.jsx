import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css"
import netflixLogo from "/Netflix.svg"

export default function Login({ showLoader, hideLoader }) {
    let navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    // Use effect to hide the message after some time
    useEffect(() => {
        const elem = document.getElementById("errorMess");
        elem.style.visibility = "visible";
        elem.style.opacity = "1";
        setTimeout(() => {
            elem.innerHTML = "";
            elem.style.visibility = "hidden";
            elem.style.opacity = "0";
        }, 10000);
    }, [errorMessage])

    const [formData, setFormData] = useState({
        userEmail: "",
        userPass: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        showLoader();
        fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                hideLoader();
                if (data.status === "success") {
                    navigate('/home')
                } else if (data.status === "failure") {
                    setErrorMessage(data.message)
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };
    return (
        <section id="login-section">
            <div className="N-logo">
                <img src={netflixLogo} className="logo-img" alt="Netflix Logo" />
            </div>
            <form onSubmit={handleSubmit} className="loggin-wrapper-form">
                <div className="login-wrapper">
                    <h2 className="signIn">Sign In</h2>
                    <span id="errorMess">{errorMessage}</span>
                    <input type="text" name="userEmail" id="userEmail" placeholder="Email" onChange={handleChange} />
                    <input type="password" name="userPass" id="userPass" placeholder="Password" onChange={handleChange} />
                    <button type="submit" id="login-btn">Sign In</button>
                    <p><span className="new-txt">New to Netflix?</span> <a href="/signup">Sign Up Now</a></p>
                </div>
            </form>
        </section>
    )
}