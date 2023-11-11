import React, { useRef, useState } from "react";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Alert from "../components/Alert";
import NetflixLogo from "/netflixLogo.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

export default function HeroSlider({ movieData }) {

    const slider = useRef(null);
    const [alertVisible, setAlertVisible] = useState({
        show: false,
        message: "Movie already present",
        type: "warning"
    })

    let navigate = useNavigate();

    const goToDetails = (movie, id) => {
        document.getElementById(id).innerText = "loading...";
        document.getElementById(id).disabled = true;
        fetch("/api/getMovieDetails", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movieData[0]),
        })
            .then(resp => resp.json())
            .then(data => {
                if (data.status === "failure") {
                    navigate("/login")
                }
                navigate(`/movie/${movie.id}`, { state: { movie: movie, relMovies: data.movies } })

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

    const CustomNextArrow = ({ onClick }) => {
        return (
            <button className="custom-next-arrow" onClick={() => {
                if (slider.current) {
                    slider.current.slickNext();
                }
            }}>
                &gt;
            </button>
        );
    };

    const CustomPrevArrow = ({ onClick }) => {
        return (
            <button className="custom-prev-arrow" onClick={() => {
                if (slider.current) {
                    slider.current.slickPrev();
                }
            }}>
                &lt;
            </button>
        );
    };

    const settings = {
        infinite: true,
        speed: 2000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
    };

    let base_path = import.meta.env.VITE_BACKDROP_URL;
    const movieDiv = movieData.map(movie => {
        let bgImg = base_path + movie.backdrop_path;
        if (movie.backdrop_path) {
            return (
                <div key={movie.id}>
                    <div className="movieCont" style={{ backgroundImage: `url(${bgImg})` }}>
                        <CustomPrevArrow onClick={() => slider.slickPrev()} />
                        <div className="innerDiv">
                            <div className="overview-div">
                                <div className="logo-div">
                                    <img height={40} src={NetflixLogo} alt="" />
                                    <h4 className="mb-0">{movie.media_type}</h4>
                                </div>
                                <h2>{movie.title}</h2>
                                <div className="btns-div">
                                    <button className="btns" id={movie.id}><a className="detail-link" onClick={() => goToDetails(movie, movie.id)}><FontAwesomeIcon icon={faPlay} /> Play</a></button>
                                    <button id={`btn${movie.id}`} className="btns" onClick={() => addToMyList(movie, `btn${movie.id}`)}><FontAwesomeIcon icon={faPlus} /> MyList</button>
                                </div>
                                <div>{movie.overview}</div>
                            </div>
                        </div>
                        <CustomNextArrow onClick={() => slider.slickNext()} />
                    </div>
                </div>
            )
        }
    })
    return (
        <>
            {alertVisible.show && <Alert message={alertVisible.message} type={alertVisible.type} />}
            <div className="carousel-container">
                <Slider {...settings} ref={slider}>
                    {movieDiv}
                </Slider>
            </div>
        </>
    )
}
