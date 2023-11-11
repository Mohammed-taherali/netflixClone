import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import MyNavbar from "../components/MyNavbar";

export default function Search({ showLoader, hideLoader }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchData, setSearchData] = useState([]);
    const base_path = import.meta.env.VITE_BACKDROP_URL;
    const navigate = useNavigate();
    const queryBody = { "query": searchParams.get("query") };

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

    useEffect(() => {
        fetch("/api/movieSearch", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(queryBody)
        })
            .then(resp => resp.json())
            .then(data => {
                if (data.status === "failure") {
                    navigate("/login");
                } else {
                    setSearchData(data.result.results);
                }
            });
    }, [queryBody.query, navigate]);

    return (
        <section id="search-div">
            <MyNavbar />
            <h4>search results for: {queryBody.query}</h4>
            <div className="res-div">
                {searchData.map(movie => {
                    if (movie.backdrop_path) {
                        const bgImg = base_path + movie.backdrop_path;
                        return (
                            <div key={movie.id} className="relMovieDiv" onClick={() => goToMovie(movie)} title={movie.title}>
                                <img src={bgImg} alt={movie.title} className="relImg" />
                                <p style={{ color: "white" }}>{movie.title}</p>
                            </div>
                        );
                    }
                })}
            </div>
        </section>
    );
}
