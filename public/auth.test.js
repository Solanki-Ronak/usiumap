// Mocking the validateLogin function for testing
function validateLoginMock(username, password) {
    const validCredentials = [
        { username: 'hello1', password: '1234' },
        { username: 'hello2', password: '5678' }
    ];

    const validUser = validCredentials.find(
        cred => cred.username === username && cred.password === password
    );

    return validUser ? "Login successful" : "Invalid credentials";
}

// Test cases
describe('Authentication Tests', () => {
    test('Login with valid credentials should succeed', () => {
        const result = validateLoginMock('hello1', '1234');
        expect(result).toBe('Login successful');
    });

    test('Login with invalid username should fail', () => {
        const result = validateLoginMock('wrongUser', '1234');
        expect(result).toBe('Invalid credentials');
    });

    test('Login with invalid password should fail', () => {
        const result = validateLoginMock('hello1', 'wrongPass');
        expect(result).toBe('Invalid credentials');
    });

    test('Login with both invalid username and password should fail', () => {
        const result = validateLoginMock('wrongUser', 'wrongPass');
        expect(result).toBe('Invalid credentials');
    });

    test('Empty username or password should fail', () => {
        const result = validateLoginMock('', '');
        expect(result).toBe('Invalid credentials');
    });
});
