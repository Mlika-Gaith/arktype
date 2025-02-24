import { type } from 'arktype';

// Define our data schema with proper Arktype syntax
const UserSchema = type({
    id: 'string',
    name: 'string',
    email: 'string.email',
    age: 'number.integer >= 18',
    preferences: {
        theme: "'light' | 'dark'",
        notifications: 'boolean',
        language: "'en' | 'fr' | 'es' | 'de'"
    }
});

// Type alias using Arktype's inference
type User = typeof UserSchema.infer;

// Mock database
const users: User[] = [];

// Create a new user
function createUser(data: unknown): User {
    // Validate and parse input data
    const result = UserSchema(data);

    if (!result) {
        console.error("Validation error:", result);
        throw new Error("Invalid user data");
    }

    users.push(data as User);
    return result as User;
}

// Update user
function updateUser(id: string, data: unknown): User {
    const index = users.findIndex(user => user.id === id);
    if (index === -1) {
        throw new Error("User not found");
    }

    // Partial update: merge existing user with new data
    const existingUser = users[index];
    const updatedData = { ...existingUser, ...data as User };

    // Validate the merged data
    const result = UserSchema(updatedData);

    if (result) {
        console.error("Validation error:", result);
        throw new Error("Invalid user data for update");
    }

    // Update in our "database"
    users[index] = result as User;
    return result;
}

// Example usage
try {
    // Create a valid user
    const newUser = createUser({
        id: "user1",
        name: "John Doe",
        email: "john@example.com",
        age: 25,
        preferences: {
            theme: "dark",
            notifications: true,
            language: "en"
        }
    });
    console.log("User created:", newUser);

    // Try to create an invalid user
    createUser({
        id: "user2",
        name: "Jane Doe",
        email: "not-an-email", // Invalid email
        age: 16, // Too young
        preferences: {
            theme: "blue", // Not a valid theme
            notifications: true,
            language: "en"
        }
    });
} catch (error: any) {
    console.log("Error caught:", error.message);
}

// Show our database
console.log("Users in database:", users);
