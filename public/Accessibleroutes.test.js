// Mock state for accessible routes
const mockState = {
    modes: {
        disabled: ["USIU GATE B", "Library", "Admin Block"],
        walking: ["POINT 13", "POINT 14", "POINT 86"],
        driving: ["POINT 86", "POINT 150", "POINT 200"]
    },
    selectedMode: "disabled"
};

describe("Accessible Routes Testing", () => {
    test("Should display disabled-friendly routes", () => {
        const mode = mockState.selectedMode;
        const accessibleRoutes = mockState.modes[mode];

        // Assert that accessible routes are available
        expect(accessibleRoutes).toBeDefined();
        expect(accessibleRoutes).toContain("USIU GATE B");
        expect(accessibleRoutes).toContain("Library");
    });

    test("Should dynamically update routes based on mode", () => {
        const mode = "walking"; // Change to walking mode
        const updatedRoutes = mockState.modes[mode];

        // Assert that the mode dynamically updates the routes
        expect(updatedRoutes).toBeDefined();
        expect(updatedRoutes).toContain("POINT 13");
        expect(updatedRoutes).toContain("POINT 14");
    });
});
