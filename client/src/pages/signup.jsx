import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css"

export default function SignUp({ showLoader, hideLoader }) {

    let navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState("");
    const [waitMess, setWaitMess] = useState("");

    // Use effect to hide the message after 10 seconds
    useEffect(() => {
        const elem = document.getElementById("errorMess");
        elem.style.visibility = "visible";
        elem.style.opacity = "1";
        setTimeout(() => {
            elem.style.visibility = "hidden";
            elem.style.opacity = "0";
            setErrorMessage("");
        }, 10000);
    }, [errorMessage])

    const [formData, setFormData] = useState({
        userName: "",
        userPass: "",
        confirmPass: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const togglePassword = () => {
        const passInp = document.getElementById("confirmPass");
        if (passInp.type === "password") {
            passInp.type = "text"
        } else if (passInp.type === "text") {
            passInp.type = "password";
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setWaitMess("Please wait...")
        fetch("/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                // Handle the response from the server
                if (data.status === "success") {
                    setWaitMess("User successfully created!")
                    setTimeout(() => {
                        navigate('/login')
                    }, 2000);
                } else if (data.status === "failure") {
                    setWaitMess("")
                    setErrorMessage(data.message)
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };
    return (
        <section id="login-section">
            <form onSubmit={handleSubmit} className="loggin-wrapper-form">
                <div className="login-wrapper">
                    <h2 className="signIn">Sign Up</h2>
                    <span id="errorMess">{errorMessage}</span>
                    <span>{waitMess}</span>
                    <input type="text" name="userName" id="userName" placeholder="Email" onChange={handleChange} />
                    <input type="password" name="userPass" id="userPass" placeholder="Password" onChange={handleChange} />
                    <input type="password" name="confirmPass" id="confirmPass" placeholder="Confirm Password" onChange={handleChange} />
                    <div><input type="checkbox" name="showPass" onClick={togglePassword} /> Show Password</div>
                    <button type="submit" id="login-btn">Sign Up</button>
                    <p><span className="new-txt">Already have an Account?</span> <a href="/login">Login</a></p>
                </div>
            </form>
        </section>
    )
}