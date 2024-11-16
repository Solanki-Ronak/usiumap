const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

const path = require('path');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');
// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(cors());


// Helper function to find the shortest path using Dijkstra's algorithm
function findShortestPath(adjacencyList, source, destination) {
    let distances = {};
    let prev = {};
    let pq = [];

    // Initialize the distances and previous node maps
    adjacencyList.forEach(point => {
        distances[point.point] = Infinity;
        prev[point.point] = null;
    });
    distances[source] = 0;

    pq.push({ point: source, distance: 0 });

    while (pq.length > 0) {
        pq.sort((a, b) => a.distance - b.distance);
        let { point: current } = pq.shift();

        if (current === destination) {
            let path = [];
            let totalDistance = distances[destination];

            // Track the route back to the source
            while (prev[current]) {
                const segment = adjacencyList.find(
                    adj => adj.point === prev[current] && adj.adjacent_point === current
                );
                path.unshift({
                    from: prev[current],
                    to: current,
                    path: segment.path,
                    distance: segment.distance,
                });
                current = prev[current];
            }

            return { path, distance: totalDistance };
        }

        adjacencyList
            .filter(adj => adj.point === current)
            .forEach(({ adjacent_point, distance }) => {
                const newDistance = distances[current] + distance;

                if (newDistance < distances[adjacent_point]) {
                    distances[adjacent_point] = newDistance;
                    prev[adjacent_point] = current;
                    pq.push({ point: adjacent_point, distance: newDistance });
                }
            });
    }
    return { error: 'No path found.' };
}

// Endpoint to serve the points for the dropdown
app.get('/points', (req, res) => {
    const { mode } = req.query; // Get mode from query parameters
    let fileName = '';

    // Determine the file to load based on mode
    if (mode === 'walking') {
        fileName = '/public/hello.json';
    } else if (mode === 'driving') {
        fileName = '/public/driving.json';
    } else if (mode === 'disabled') {
        fileName = '/public/access.json';
    } else {
        return res.json({ error: 'Invalid mode selected.' });
    }

    // Load the adjacency list for the selected mode
    fs.readFile(__dirname + fileName, 'utf8', (err, data) => {
        if (err) return res.json({ error: 'Error loading points file.' });

        let adjacencyList = JSON.parse(data);
        const points = [...new Set(adjacencyList.map(item => item.point))];
        res.json({ points });
    });
});


// Endpoint to calculate the shortest path
app.get('/shortest-path', (req, res) => {
    const { source, destination, mode } = req.query;  // Get mode from query parameters
    let fileName = '';

    // Determine which file to load based on the mode
    if (mode === 'walking') {
        fileName = '/public/hello.json';
    } else if (mode === 'driving') {
        fileName = '/public/driving.json';
    } else if (mode === 'disabled') {
        fileName = '/public/access.json';
    } else {
        return res.json({ error: 'Invalid mode selected.' });
    }

    // Load the adjacency list based on the selected mode
    fs.readFile(__dirname + fileName, 'utf8', (err, data) => {
        if (err) return res.json({ error: 'Error loading file.' });

        let adjacencyList = JSON.parse(data);

        // Shortest path calculation using the loaded adjacency list
        const result = findShortestPath(adjacencyList, source, destination);
        res.json(result);
    });
});


















// Initialize Firebase Admin
const serviceAccount = require(path.join(__dirname, 'config', 'serviceAccountKey.json'));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://finalproject-map-fbe81-default-rtdb.firebaseio.com"
});

const db = admin.database();



// CRUD Operations for Destination
app.get('/firebase/destination', async (req, res) => {
    try {
        const snapshot = await db.ref('destination').once('value');
        res.json(snapshot.val() || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/firebase/destination', async (req, res) => {
    try {
        const { categories } = req.body;
        await db.ref('destination').set({ categories });
        res.json({ success: true, data: { categories } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CRUD Operations for Locations
app.get('/firebase/locations', async (req, res) => {
    try {
        const snapshot = await db.ref('locations').once('value');
        res.json(snapshot.val() || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/firebase/locations', async (req, res) => {
    try {
        const locations = req.body;
        await db.ref('locations').set(locations);
        res.json({ success: true, data: locations });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CRUD Operations for Subdivs
app.get('/firebase/subdivs', async (req, res) => {
    try {
        const snapshot = await db.ref('subdivs').once('value');
        res.json(snapshot.val() || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/firebase/subdivs', async (req, res) => {
    try {
        const subdivs = req.body;
        await db.ref('subdivs').set(subdivs);
        res.json({ success: true, data: subdivs });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/firebase/subdivs/:location', async (req, res) => {
    try {
        const { location } = req.params;
        await db.ref(`subdivs/${location}`).remove();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CRUD Operations for Points
app.get('/firebase/dropdownpoints', async (req, res) => {
    try {
        const snapshot = await db.ref('dropdownpoints').once('value');
        res.json(snapshot.val() || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/firebase/dropdownpoints', async (req, res) => {
    try {
        const points = req.body;
        await db.ref('dropdownpoints').set(points);
        res.json({ success: true, data: points });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});







// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});