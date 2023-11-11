import React, { useRef } from "react";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from "react-router-dom";

export default function MovieByGenre({ movies }) {
    let flag = Object.entries(movies).length != 0 ? true : false;
    if (flag) {
        const sliders = Array.from({ length: 6 }, () => useRef(null))
        const navigate = useNavigate();
        let base_path = import.meta.env.VITE_BACKDROP_URL;

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

        const settings = {
            speed: 2000,
            slidesToShow: 4,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 5000,
        };

        const createDiv = (genreMovie, index) => {
            const nDiv = genreMovie.map(m => {
                let bgImg = base_path + m.backdrop_path
                if (m.backdrop_path) {
                    return (
                        <div
                            key={m.id}
                            className="relMovieDiv mGenre"
                            onClick={() => goToMovie(m)}
                            title={m.title}>
                            <img src={bgImg} alt={m.title} className="relImg" />
                        </div>
                    )
                }
            })

            return (
                <div className="carousel-container" key={index}>
                    <Slider {...settings} ref={sliders[index]}>
                        {nDiv}
                    </Slider>
                </div>
            );
        }

        const comedyMovies = movies.comedyMovies
        const dramaMovies = movies.dramaMovies
        const horrorMovies = movies.horrorMovies
        const romanceMovies = movies.romanceMovies
        const thrillerMovies = movies.thrillerMovies
        const topPicks = movies.topPicks;

        const comedyDiv = createDiv(comedyMovies, 0);
        const dramaDiv = createDiv(dramaMovies, 1);
        const horrorDiv = createDiv(horrorMovies, 2);
        const romanceDiv = createDiv(romanceMovies, 3);
        const thrillerDiv = createDiv(thrillerMovies, 4);
        const topPickDiv = createDiv(topPicks, 5);

        return (
            <section id="movieGenreDiv">
                {topPickDiv && <h5 className="genreTitle">Top Picks For You</h5>}
                {topPickDiv}
                <h5 className="genreTitle">Comedy Movies</h5>
                {comedyDiv}
                <h5 className="genreTitle">Drama Movies</h5>
                {dramaDiv}
                <h5 className="genreTitle">Horror Movies</h5>
                {horrorDiv}
                <h5 className="genreTitle">Romantic Movies</h5>
                {romanceDiv}
                <h5 className="genreTitle">Thriller Movies</h5>
                {thrillerDiv}
            </section>
        )
    }
}
