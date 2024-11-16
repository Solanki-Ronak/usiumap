// Global state to store current selections and data
let state = {
    destinations: [],
    locations: {},
    subdivs: {},
    points: [],
    selectedCategory: null,
    selectedLocation: null
};



// Event Listeners Setup
function setupEventListeners() {
    // Modal close buttons
    document.querySelectorAll('.close').forEach(button => {
        button.onclick = () => {
            document.getElementById('add-modal').style.display = 'none';
            document.getElementById('edit-modal').style.display = 'none';
            document.getElementById('delete-modal').style.display = 'none';
        };
    });

    // Close modals when clicking outside
    window.onclick = (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };
}

function renderCategories() {
    const container = document.getElementById('categories-container');
    container.innerHTML = '';

    state.destinations.forEach(category => {
        const div = document.createElement('div');
        div.className = 'item';
        if (category === state.selectedCategory) {
            div.classList.add('active');
        }

        div.innerHTML = `
            <span>${category}</span>
            <div class="item-buttons">
                <button class="edit-btn" onclick="showEditModal('destination', '${category}')">Edit</button>
                <button class="delete-btn" onclick="showDeleteModal('destination', '${category}')">Delete</button>
            </div>
        `;

        div.onclick = (e) => {
            if (!e.target.classList.contains('edit-btn') && !e.target.classList.contains('delete-btn')) {
                selectCategory(category);
            }
        };

        container.appendChild(div);
    });
}

function renderLocations(category) {
    const container = document.getElementById('locations-container');
    container.innerHTML = '';
    document.getElementById('add-location-btn').disabled = !category;

    if (!category || !state.locations[category]) return;

    state.locations[category].forEach(location => {
        const div = document.createElement('div');
        div.className = 'item';
        if (location === state.selectedLocation) {
            div.classList.add('active');
        }

        div.innerHTML = `
            <span>${location}</span>
            <div class="item-buttons">
                <button class="edit-btn" onclick="showEditModal('location', '${location}')">Edit</button>
                <button class="delete-btn" onclick="showDeleteModal('location', '${location}')">Delete</button>
            </div>
        `;

        div.onclick = (e) => {
            if (!e.target.classList.contains('edit-btn') && !e.target.classList.contains('delete-btn')) {
                selectLocation(location);
            }
        };

        container.appendChild(div);
    });
}

function renderSubdivs(location) {
    const container = document.getElementById('subdivs-container');
    const addButton = document.getElementById('add-subdiv-btn');
    container.innerHTML = '';

    if (addButton) {
        addButton.style.display = 'none';
    }

    if (!location) {
        return;
    }

    const subDiv = state.subdivs[location];
    
    if (!subDiv || !subDiv.details || (
        !subDiv.details.Location && 
        !subDiv.details['Phone Number'] && 
        !subDiv.details['Email Address'] && 
        !subDiv.details.Other && 
        !subDiv.image
    )) {
        if (addButton) {
            addButton.style.display = 'block';
            addButton.disabled = false;
        }
        return;
    }

    const div = document.createElement('div');
    div.className = 'details-container';

    div.innerHTML = `
        ${subDiv.image ? `<img src="${subDiv.image}" alt="${location}" class="details-image">` : ''}
        ${Object.entries(subDiv.details).map(([key, value]) => `
            <div class="details-field">
                <div class="details-label">${key}:</div>
                <div>${value}</div>
            </div>
        `).join('')}
        <div class="item-buttons">
            <button class="edit-btn" onclick="showEditModal('subDiv', '${location}')">Edit</button>
            <button class="delete-btn" onclick="showDeleteModal('subDiv', '${location}')">Delete</button>
        </div>
    `;

    container.appendChild(div);
}

function renderPoints(location) {
    const container = document.getElementById('points-container');
    container.innerHTML = '';

    if (!location) return;

    const pointInfo = state.points.find(p => p.name === location);
    
    if (pointInfo) {
        // If point exists, show the point and edit button
        const div = document.createElement('div');
        div.className = 'point-item';
        div.innerHTML = `
            <span class="point-value">${pointInfo.point}</span>
            <button class="edit-btn" onclick="showEditPointModal('${location}')">Edit Point</button>
        `;
        container.appendChild(div);
    } else {
        // If point doesn't exist, show the Add Point button
        const div = document.createElement('div');
        div.className = 'point-item add-point-container';
        div.innerHTML = `
            <button class="add-point-btn" onclick="showAddPointModal('${location}')">
                <span class="plus-icon">+</span>
                Add a Point
            </button>
        `;
        container.appendChild(div);
    }
}

