// src/arktype-vs-zod.ts
import { type } from 'arktype';
import { z } from 'zod';

console.log("=============== ARKTYPE VS ZOD COMPARISON ===============");

// ===== BASIC TYPE DEFINITIONS =====
console.log("\n1. BASIC TYPE DEFINITIONS");

// Arktype
const ArkBasicUser = type({
    name: 'string',
    age: 'number'
});

// Zod
const ZodBasicUser = z.object({
    name: z.string(),
    age: z.number()
});

console.log("Arktype:", ArkBasicUser.description);
console.log("Zod:", ZodBasicUser);

// ===== CONSTRAINTS AND VALIDATION =====
console.log("\n2. CONSTRAINTS AND VALIDATION");

// Arktype - more declarative style
const ArkConstrainedUser = type({
    username: '3 <= string <= 20',
    email: 'string.email',
    age: '18 <= number <= 120',
    // I dind'nt find a way to validate float precision in Arktype
    /**score: 'number(2)'**/
});

// Zod - method chaining
const ZodConstrainedUser = z.object({
    username: z.string().min(3).max(20),
    email: z.string().email(),
    age: z.number().min(18).max(120),
    score: z.number().min(0).multipleOf(0.01)
});

console.log("Arktype:", ArkConstrainedUser.description);
console.log("Zod:", ZodConstrainedUser);

// ===== NESTED OBJECTS =====
console.log("\n3. NESTED OBJECTS");

// Arktype
const ArkNestedUser = type({
    profile: {
        firstName: 'string',
        lastName: 'string',
        address: {
            street: 'string',
            city: 'string',
            zipCode: 'string'
        }
    }
});

// Zod
const ZodNestedUser = z.object({
    profile: z.object({
        firstName: z.string(),
        lastName: z.string(),
        address: z.object({
            street: z.string(),
            city: z.string(),
            zipCode: z.string()
        })
    })
});

// ===== UNION TYPES =====
console.log("\n4. UNION TYPES");

// Arktype
const ArkShape = type("'circle' | 'square' | 'triangle'");
// Zod
const ZodShape = z.enum(["circle", "square", "triangle"]);

// Arktype - union of different types
const ArkId = type("string | number");
// Zod - union of different types
const ZodId = z.union([z.string(), z.number()]);

console.log("Arktype enum:", ArkShape.description);
console.log("Zod enum:", ZodShape);
console.log("Arktype union:", ArkId.description);
console.log("Zod union:", ZodId);

// ===== ARRAYS =====
console.log("\n5. ARRAYS");

// Arktype
const ArkStringArray = type('string[]');
const ArkConstrainedArray = type('(1 <= string <= 10)[]');
const ArkTuple = type(["string", "number", "boolean"]);

// Zod
const ZodStringArray = z.array(z.string());
const ZodConstrainedArray = z.array(z.string().min(1).max(10));
const ZodTuple = z.tuple([z.string(), z.number(), z.boolean()]);

console.log("Arktype array:", ArkStringArray.description);
console.log("Zod array:", ZodStringArray);

// ===== OPTIONAL PROPERTIES =====
console.log("\n6. OPTIONAL PROPERTIES");

// Arktype
const ArkOptionalProps = type({
    required: 'string',
    optional: 'string?'
});

// Zod
const ZodOptionalProps = z.object({
    required: z.string(),
    optional: z.string().optional()
});

console.log("Arktype optional:", ArkOptionalProps.description);
console.log("Zod optional:", ZodOptionalProps);

// ===== SPECIAL SYNTAX FEATURES =====
console.log("\n7. SPECIAL SYNTAX FEATURES");

// Arktype template literals
type ArkEmailPattern = `${string}@${string}.${string}`;
const ArkEmailPattern: unique symbol = Symbol('ArkEmailPattern');
// No direct equivalent in Zod (would use regex or .email())

// Arktype range syntax
const ArkAgeRange = type('13 <= number <= 120');
// Zod equivalent
const ZodAgeRange = z.number().min(13).max(120);

// ===== ERROR HANDLING =====
console.log("\n8. ERROR HANDLING");

const invalidData = {
    name: 123,
    age: "twenty"
};

// Arktype
try {
    ArkBasicUser(invalidData);
} catch (error: any) {
    console.log("Arktype error:", error.message);
}

// Zod
const zodResult = ZodBasicUser.safeParse(invalidData);
if (!zodResult.success) {
    console.log("Zod error:", zodResult.error.errors);
}

// ===== TYPE INFERENCE =====
console.log("\n9. TYPE INFERENCE");

// Arktype
type ArkUserType = typeof ArkBasicUser.infer;
const arkUser: ArkUserType = { name: "John", age: 30 };

// Zod
type ZodUserType = z.infer<typeof ZodBasicUser>;
const zodUser: ZodUserType = { name: "John", age: 30 };

console.log("Types are inferred in both libraries");

// ===== PERFORMANCE COMPARISON =====
console.log("\n10. PERFORMANCE COMPARISON");

const testData = { name: "Test", age: 25 };
const iterations = 10000;

console.log(`Running ${iterations} validations...`);

console.time("Arktype");
for (let i = 0; i < iterations; i++) {
    ArkBasicUser.allows(testData);
}
console.timeEnd("Arktype");

console.time("Zod");
for (let i = 0; i < iterations; i++) {
    ZodBasicUser.safeParse(testData);
}
console.timeEnd("Zod");

console.log("\n=============== COMPARISON COMPLETE ===============");
