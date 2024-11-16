const admin = require('firebase-admin');
const fs = require('fs').promises;
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('./config/serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://finalproject-map-fbe81-default-rtdb.firebaseio.com"
});

const db = admin.database();

// Function to sanitize keys in an object
function sanitizeKeys(obj) {
    if (typeof obj !== 'object' || obj === null) return obj;

    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeKeys(item));
    }

    const sanitized = {};
    for (let [key, value] of Object.entries(obj)) {
        // Replace invalid characters with underscores
        const newKey = key.replace(/[.#$\/\[\]]/g, '_');
        
        // Recursively sanitize nested objects
        sanitized[newKey] = sanitizeKeys(value);
    }
    return sanitized;
}

async function migrateJsonToFirebase() {
    try {
        const files = [
            {
                name: 'polygon_coordinates',
                path: './public/polygon_coordinates.json'
            },
            {
                name: 'geojson_data',
                path: './public/14.geojson'
            },
            {
                name: 'destination',
                path: './public/destination.json'
            },
            {
                name: 'locations',
                path: './public/locations.json'
            },
            {
                name: 'subdivs',
                path: './public/subdivs.json'
            },
            {
                name: 'dropdownpoints',
                path: './public/dropdownpoints.json'
            },
            {
                name: 'walking_paths',
                path: './public/hello.json'
            },
            {
                name: 'driving_paths',
                path: './public/driving.json'
            },
            {
                name: 'disabled_paths',
                path: './public/access.json'
            },
            {
                name: 'directions',
                path: './public/1.json',
                needsSanitization: true  // Flag for files that need key sanitization
            }
        ];

        for (const file of files) {
            console.log(`Migrating ${file.name}...`);
            const data = await fs.readFile(file.path, 'utf8');
            let jsonData = JSON.parse(data);

            // Sanitize data if needed
            if (file.needsSanitization) {
                jsonData = sanitizeKeys(jsonData);
            }

            await db.ref(file.name).set(jsonData);
            console.log(`Successfully migrated ${file.name}`);
        }

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

// Run the migration
migrateJsonToFirebase();