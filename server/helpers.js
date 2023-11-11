const crypto = require("crypto");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();
const uri = process.env.URI;
const connectDB = () => {
    return new MongoClient(uri);
};

const closeDB = (client) => {
    client.close();
};
const dbName = "netflixClone";
const algorithm = "sha256";

const validEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const validPassword = (pass) => {
    var passRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,16}$/;
    return pass.match(passRegex);
};

const redirectPage = (req, res, next) => {
    const sessionId = req.session.userId || "";
    if (sessionId) {
        res.locals.status = "success";
    } else {
        res.locals.status = "failure";
    }
    next();
};

const hashData = (data) => {
    return crypto.createHash(algorithm).update(data).digest("hex");
};

async function getRecommendedMovies(userId, session, prevMovieId = "") {
    const client = connectDB();
    try {
        await client.connect();
        const db = client.db(dbName);
        const previousViews = db.collection("previousViews");
        if (!prevMovieId) {
            let cursor = previousViews
                .find({ userId: userId })
                .sort({ _id: -1 })
                .limit(1);
            let res = await cursor.toArray();
            if (session.movieId != res[0].movieId) {
                session.movieId = res[0].movieId;
                if (res.length > 0) {
                    let fetchUrl = `${process.env.TMDB_BASE_URL}/movie/${res[0].movieId}/recommendations?api_key=${process.env.TMDB_API_KEY}&with_genres=${res[0].genre_ids}`;
                    let recommendedMovies = await fetch(fetchUrl)
                        .then((resp) => resp.json())
                        .then((data) => {
                            console.log("fetch call for movie made");
                            return data.results;
                        });
                    session.movieList = recommendedMovies;
                    return recommendedMovies;
                }
            } else {
                return session.movieList;
            }
        } else {
            let fetchUrl = `${process.env.TMDB_BASE_URL}/movie/${prevMovieId}/recommendations?api_key=${process.env.TMDB_API_KEY}`;
            let recommendedMovies = await fetch(fetchUrl)
                .then((resp) => resp.json())
                .then((data) => {
                    console.log("fetch call for movie made");
                    return data.results;
                });
            session.movieList = recommendedMovies;
            return recommendedMovies;
        }
    } catch (error) {
        console.log(error);
    } finally {
        closeDB(client);
    }
}

async function insertToMyList(movie, session) {
    const client = connectDB();
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection("myList");
        const userFilter = { userId: session.userId };
        const existingUser = await col.findOne(userFilter);
        if (existingUser) {
            const filter = {
                userId: session.userId,
                movies: { $nin: [movie.title] },
            };
            const updateDoc = {
                $push: {
                    movies: movie.title,
                    movieInfo: movie,
                },
            };
            const result = await col.updateOne(filter, updateDoc);
            if (result.modifiedCount > 0) {
                return { status: "inserted", message: "Movie Added to list." };
            } else {
                return {
                    status: "present",
                    message: "Movie already present in My List.",
                };
            }
        } else {
            const record = {
                userId: session.userId,
                movies: [movie.title],
                movieInfo: [movie],
            };

            const res = await col.insertOne(record);
            if (res.acknowledged) {
                return { status: "inserted", message: "Movie Added to list." };
            }
        }
    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
}

async function getMyList(userId) {
    const client = connectDB();
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection("myList");
        const userFilter = { userId: userId };
        const record = await col.findOne(userFilter);
        if (record) {
            return record["movieInfo"];
        }
    } catch (error) {
        console.log(error);
    } finally {
        closeDB(client);
    }
}

async function getLastMovie(user) {
    const client = connectDB();
    try {
        await client.connect();
        const db = client.db(dbName);
        const previousViews = db.collection("previousViews");
        let cursor = previousViews
            .find({ userId: user })
            .sort({ _id: -1 })
            .limit(1);
        let res = await cursor.toArray();
        if (res.length > 0) {
            return { status: "success", movie: res[0] };
        } else {
            return { status: "failure", movie: "" };
        }
    } catch (error) {
        console.log(error);
    } finally {
        closeDB(client);
    }
}

async function insertLastMovie(user, movieName, movieId, genre_ids, session) {
    const client = connectDB();
    try {
        await client.connect();
        const db = client.db(dbName);
        const previousViews = db.collection("previousViews");
        let lastMovie = {
            userId: user,
            movieName: movieName,
            movieId: movieId,
            genre_ids: genre_ids,
        };
        const rec = await previousViews.insertOne(lastMovie);
        let ackStatus = true;
        if (!rec.acknowledged) {
            ackStatus = false;
        } else {
            try {
                session.movieId = movieId;
            } catch (error) {}
        }
        return ackStatus;
    } catch (error) {
        console.log(error);
    } finally {
        closeDB(client);
    }
}

async function insertUser(user, pass, session) {
    const client = connectDB();
    try {
        await client.connect();
        const db = client.db(dbName);
        const userData = db.collection("userData");
        const hashedPass = hashData(pass);
        let userDoc = {
            userName: user,
            userPass: hashedPass,
        };
        const rec = await userData.insertOne(userDoc);
        let acknowledgedStatus = true;
        if (rec.acknowledged == true) {
            let res = await insertLastMovie(
                user,
                "Mission: Impossible - Dead Reckoning Part One",
                575264,
                "28, 53",
                session
            );
            if (!res) {
                acknowledgedStatus = false;
            }
        } else {
            acknowledgedStatus = false;
        }
        return acknowledgedStatus;
    } catch (error) {
        console.log("Error while inserting: ", error);
    } finally {
        closeDB(client);
    }
}

async function checkUserExists(user) {
    const client = connectDB();
    try {
        await client.connect();
        const db = client.db(dbName);
        const userData = db.collection("userData");

        const userExists = await userData.findOne({
            userName: user,
        });
        return userExists ? true : false;
    } catch (error) {
        console.log("Error in checkUserExists: ", error);
    } finally {
        closeDB(client);
    }
}

async function checkLogin(user, pass) {
    const client = connectDB();
    try {
        await client.connect();
        const db = client.db(dbName);
        const userData = db.collection("userData");
        const hashedPass = hashData(pass);

        const userExists = await userData.findOne({
            userName: user,
        });
        closeDB(client);
        if (userExists) {
            if (hashedPass === userExists.userPass) {
                return {
                    status: "success",
                    message: "User logged in successfully",
                };
            } else {
                return {
                    status: "failure",
                    message: "Incorrect Id or password",
                };
            }
        } else {
            return {
                status: "failure",
                message: "No user found, please sign up first",
            };
        }
    } catch (error) {
        console.log("Error in checkUserExists: ", error);
    }
}

module.exports = {
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
};
