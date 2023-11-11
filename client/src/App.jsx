import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css"
import Details from './pages/details';
import Home from './pages/home';
import Login from './pages/login';
import Search from './pages/search';
import SignUp from './pages/signup';
import MyList from "./pages/MyList";

export default function App({ hideLoader, showLoader }) {

    useEffect(hideLoader, []);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login showLoader={showLoader} hideLoader={hideLoader} />} />
                <Route path="/signup" element={<SignUp showLoader={showLoader} hideLoader={hideLoader} />} />
                <Route path="/search" element={<Search showLoader={showLoader} hideLoader={hideLoader} />} />
                <Route path="/movie/:id" element={<Details showLoader={showLoader} hideLoader={hideLoader} />} />
                <Route path="/home" element={<Home showLoader={showLoader} hideLoader={hideLoader} />} />
                <Route path="/" element={<Home showLoader={showLoader} hideLoader={hideLoader} />} />
                <Route path="/MyList" element={<MyList showLoader={showLoader} hideLoader={hideLoader} />} />
            </Routes>
        </Router>

    )
}