// Selection functions
function selectCategory(category) {
    state.selectedCategory = category;
    state.selectedLocation = null;
    renderCategories();
    renderLocations(category);
    renderSubdivs(null);
    renderPoints(null);
}

function selectLocation(location) {
    state.selectedLocation = location;
    renderLocations(state.selectedCategory);
    renderSubdivs(location);
    renderPoints(location);
}

// Modal Functions
function showAddModal(type) {
    const modal = document.getElementById('add-modal');
    const formContainer = document.getElementById('modal-form-container');
    const title = document.getElementById('modal-title');

    switch (type) {
        case 'destination':
            title.textContent = 'Add New Category';
            formContainer.innerHTML = `
                <div class="form-group">
                    <label>Category Name:</label>
                    <input type="text" id="new-category-name">
                </div>
                <div class="modal-buttons">
                    <button onclick="addItem('destination')">Add</button>
                    <button onclick="closeModal('add-modal')">Cancel</button>
                </div>
            `;
            break;

        case 'location':
            title.textContent = 'Add New Location';
            formContainer.innerHTML = `
                <div class="form-group">
                    <label>Location Name:</label>
                    <input type="text" id="new-location-name">
                </div>
                <div class="modal-buttons">
                    <button onclick="addItem('location')">Add</button>
                    <button onclick="closeModal('add-modal')">Cancel</button>
                </div>
            `;
            break;

            case 'subDiv':
                title.textContent = 'Add New Details';
                formContainer.innerHTML = `
                    <div class="modal-header">
                        <h2>Add Location Details</h2>
                    </div>
                    
                    <div class="form-group">
                        <label class="required-field">Image URL</label>
                        <input type="text" id="new-subdiv-image" placeholder="Enter the path to your image">
                        <span class="field-help">Enter the complete path to your image (e.g., images/location.jpg)</span>
                    </div>
            
                    <div class="form-section-divider"></div>
            
                    <div class="form-group">
                        <label class="required-field">Location</label>
                        <input type="text" id="new-subdiv-location" placeholder="Enter location details">
                        <span class="field-help">Specify the exact location or address</span>
                    </div>
            
                    <div class="form-group">
                        <label>Phone Number</label>
                        <input type="text" id="new-subdiv-phone" placeholder="Enter contact number">
                        <span class="field-help">Include country code if applicable</span>
                    </div>
            
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="text" id="new-subdiv-email" placeholder="Enter email address">
                        <span class="field-help">Provide a valid contact email</span>
                    </div>
            
                    <div class="form-group">
                        <label>Additional Details</label>
                        <textarea id="new-subdiv-other" placeholder="Enter any additional information"></textarea>
                        <span class="field-help">Include any other relevant information about this location</span>
                    </div>
            
                    <div class="modal-buttons">
                        <button onclick="addItem('subDiv')">Add Details</button>
                        <button onclick="closeModal('add-modal')">Cancel</button>
                    </div>
                `;
            break;
    }

    modal.style.display = 'block';
}

