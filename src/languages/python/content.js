/**
 * Python Language Module - Content Provider
 * Provides initial code, exercises, and algorithms for Python
 */

(function() {
    // Ensure namespace exists
    window.Languages = window.Languages || {};
    window.Languages.Python = window.Languages.Python || {};

    /**
     * Initial code shown when Python is selected
     */
    const initialCode = `# Python Example
def greet(name):
    print(f"Hello, {name}!")

name = input("What is your name? ")
greet(name)`;

    /**
     * Exercise categories
     * Placeholder for future content
     */
    const exercises = [
        // Future: Add Python exercises
        // {
        //     id: 'basics',
        //     name: 'Basics',
        //     levels: [...]
        // }
    ];

    /**
     * Algorithm examples
     * Placeholder for future content
     */
    const algorithms = [
        // Future: Add Python algorithm examples
        // {
        //     id: 'sorting',
        //     name: 'Sorting Algorithms',
        //     items: [...]
        // }
    ];

    /**
     * Template files available for Python
     * Placeholder for future content
     */
    const templates = [
        {
            id: 'hello',
            name: 'Hello World',
            code: `# Hello World in Python
print("Hello, World!")`
        },
        {
            id: 'input-output',
            name: 'Input/Output',
            code: `# Basic Input/Output
name = input("Enter your name: ")
age = int(input("Enter your age: "))

print(f"Hello {name}, you are {age} years old!")`
        },
        {
            id: 'function',
            name: 'Function Example',
            code: `# Function Example
def calculate_area(width, height):
    """Calculate the area of a rectangle."""
    return width * height

# Test the function
w = float(input("Width: "))
h = float(input("Height: "))
area = calculate_area(w, h)
print(f"Area: {area}")`
        },
        {
            id: 'loop',
            name: 'Loop Example',
            code: `# Loop Example
# Print numbers 1 to 10
for i in range(1, 11):
    print(i)

# Sum of numbers
total = 0
n = int(input("Enter n: "))
for i in range(1, n + 1):
    total += i
print(f"Sum 1 to {n} = {total}")`
        },
        {
            id: 'list',
            name: 'List Example',
            code: `# List Example
numbers = [5, 2, 8, 1, 9, 3]

# Print all elements
print("Numbers:", numbers)

# Find max and min
print("Max:", max(numbers))
print("Min:", min(numbers))

# Sort the list
numbers.sort()
print("Sorted:", numbers)`
        }
    ];

    // Register to namespace with proper structure matching GLOSSA
    window.Languages.Python.content = {
        // Initial code
        initialCode,
        
        // Algorithms - with getDropdownData method for dropdown population
        algorithms: {
            getDropdownData() {
                // Return empty array for now, can be populated later
                return [];
            },
            get(id) {
                return algorithms.find(a => a.id === id) || null;
            }
        },
        
        // Exercises - with getDropdownData method for dropdown population  
        exercises: {
            getDropdownData() {
                // Return empty array for now, can be populated later
                return [];
            },
            get(id) {
                return exercises.find(e => e.id === id) || null;
            }
        },
        
        // Templates - with getDropdownData method for dropdown population
        templates: {
            getDropdownData() {
                // Return templates formatted for dropdown
                return templates.map(t => ({
                    id: t.id,
                    label: t.name
                }));
            },
            get(id) {
                const template = templates.find(t => t.id === id);
                return template ? template.code : null;
            }
        },
        
        // Direct access methods
        getInitialCode() {
            return initialCode;
        },
        getExercises() {
            return exercises;
        },
        getAlgorithms() {
            return algorithms;
        },
        getTemplates() {
            return templates;
        },
        getTemplate(id) {
            return templates.find(t => t.id === id) || null;
        }
    };

    console.log('🐍 Python content module loaded');
})();
