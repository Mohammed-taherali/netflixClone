import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./home.css"
import MyNavbar from "../components/MyNavbar";
import HeroSlider from "../components/HeroSlider";
import MovieByGenre from "../components/MovieByGenre";

async function getMovies(genre) {
    const api_key = import.meta.env.VITE_TMDB_API_KEY;
    const base_uri = import.meta.env.VITE_SEARCH_URI;
    const searchUrl = `${base_uri}?api_key=${api_key}&with_genres=${genre}`
    const movie = await fetch(searchUrl)
        .then(resp => resp.json())
        .then(data => {
            return data.results.slice(0, 10)
        })
    return movie
}

async function getAllMovies() {

    const comedyMovies = await getMovies(35);
    const dramaMovies = await getMovies(18);
    const horrorMovies = await getMovies(27);
    const romanceMovies = await getMovies(10749);
    const thrillerMovies = await getMovies(53);

    let movies = {
        comedyMovies: comedyMovies,
        dramaMovies: dramaMovies,
        horrorMovies: horrorMovies,
        romanceMovies: romanceMovies,
        thrillerMovies: thrillerMovies
    }

    return movies;
}

export default function Home({ showLoader, hideLoader }) {

    const [movieData, setMovieData] = useState("");
    const [moviesByGenre, setMoviesByGenre] = useState({});

    let navigate = useNavigate();

    jQuery(function () {
        $('button').on("click", function () {
            $('.alert').show()
        })
    });

    useEffect(() => {
        fetch("/api/getMovieData", {
            method: "GET"
        })
            .then((response) => response.json())
            .then(data => {
                if (data.status === "failure") {
                    navigate("/login")
                }
                try {
                    setMovieData(data.movieData.slice(0, 5));
                    getAllMovies()
                        .then(movies => {
                            movies.topPicks = data.movieData.slice(5, 15);
                            setMoviesByGenre(movies)
                        })
                } catch (error) { }
                hideLoader();
            })

    }, [])
    if (movieData) {
        return (
            <>
                <MyNavbar />
                <section id="home-section">
                    <HeroSlider movieData={movieData} />
                    {moviesByGenre && <MovieByGenre movies={moviesByGenre} />}
                </section>
            </>
        )
    }
}