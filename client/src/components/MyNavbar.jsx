import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "./Navbar.css";
import netflixLogo from "/Netflix.svg"

export default function MyNavbar() {
    let navigate = useNavigate();

    function logoutUser() {
        fetch("/api/logout", {
            method: "POST",
            body: {},
        })
            .then((response) => response.json())
            .then(resp => {
                if (resp.status === "success") {
                    navigate("/login");
                }
            })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        var searchVal = document.getElementById("search").value.replace(/ /g, '+');
        navigate(`/search?query=${searchVal}`);
    };

    return (
        <>
            <Navbar expand="lg" className="fixed-top navbar custom-bg">
                <Navbar.Brand href="#home" className="navbar__logo"><img src={netflixLogo} alt="Netflix Logo" /></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="tcolor" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink id="homePage" className="nav-link" to="/home">Home</NavLink>
                        <NavLink id="moviePage" className="nav-link" to="/">Movies</NavLink>
                        <NavLink id="myListPage" className="nav-link" to="/MyList">My List</NavLink>
                    </Nav>
                    <Nav className="second-nav">
                        <div className="navbar__search">
                            <form action="" onSubmit={handleSubmit}>
                                <input type="text" placeholder="Search" name="search" id="search" autoComplete="off" />
                            </form>
                        </div>
                        <img src="/Netflix-avatar.png" className="userIcon" alt="avatar" />
                        <NavDropdown title="" id="basic-nav-dropdown" style={{}}>
                            <NavDropdown.Item onClick={() => logoutUser()}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    )
}