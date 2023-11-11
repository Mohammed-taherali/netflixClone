// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
dotenv.config();
const {
    validEmail,
    validPassword,
    checkUserExists,
    insertUser,
    checkLogin,
    redirectPage,
    getRecommendedMovies,
    insertLastMovie,
    getLastMovie,
    insertToMyList,
    getMyList,
} = require("./helpers");
const app = express();
const PORT = process.env.PORT || 5000;
const oneDay = 24 * 60 * 60 * 1000;
var session;

app.use(cors());
app.use(express.json());
app.use(
    sessions({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: true,
        cookie: { maxAge: oneDay },
        resave: false,
    })
);

var unless = function (middleware, ...paths) {
    return function (req, res, next) {
        const pathCheck = paths.some((path) => path === req.path);
        pathCheck ? next() : middleware(req, res, next);
    };
};

app.use(unless(redirectPage, "/api/login", "/api/register"));

async function checkWrapper(user) {
    let isExists = false;
    if (await checkUserExists(user)) {
        isExists = true;
    }
    return isExists;
}

app.post("/api/getMyList", (req, res) => {
    if (res.locals.status == "failure") {
        res.json({ status: "failure" });
        res.end();
    } else {
        getMyList(session.userId).then((data) => {
            res.json({ status: "success", data: data });
            res.end();
        });
    }
});

app.get("/api/getMovieData", (req, res) => {
    if (res.locals.status == "failure") {
        res.json({ status: "failure" });
        res.end();
    } else {
        getRecommendedMovies(session.userId, session).then((data) => {
            res.json({ status: "success", movieData: data });
            res.end();
        });
    }
});

app.post("/api/getRelatedMovies", (req, res) => {
    if (res.locals.status == "failure") {
        res.json({ status: "failure" });
        res.end();
    } else {
        getRecommendedMovies(session.userId, session, req.body.movieId).then(
            (movies) => {
                res.json({ movies: movies });
                res.end();
            }
        );
    }
});

app.post("/api/addToMyList", (req, res) => {
    const movie = req.body.movie;
    insertToMyList(movie, session).then((data) => {
        res.json(data);
        res.end();
    });
});

app.post("/api/movieSearch", (req, res) => {
    if (res.locals.status == "failure") {
        res.json({ status: "failure" });
        res.end();
    } else {
        const base_path = process.env.TMDB_BASE_URL;
        const api_key = process.env.TMDB_API_KEY;
        let fetchUrl = `${base_path}/search/movie?query=${req.body.query}&api_key=${api_key}`;
        fetch(fetchUrl)
            .then((resp) => resp.json())
            .then((data) => {
                res.json({ status: "success", result: data });
            });
    }
});

app.get("/api/getMovieByGenre", (req, res) => {
    if (res.locals.status == "failure") {
        res.json({ status: "failure" });
        res.end();
    } else {
        res.json({ abcd: "efgh", status: "failure" });
        res.end();
    }
});

app.post("/api/insertNewMovie", (req, res) => {
    if (res.locals.status == "failure") {
        res.json({ status: "failure" });
        res.end();
    } else {
        let { genre_ids, title, id } = req.body.movie;
        let ids = "";
        for (let i = 0; i < genre_ids.length; i++) {
            ids += genre_ids[i] + ",";
        }
        ids = ids.slice(0, ids.length - 1);
        insertLastMovie(session.userId, title, id, ids, session).then(
            (result) => {
                res.json({ status: "success", resp: result });
                res.end();
            }
        );
    }
});

app.post("/api/getMovieDetails", (req, res) => {
    if (res.locals.status == "failure") {
        res.json({ status: "failure" });
        res.end();
    } else {
        let { genre_ids, title, id } = req.body;
        let ids = "";
        for (let i = 0; i < genre_ids.length; i++) {
            ids += genre_ids[i] + ",";
        }
        ids = ids.slice(0, ids.length - 1);
        getLastMovie(session.userId)
            .then((resp) => JSON.stringify(resp))
            .then((data) => {
                let newData = JSON.parse(data);
                if (newData.movie.movieName != title) {
                    insertLastMovie(
                        session.userId,
                        title,
                        id,
                        ids,
                        session
                    ).then((result) => {
                        if (result) {
                            getRecommendedMovies(session.userId, session).then(
                                (movies) => {
                                    res.json({ movies: movies });
                                    res.end();
                                }
                            );
                        }
                    });
                }
            });
    }
});

app.post("/api/signup", (req, res) => {
    const { userName, userPass, confirmPass } = req.body;
    if (!validEmail(userName)) {
        res.json({ status: "failure", message: "Invalid Email Id" });
        res.end();
    } else if (userPass !== confirmPass) {
        res.json({ status: "failure", message: "Passwords don't match" });
        res.end();
    } else if (!validPassword(userPass)) {
        res.json({
            status: "failure",
            message:
                "Password must contain atleast 7 characters, a special symbol and a number",
        });
        res.end();
    } else {
        checkWrapper(userName).then((isExists) => {
            if (isExists) {
                res.json({
                    status: "failure",
                    message: "User with this name already exists",
                });
                res.end();
            } else {
                insertUser(userName, userPass, session).then((insertStatus) => {
                    if (insertStatus === true) {
                        res.json({
                            status: "success",
                            message: "User Successfully created",
                        });
                        res.end();
                    } else {
                        res.json({
                            status: "failure",
                            message:
                                "Could not create user, please try after some time",
                        });
                        res.end();
                    }
                });
            }
        });
    }
});

app.post("/api/login", (req, res) => {
    const { userEmail, userPass } = req.body;
    checkLogin(userEmail, userPass).then((results) => {
        if (results.status === "success") {
            session = req.session;
            session.userId = userEmail;
            res.json(results);
            res.end();
        } else {
            res.json(results);
            res.end();
        }
    });
});

app.post("/api/logout", (req, res) => {
    req.session.destroy();
    res.json({ status: "success" });
    res.end();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