function showEditModal(type, item) {
    const modal = document.getElementById('edit-modal');
    const formContainer = document.getElementById('edit-modal-form-container');
    const title = document.getElementById('edit-modal-title');

    switch (type) {
        case 'destination':
            title.textContent = 'Edit Category';
            formContainer.innerHTML = `
                <div class="form-group">
                    <label>Category Name:</label>
                    <input type="text" id="edit-category-name" value="${item}">
                </div>
                <div class="modal-buttons">
                    <button onclick="updateItem('destination', '${item}')">Update</button>
                    <button onclick="closeModal('edit-modal')">Cancel</button>
                </div>
            `;
            break;

        case 'location':
            title.textContent = 'Edit Location';
            formContainer.innerHTML = `
                <div class="form-group">
                    <label>Location Name:</label>
                    <input type="text" id="edit-location-name" value="${item}">
                </div>
                <div class="modal-buttons">
                    <button onclick="updateItem('location', '${item}')">Update</button>
                    <button onclick="closeModal('edit-modal')">Cancel</button>
                </div>
            `;
            break;

            case 'subDiv':
                const subDiv = state.subdivs[item];
                title.textContent = 'Edit Details';
                formContainer.innerHTML = `
                    <div class="modal-header">
                        <h2>Edit Location Details</h2>
                    </div>
                    
                    <div class="form-group">
                        <label class="required-field">Image URL</label>
                        <input type="text" id="edit-subdiv-image" value="${subDiv.image}" placeholder="Enter the path to your image">
                        <span class="field-help">Enter the complete path to your image (e.g., images/location.jpg)</span>
                    </div>
            
                    <div class="form-section-divider"></div>
            
                    <div class="form-group">
                        <label class="required-field">Location</label>
                        <input type="text" id="edit-subdiv-location" value="${subDiv.details.Location}" placeholder="Enter location details">
                        <span class="field-help">Specify the exact location or address</span>
                    </div>
            
                    <div class="form-group">
                        <label>Phone Number</label>
                        <input type="text" id="edit-subdiv-phone" value="${subDiv.details['Phone Number']}" placeholder="Enter contact number">
                        <span class="field-help">Include country code if applicable</span>
                    </div>
            
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="text" id="edit-subdiv-email" value="${subDiv.details['Email Address']}" placeholder="Enter email address">
                        <span class="field-help">Provide a valid contact email</span>
                    </div>
            
                    <div class="form-group">
                        <label>Additional Details</label>
                        <textarea id="edit-subdiv-other" placeholder="Enter any additional information">${subDiv.details.Other}</textarea>
                        <span class="field-help">Include any other relevant information about this location</span>
                    </div>
            
                    <div class="modal-buttons">
                        <button onclick="updateItem('subDiv', '${item}')">Save Changes</button>
                        <button onclick="closeModal('edit-modal')">Cancel</button>
                    </div>
                `;
            break;
    }

    modal.style.display = 'block';
}

function showDeleteModal(type, item) {
    const modal = document.getElementById('delete-modal');
    const message = document.getElementById('delete-message');
    
    let warningMessage = '';
    switch (type) {
        case 'destination':
            warningMessage = `Are you sure you want to delete the category "${item}"? This will also delete all associated locations and details.`;
            break;
        case 'location':
            warningMessage = `Are you sure you want to delete the location "${item}"? This will also delete all associated details.`;
            break;
        case 'subDiv':
            warningMessage = `Are you sure you want to delete the details for "${item}"?`;
            break;
    }

    message.textContent = warningMessage;
    modal.dataset.deleteType = type;
    modal.dataset.deleteItem = item;
    modal.style.display = 'block';
}
async function updateItem(type, oldItem) {
    try {
        switch (type) {
            case 'destination':
                const newCategoryName = document.getElementById('edit-category-name').value.trim();
                if (!newCategoryName) return;
                
                const categoryIndex = state.destinations.indexOf(oldItem);
                if (categoryIndex !== -1) {
                    const updatedDestinations = [...state.destinations];
                    updatedDestinations[categoryIndex] = newCategoryName;
                    
                    // Update destinations in Firebase
                    await fetch('/firebase/destination', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ categories: updatedDestinations })
                    });
                    
                    state.destinations = updatedDestinations;
                    state.locations[newCategoryName] = state.locations[oldItem];
                    delete state.locations[oldItem];
                    
                    // Update locations in Firebase
                    await fetch('/firebase/locations', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(state.locations)
                    });
                }
                break;

            case 'location':
                const newLocationName = document.getElementById('edit-location-name').value.trim();
                if (!newLocationName || !state.selectedCategory) return;
                
                const locationIndex = state.locations[state.selectedCategory].indexOf(oldItem);
                if (locationIndex !== -1) {
                    // Update location name in locations array
                    state.locations[state.selectedCategory][locationIndex] = newLocationName;
                    
                    await fetch('/firebase/locations', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(state.locations)
                    });

                    // Update subdiv data
                    if (state.subdivs[oldItem]) {
                        state.subdivs[newLocationName] = state.subdivs[oldItem];
                        delete state.subdivs[oldItem];
                        
                        await fetch('/firebase/subdivs', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(state.subdivs)
                        });
                    }

                    // Update point data
                    const pointIndex = state.points.findIndex(p => p.name === oldItem);
                    if (pointIndex !== -1) {
                        state.points[pointIndex].name = newLocationName;
                        
                        await fetch('/firebase/dropdownpoints', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(state.points)
                        });
                    }
                }
                break;

            case 'subDiv':
                if (!state.selectedLocation) return;
                
                const updatedSubdiv = {
                    image: document.getElementById('edit-subdiv-image').value.trim(),
                    details: {
                        Location: document.getElementById('edit-subdiv-location').value.trim(),
                        'Phone Number': document.getElementById('edit-subdiv-phone').value.trim(),
                        'Email Address': document.getElementById('edit-subdiv-email').value.trim(),
                        Other: document.getElementById('edit-subdiv-other').value.trim()
                    }
                };

                state.subdivs[oldItem] = updatedSubdiv;
                await fetch('/firebase/subdivs', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(state.subdivs)
                });
                break;
        }

        closeModal('edit-modal');
        refreshView();
    } catch (error) {
        console.error('Error updating item:', error);
        alert('Error updating item. Please try again.');
    }
}

