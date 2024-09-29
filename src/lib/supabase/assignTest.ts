const original = { a: 1, b: 2 };

// Another reference to the original object
const reference = original;

// Update the original object directly
original.c = 3;

console.log(original); // { a: 1, b: 2, c: 3 }
console.log(reference); // { a: 1, b: 2, c: 3 }

Object.assign(original, { e: 5, f: 6 });

reference.c = 4;
console.log(original); // { a: 1, b: 2, c: 3 }
console.log(reference); // { a: 1, b: 2, c: 3 }
