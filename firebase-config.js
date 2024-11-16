// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getDatabase, ref, get, set, update } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCbB1Js0rbUxN4sZGq5dblJqVhZ8-EqG50",
    authDomain: "finalproject-map-fbe81.firebaseapp.com",
    projectId: "finalproject-map-fbe81",
    storageBucket: "finalproject-map-fbe81.firebasestorage.app",
    messagingSenderId: "1090739081599",
    appId: "1:1090739081599:web:4457d23eb79869fc4f8a4a",
    measurementId: "G-2EGYBRYVTV",
    databaseURL: "https://finalproject-map-fbe81-default-rtdb.firebaseio.com" // Add this line
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { database, ref, get, set, update };