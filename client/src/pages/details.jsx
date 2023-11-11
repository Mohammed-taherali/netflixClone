import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MyNavbar from "../components/MyNavbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Alert from "../components/Alert";
import "./details.css"

export default function Details({ showLoader, hideLoader }) {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [alertVisible, setAlertVisible] = useState({
        show: false,
        message: "Movie already present",
        type: "warning"
    })
    let movieData = [state.movie];
    let relMovies = state.relMovies;
    let relMovieDiv = [];
    const base_path = import.meta.env.VITE_BACKDROP_URL;

    useEffect(() => {
        document.getElementById("moviePage").classList.add("active")
    }, [])

    const goToMovie = (movie) => {
        const requestBody = {
            movieId: movie.id
        };
        let movieInfo = {
            movie: movie
        }

        fetch("/api/insertNewMovie", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(movieInfo)
        })
            .then(resp => resp.json())
            .then(respVal => {
                if (respVal.status == "failure") {
                    navigate("/login")
                }
                if (respVal.resp) {
                    fetch("/api/getRelatedMovies", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(requestBody)
                    })
                        .then(resp => resp.json())
                        .then(data => {
                            if (data.status == "failure") {
                                navigate("/login")
                            } else {
                                navigate(`/movie/${movie.id}`, { state: { movie: movie, relMovies: data.movies } })
                            }
                        })
                }
            })
    }

    const addToMyList = (movie, btnId) => {
        let reqBody = { movie: movie }
        fetch("/api/addToMyList", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
        })
            .then(resp => resp.json())
            .then(data => {
                console.log("mylist status: ", data);
                if (data.status == "inserted") {
                    setAlertVisible({
                        show: true,
                        message: data.message,
                        type: "success"
                    })
                } else if (data.status == "present") {
                    setAlertVisible({
                        show: true,
                        message: data.message,
                        type: "warning"
                    })
                }
                $(`#${btnId}`).text("Added");
                setTimeout(() => {
                    setAlertVisible({
                        show: false,
                        message: "",
                        type: "warning"
                    })
                }, 5000);
            })
            .catch(err => { console.log(err); })
    }

    function createRelatedMovies(movies) {
        let okMovies = movies.filter((movie) => movie.backdrop_path != null)
        okMovies = okMovies.slice(0, 16)
        relMovieDiv = okMovies.map(movie => {
            let bgImg = base_path + movie.backdrop_path;
            if (movie.backdrop_path != null) {

                return (
                    <div key={movie.id} className="relMovieDiv" onClick={() => goToMovie(movie)} title={movie.title}>
                        <img src={bgImg} alt={movie.title} className="relImg" />
                    </div>
                )
            }
        })
    }

    createRelatedMovies(relMovies)

    const movieDiv = movieData.map(movie => {
        let bgImg = base_path + movie.backdrop_path;
        return (
            <div key={movie.id}>
                <div className="movieCont" style={{ backgroundImage: `url(${bgImg})` }}>
                    <div className="innerDiv">
                        <div className="overview-div">
                            <h2>{movie.title}</h2>
                            <button style={{ width: "25%" }} id={`btn${movie.id}`} className="btns" onClick={() => addToMyList(movie, `btn${movie.id}`)}><FontAwesomeIcon icon={faPlus} /> MyList</button>
                            <div className="btns-div">
                                <h5>{movie.release_date.split("-")[0]}</h5>
                            </div>
                            <div>{movie.overview}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    })
    return (
        <>
            <MyNavbar />
            {alertVisible.show && <Alert message={alertVisible.message} type={alertVisible.type} />}
            <section className="detail-section">
                {movieDiv}
                {relMovieDiv && <h3 className="relTop">Top Picks for You</h3>}
                <div className="grid-container">
                    {relMovieDiv}
                </div>
            </section>
        </>
    )
}