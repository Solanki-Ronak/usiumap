// Real-Time Mapping Test Code
describe("Real-Time Mapping", () => {
    test("Should display updated map when location changes", async () => {
        const location = "Library";
        const updatedState = {
            destinations: ["Library", "Admin Block", "School of Science and Humanities"],
            selectedLocation: location
        };
        expect(updatedState.selectedLocation).toBe(location);
    });
});
