const fs = require("fs");
const crypto = require("crypto");

async function generateToken() {
    const buffer = await new Promise((resolve, reject) => {
        crypto.randomBytes(256, function (ex, buffer) {
            if (ex) {
                reject("error generating token");
            }
            resolve(buffer);
        });
    });
    const token = crypto.createHash("sha1").update(buffer).digest("hex");

    return token;
}

async function writeEnv(path, content) {
    fs.writeFileSync(path, content.trim(), "utf-8");
    console.log(`Created ${path}`);
}

async function setup() {
    const token = await generateToken();

    // Paste your tmdb api key
    const api_key = "<tmdb_api_key>";

    // Paste your MongoDB atlas uri here
    const mongodb_uri = "<mongodb_uri>";
    const clientPath = "./client/.env";
    const serverPath = "./server/.env";

    const clientEnvContent = `
VITE_TMDB_API_KEY=${api_key}
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_BACKDROP_URL=https://image.tmdb.org/t/p/original
VITE_SEARCH_URI=https://api.themoviedb.org/3/discover/movie
`;

    // Server .env content
    const serverEnvContent = `
NODE_ENV=development
PORT=5000
URI=${mongodb_uri}
SESSION_SECRET=${token}
TMDB_API_KEY=${api_key}
TMDB_BASE_URL=https://api.themoviedb.org/3
`;
    await writeEnv(clientPath, clientEnvContent);
    await writeEnv(serverPath, serverEnvContent);
}

setup()
    .then(() => {
        console.log("Env files successfully created");
    })
    .catch((err) => {
        console.log("Error while creating env files: ", err);
    });