async function confirmDelete() {
    const modal = document.getElementById('delete-modal');
    const type = modal.dataset.deleteType;
    const item = modal.dataset.deleteItem;

    try {
        switch (type) {
            case 'destination':
                const index = state.destinations.indexOf(item);
                if (index !== -1) {
                    const updatedDestinations = state.destinations.filter(d => d !== item);
                    await fetch('/firebase/destination', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ categories: updatedDestinations })
                    });
                    
                    state.destinations = updatedDestinations;
                    
                    // Delete associated locations and subdivs
                    if (state.locations[item]) {
                        for (const location of state.locations[item]) {
                            await fetch(`/firebase/subdivs/${location}`, {
                                method: 'DELETE'
                            });
                            delete state.subdivs[location];
                            
                            // Remove associated point
                            state.points = state.points.filter(p => p.name !== location);
                            await fetch('/firebase/dropdownpoints', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(state.points)
                            });
                        }
                        
                        delete state.locations[item];
                        await fetch('/firebase/locations', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(state.locations)
                        });
                    }
                }
                break;

            case 'location':
                if (state.selectedCategory) {
                    // Remove location from locations array
                    state.locations[state.selectedCategory] = state.locations[state.selectedCategory]
                        .filter(loc => loc !== item);
                    
                    await fetch('/firebase/locations', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(state.locations)
                    });

                    // Delete subdiv data
                    await fetch(`/firebase/subdivs/${item}`, {
                        method: 'DELETE'
                    });
                    delete state.subdivs[item];

                    // Remove associated point
                    state.points = state.points.filter(p => p.name !== item);
                    await fetch('/firebase/dropdownpoints', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(state.points)
                    });
                }
                break;

            case 'subDiv':
                if (state.selectedLocation) {
                    state.subdivs[item] = {
                        image: '',
                        details: {
                            Location: '',
                            'Phone Number': '',
                            'Email Address': '',
                            Other: ''
                        }
                    };
                    
                    await fetch('/firebase/subdivs', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(state.subdivs)
                    });
                }
                break;
        }

        closeModal('delete-modal');
        refreshView();
    } catch (error) {
        console.error('Error deleting item:', error);
        alert('Error deleting item. Please try again.');
    }
}

