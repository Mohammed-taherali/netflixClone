import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyNavbar from "../components/MyNavbar";
import "./MyList.css";

export default function MyList() {
    const navigate = useNavigate();
    const [listDiv, setListDiv] = useState([]);

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
                console.log(respVal);
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

    const createDivs = (movies) => {
        const base_path = import.meta.env.VITE_BACKDROP_URL;
        const movieDivs = movies.map((movie) => {
            const bgImg = base_path + movie.backdrop_path;
            return (
                <div key={movie.id} className="list-div">
                    <img title={movie.title} onClick={() => goToMovie(movie)} className="listImg" src={bgImg} alt="" />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <h4>{movie.title}</h4>
                        <p>
                            {movie.overview}
                        </p>
                    </div>
                </div>
            );
        });
        setListDiv(movieDivs);
    };

    useEffect(() => {
        fetch("/api/getMyList", {
            method: "POST",
            body: {},
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.status === "failure") {
                    navigate("/login");
                } else {
                    createDivs(data.data);
                }
            });
    }, []);

    return (
        <>
            <MyNavbar />
            <section id="list-section">
                <b style={{ fontSize: "3em" }}>My List</b>
                <div className="grid-cont">
                    {listDiv}
                </div>
            </section>
        </>
    );
}
