# Netflix Clone

---

[Video Demo(coming soon)](#)

## Table of contents

| Sr. | Title                                                      |
| --- | ---------------------------------------------------------- |
| 1.  | [Screenshots](#1-screenshots-👀)                           |
| 2.  | [Setting Up MongoDB atlas](#2-setting-up-mongodb-atlas)    |
| 3.  | [Setting Up TMDB API](#3-setting-up-tmdb-api)              |
| 4.  | [Clone the repository](#4-clone-the-repository)            |
| 5.  | [Install the dependencies](#5-Install-the-dependencies)    |
| 6.  | [Execute the `setup.js` file](#6-execute-the-setupjs-file) |
| 7.  | [Run the application](#7-run-the-application)              |

## 1. Screenshots 👀

---

### Sign Up Page 🎉

![Sign up](https://github.com/Mohammed-taherali/netflixClone/blob/master/client/src/assets/signup.png)

### Login Page 🎊

![Login page](https://github.com/Mohammed-taherali/netflixClone/blob/master/client/src/assets/login.png)

### Home Page 🏠

![Home page](https://github.com/Mohammed-taherali/netflixClone/blob/master/client/src/assets/home%20page.png)

![Home page 2](https://github.com/Mohammed-taherali/netflixClone/blob/master/client/src/assets/home%202.png)

### Movie Page 📽

![Movie page](https://github.com/Mohammed-taherali/netflixClone/blob/master/client/src/assets/movie%201.png)

![Related movies](https://github.com/Mohammed-taherali/netflixClone/blob/master/client/src/assets/movie%202.png)

---

## 2. Setting Up MongoDB Atlas

-   Follow these steps to easily create your mongodb atlas account: [Getting started with mongodb](https://www.mongodb.com/docs/atlas/getting-started/)
-   Create a free cluster named 'netflixClone': [deploying a free cluster](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/) [make sure the cluster name is exactly 'netflixClone']
-   copy the connection string [creating a connection string](https://www.mongodb.com/docs/drivers/node/current/quick-start/create-a-connection-string/) and paste it in setup.js file located in the root directory

**_NOTE_**
DON'T FORGET TO ADD `0.0.0.0/0` TO THE _IP ACCESS_ LIST IN THE _NETWORK ACCESS_ TAB. FAILING TO DO SO WILL NOT ENABLE YOU TO ACCESS THE MONGODB ATLAS

## 3. Setting Up TMDB API

Follow this tutorial to create tmdb api: [setup TMDB API](https://www.educative.io/courses/movie-database-api-python/set-up-the-credentials)

Copy this `api key` and paste it in [setup.js](#4-clone-the-repository) file

---

## 4. Clone the repository

```
git clone https://github.com/Mohammed-taherali/netflixClone.git
```

---

## 5. Install the dependencies

-   Navigate to `server` directory
-   `cd .\server`
-   run `npm install`
-   Then navigate back to the root directory
-   `cd ..`
-   Navigate to `client` directory
-   `cd .\client`
-   run `npm install`

## 6. Execute the `setup.js` file

-   open the setup.js file
-   replace the placeholder texts for `<mongodb_uri>` and `<tmdb_api_key>` acquired from steps 2 and 3
-   save the file
-   run the `node setup.js` command

## 7. Run the application

-   Open two seperate terminals in vscode
-   #### Start the frontend
-   in the 1st terminal, navigate to client directory
-   `cd .\client`
-   `npm run dev`
-   #### Start the backend
-   in the 2nd terminal, navigate to server directory
-   `cd .\server`
-   `npm run dev`

Open `localhost:5173` in your browser and voila! The app is up and running!

Please star the repository if you like it.
Connect with me on [LinkedIn](https://www.linkedin.com/in/mohammedtaherali)
