// Mock state for testing
const state = {
    destinations: ["Library", "School of Science and Humanities", "Admin Block"],
    locations: {
        "Library": ["Main Floor", "Upper Floor"],
        "School of Science and Humanities": ["Hall A", "Hall B"],
        "Admin Block": ["Reception", "Meeting Room"],
    },
};

// Test rendering categories
describe("Performance Testing", () => {
    test("Should render all categories", () => {
        const renderedCategories = [];
        state.destinations.forEach(category => {
            renderedCategories.push(category);
            console.log(`Rendered category: ${category}`);
        });

        expect(renderedCategories).toEqual(state.destinations);
    });

    test("Should render locations for a specific category", () => {
        const selectedCategory = "Library";
        const renderedLocations = [];
        state.locations[selectedCategory].forEach(location => {
            renderedLocations.push(location);
            console.log(`Rendered location: ${location}`);
        });

        expect(renderedLocations).toEqual(state.locations[selectedCategory]);
    });
});