async function saveAllData() {
    try {
        await Promise.all([
            fetch('/firebase/destination', {  // Changed from /admin/firebase/destination
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categories: state.destinations })
            }),
            fetch('/firebase/locations', {  // Changed from /admin/firebase/locations
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(state.locations)
            }),
            fetch('/firebase/subdivs', {  // Changed from /admin/firebase/subdivs
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(state.subdivs)
            }),
            fetch('/firebase/dropdownpoints', {  // Changed from /admin/firebase/dropdownpoints
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(state.points)
            })
        ]);
    } catch (error) {
        console.error('Failed to save data:', error);
        throw new Error('Failed to save data: ' + error.message);
    }
}
async function init() {
    try {
        const [destinationsResponse, locationsResponse, subdivsResponse, pointsResponse] = await Promise.all([
            fetch('/firebase/destination'),
            fetch('/firebase/locations'),
            fetch('/firebase/subdivs'),
            fetch('/firebase/dropdownpoints')
        ]);

        const destinations = await destinationsResponse.json();
        const locations = await locationsResponse.json();
        const subdivs = await subdivsResponse.json();
        const points = await pointsResponse.json();

        // Set state with defaults if data is null/undefined
        state.destinations = destinations.categories || [];
        state.locations = locations || {};
        
        // Ensure each category has a locations array
        state.destinations.forEach(category => {
            if (!state.locations[category]) {
                state.locations[category] = [];
            }
        });
        
        state.subdivs = subdivs || {};
        state.points = points || [];

        renderCategories();
        setupEventListeners();
    } catch (error) {
        console.error('Error initializing app:', error);
        handleError(error, 'Error loading data. Please try again.');
    }
}
async function addItem(type) {
    try {
        switch (type) {
            case 'destination':
                const newCategory = document.getElementById('new-category-name').value.trim();
                if (!newCategory) return;
                
                // Add to Firebase through server
                await fetch('/firebase/destination', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        categories: [...state.destinations, newCategory] 
                    })
                });
                
                state.destinations.push(newCategory);
                state.locations[newCategory] = [];
                
                // Create empty location entry
                await fetch('/firebase/locations', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(state.locations)
                });
                break;

            case 'location':
                const newLocation = document.getElementById('new-location-name').value.trim();
                if (!newLocation || !state.selectedCategory) return;
                
                // Initialize the locations array for the category if it doesn't exist
                if (!state.locations[state.selectedCategory]) {
                    state.locations[state.selectedCategory] = [];
                }
                
                // Update locations in Firebase
                state.locations[state.selectedCategory].push(newLocation);
                await fetch('/firebase/locations', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(state.locations)
                });
                
                // Initialize subdivs for new location
                const newSubdiv = {
                    image: '',
                    details: {
                        Location: '',
                        'Phone Number': '',
                        'Email Address': '',
                        Other: ''
                    }
                };
                state.subdivs[newLocation] = newSubdiv;
                
                await fetch('/firebase/subdivs', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(state.subdivs)
                });
                
                // Add new point
                const newPoint = {
                    name: newLocation,
                    point: `POINT ${state.points.length + 1}`
                };
                
                state.points.push(newPoint);
                await fetch('/firebase/dropdownpoints', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(state.points)
                });
                break;

            case 'subDiv':
                if (!state.selectedLocation) return;
                
                const subdiv = {
                    image: document.getElementById('new-subdiv-image').value.trim(),
                    details: {
                        Location: document.getElementById('new-subdiv-location').value.trim(),
                        'Phone Number': document.getElementById('new-subdiv-phone').value.trim(),
                        'Email Address': document.getElementById('new-subdiv-email').value.trim(),
                        Other: document.getElementById('new-subdiv-other').value.trim()
                    }
                };
                
                state.subdivs[state.selectedLocation] = subdiv;
                await fetch('/firebase/subdivs', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(state.subdivs)
                });
                break;
        }

        closeModal('add-modal');
        refreshView();
    } catch (error) {
        console.error('Error adding item:', error);
        handleError(error, 'Error adding item. Please try again.');
    }
}

// Updated point-related functions
async function addNewPoint(locationName) {
    try {
        const newPointValue = document.getElementById('edit-point-value').value.trim();
        if (!newPointValue) {
            handleError(new Error('Missing point value'), 'Please enter a point value');
            return;
        }

        if (!newPointValue.toUpperCase().startsWith('POINT')) {
            handleError(new Error('Invalid point format'), 'Point value should start with "POINT" (e.g., POINT 1)');
            return;
        }

        const newPoint = {
            name: locationName,
            point: newPointValue.toUpperCase()
        };

        state.points.push(newPoint);
        
        // Update all points in Firebase
        await fetch('/firebase/dropdownpoints', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(state.points)
        });

        closeModal('edit-point-modal');
        renderPoints(locationName);
    } catch (error) {
        handleError(error, 'Error adding point. Please try again.');
    }
}

