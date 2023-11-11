import React from "react";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import NetflixLogo from "/netflixLogo.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function HeroSlider({ movieData }) {
    // console.log("movie data heroslider: ", movieData);


    const settings = {
        // dots: true,
        infinite: true,
        speed: 2000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
    };
    let base_path = import.meta.env.VITE_BACKDROP_URL;
    const movieDiv = movieData.map(movie => {
        let bgImg = base_path + movie.backdrop_path;
        return (
            <div key={movie.id}>
                <div className="movieCont" style={{ backgroundImage: `url(${bgImg})` }}>
                    <div className="innerDiv">
                        <div className="overview-div">
                            <div className="logo-div">
                                <img height={40} src={NetflixLogo} alt="" />
                                <h4 className="mb-0">{movie.media_type}</h4>
                            </div>
                            <h2>{movie.title}</h2>
                            <div className="btns-div">
                                <button><FontAwesomeIcon icon={faPlay} /> Play</button>
                                <button><FontAwesomeIcon icon={faPlus} /> MyList</button>
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
            {/* <div style={{ backgroundImage: `url(${t1})`, height: "720px", backgroundSize: "cover" }}>
                <h1>Hello brother</h1>
            </div> */}
            {/* {movieDiv} */}
            <div className="carousel-container">
                <Slider {...settings}>
                    {movieDiv}
                </Slider>
            </div>
            {/* <div>
                            <img style={{ width: "100%", minHeight: "650px", height: "calc(100vh - 65px)" }} src="/mi7-bd.jpg" alt="Slide 1" />
                        </div>
                        <div>
                            <img style={{ width: "100%", minHeight: "650px", height: "calc(100vh - 65px)" }} src="/oppenheimer-bd.jpg" alt="Slide 2" />
                        </div>
                        <div>
                            <img style={{ width: "100%", minHeight: "650px", height: "calc(100vh - 65px)" }} src="/squid game.jpg" alt="Slide 3" />
                        </div> */}
        </>
    )
}
