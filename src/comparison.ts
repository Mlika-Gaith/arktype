// src/comparison.ts
import { type } from 'arktype';
import { z } from 'zod';

console.log("========== BASIC TYPES ==========");

// Define a simple user type with both libraries
// Arktype version
const ArkUser = type({
  id: 'number',
  name: 'string',
  email: 'string',
  age: 'number',
  isActive: 'boolean',
});

// Zod version
const ZodUser = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  age: z.number(),
  isActive: z.boolean(),
});

// Valid user data
const validUser = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  age: 30,
  isActive: true,
};

// Invalid user data
const invalidUser = {
  id: "1", // Should be a number
  name: "Jane Doe",
  email: "jane@example.com",
  age: "twenty", // Should be a number
  isActive: true,
};

// Validate with Arktype
console.log("Arktype validation (valid):", ArkUser.allows(validUser));
console.log("Arktype validation (invalid):", ArkUser.allows(invalidUser));

// Type inference with Arktype
type ArkUserType = typeof ArkUser.infer;
// const user: ArkUserType = ArkUser(validUser);

// Validate with Zod
console.log("Zod validation (valid):", ZodUser.safeParse(validUser).success);
console.log("Zod validation (invalid):", ZodUser.safeParse(invalidUser).success);

// Type inference with Zod
type ZodUserType = z.infer<typeof ZodUser>;

console.log("\n========== ADVANCED VALIDATIONS ==========");

// Arktype version with constraints
const ArkAdvancedUser = type({
  id: 'number',
  name: 'string',
  email: 'string.email',
  age: '17 < number.integer <= 120',
  roles: 'string[]',
  profile: {
    bio: 'string?',
    website: 'string?',
  }
});

// Zod version with constraints
const ZodAdvancedUser = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().min(18).max(120),
  roles: z.array(z.string()),
  profile: z.object({
    bio: z.string().optional(),
    website: z.string().optional(),
  })
});

// Valid advanced user
const validAdvancedUser = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  age: 35,
  roles: ["admin", "user"],
  profile: {
    bio: "Software developer",
    website: "https://example.com"
  }
};

// Invalid advanced user
const invalidAdvancedUser = {
  id: 1,
  name: "Jane Doe",
  email: "not-an-email",
  age: 15, // Too young
  roles: ["admin"],
  profile: {
    bio: 123, // Should be string
    website: "https://example.com"
  }
};

// Try parsing with Arktype
console.log("Arktype advanced validation (valid):", ArkAdvancedUser.allows(validAdvancedUser));
console.log("Arktype advanced validation (invalid):", ArkAdvancedUser.allows(invalidUser));

// Try parsing with Zod
const zodValidResult = ZodAdvancedUser.safeParse(validAdvancedUser);
console.log("Zod advanced validation (valid):", zodValidResult.success);

const zodInvalidResult = ZodAdvancedUser.safeParse(invalidAdvancedUser);
console.log("Zod advanced validation (invalid):", zodInvalidResult.success);

// Demonstrate union types
console.log("\n========== UNION TYPES ==========");

// Arktype union type
const ArkStatus = type("'pending' | 'active' | 'inactive'");
const ArkTask = type({
  id: 'number',
  title: 'string',
  status: ArkStatus,
});

// Zod union type
const ZodStatus = z.enum(["pending", "active", "inactive"]);
const ZodTask = z.object({
  id: z.number(),
  title: z.string(),
  status: ZodStatus,
});

const validTask = {
  id: 1,
  title: "Complete project",
  status: "active"
};

const invalidTask = {
  id: 1,
  title: "Complete project",
  status: "completed" // Not in the allowed values
};

console.log("Arktype union validation (valid):", ArkTask.allows(validTask));
console.log("Arktype union validation (invalid):", ArkTask.allows(invalidTask));

console.log("Zod union validation (valid):", ZodTask.safeParse(validTask).success);
console.log("Zod union validation (invalid):", ZodTask.safeParse(invalidTask).success);