async function updatePoint() {
    try {
        const newPointValue = document.getElementById('edit-point-value').value.trim();
        if (!newPointValue) {
            handleError(new Error('Missing point value'), 'Please enter a point value');
            return;
        }

        const pointIndex = state.points.findIndex(p => p.name === state.selectedPoint);
        if (pointIndex !== -1) {
            state.points[pointIndex].point = newPointValue;
            
            // Update in Firebase
            await fetch('/firebase/dropdownpoints', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(state.points)
            });
            
            closeModal('edit-point-modal');
            renderPoints(state.selectedPoint);
        }
    } catch (error) {
        handleError(error, 'Error updating point. Please try again.');
    }
}

// Helper functions remain the same
function refreshView() {
    renderCategories();
    if (state.selectedCategory) {
        renderLocations(state.selectedCategory);
        if (state.selectedLocation) {
            renderSubdivs(state.selectedLocation);
            renderPoints(state.selectedLocation);
        }
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function handleError(error, message) {
    console.error('Error:', error);
    alert(message || 'An error occurred. Please try again.');
}
function renderPoints(location) {
    const container = document.getElementById('points-container');
    container.innerHTML = '';

    if (!location) return;

    const pointInfo = state.points.find(p => p.name === location);
    
    if (pointInfo) {
        // If point exists, show the point and edit button
        const div = document.createElement('div');
        div.className = 'point-item';
        div.innerHTML = `
            <span class="point-value">${pointInfo.point}</span>
            <button class="edit-btn" onclick="showEditPointModal('${location}')">Edit Point</button>
        `;
        container.appendChild(div);
    } else {
        // If point doesn't exist, show the Add Point button
        const div = document.createElement('div');
        div.className = 'point-item add-point-container';
        div.innerHTML = `
            <button class="add-point-btn" onclick="showAddPointModal('${location}')">
                <span class="plus-icon">+</span>
                Add a Point
            </button>
        `;
        container.appendChild(div);
    }
}

// Updated showAddPointModal function
function showAddPointModal(locationName) {
    const modal = document.getElementById('edit-point-modal');
    const modalTitle = modal.querySelector('h2');
    modalTitle.textContent = 'Add New Point';
    
    // Set empty input value
    document.getElementById('edit-point-value').value = '';
    document.getElementById('edit-point-value').placeholder = 'Enter point number (e.g., POINT 1)';
    
    state.selectedPoint = locationName;
    
    // Change the update button text to "Add"
    const updateButton = modal.querySelector('.modal-buttons button');
    updateButton.textContent = 'Add Point';
    updateButton.onclick = () => addNewPoint(locationName);
    
    modal.style.display = 'block';
}

function showEditPointModal(locationName) {
    const pointInfo = state.points.find(p => p.name === locationName);
    if (!pointInfo) return;

    const modal = document.getElementById('edit-point-modal');
    document.getElementById('edit-point-value').value = pointInfo.point;
    state.selectedPoint = locationName;
    modal.style.display = 'block';
}


// Add function to save points
async function savePoints() {
    try {
        await fetch('dropdownpoints.json', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(state.points)
        });
    } catch (error) {
        throw new Error('Failed to save points data: ' + error.message);
    }
}



// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    init().catch(error => handleError(error, 'Failed to initialize application'));
});

// Check for logged in user
document.addEventListener('DOMContentLoaded', function() {
    const adminUser = sessionStorage.getItem('adminUser');
    if (!adminUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Update username displays
    document.getElementById('adminUsername').textContent = adminUser;
    document.getElementById('dropdownUsername').textContent = adminUser;
});

// Toggle profile dropdown
function toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.classList.toggle('active');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const profileSection = document.querySelector('.profile-section');
    const dropdown = document.getElementById('profileDropdown');
    
    if (!profileSection.contains(event.target)) {
        dropdown.classList.remove('active');
    }
});

// Logout function
function logout() {
    sessionStorage.removeItem('adminUser');
    window.location.href = 'login.html';
}