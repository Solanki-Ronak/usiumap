// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getDatabase, ref, get, set, update } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDE5AtqIYevQC6oHnqBN-ozqEruOf3OuC4",
    authDomain: "project-usiumap.firebaseapp.com",
    projectId: "project-usiumap",
    storageBucket: "project-usiumap.firebasestorage.app",
    messagingSenderId: "283294354474",
    appId: "1:283294354474:web:8a94cfc363644bee384753",
    measurementId: "G-29N3K3F611"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { database, ref, get, set, update };