/**
 * C++ Language Module - Content Provider
 * Provides initial code, exercises, and algorithms for C++
 */

(function() {
    // Ensure namespace exists
    window.Languages = window.Languages || {};
    window.Languages.Cpp = window.Languages.Cpp || {};

    /**
     * Initial code shown when C++ is selected
     */
    const initialCode = `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`;

    /**
     * Exercise categories
     * Placeholder for future content
     */
    const exercises = [
        // Future: Add C++ exercises
    ];

    /**
     * Algorithm examples
     * Placeholder for future content
     */
    const algorithms = [
        // Future: Add C++ algorithm examples
    ];

    /**
     * Template files available for C++
     */
    const templates = [
        {
            id: 'hello',
            name: 'Hello World',
            code: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`
        },
        {
            id: 'input-output',
            name: 'Input/Output',
            code: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string name;
    int age;
    
    cout << "Enter your name: ";
    getline(cin, name);
    
    cout << "Enter your age: ";
    cin >> age;
    
    cout << "Hello, " << name << "!" << endl;
    cout << "You are " << age << " years old." << endl;
    
    return 0;
}`
        },
        {
            id: 'for-loop',
            name: 'For Loop',
            code: `#include <iostream>
using namespace std;

int main() {
    // Print numbers 1 to 10
    for (int i = 1; i <= 10; i++) {
        cout << i << " ";
    }
    cout << endl;
    
    return 0;
}`
        },
        {
            id: 'array',
            name: 'Array Example',
            code: `#include <iostream>
using namespace std;

int main() {
    int numbers[] = {5, 2, 8, 1, 9};
    int size = sizeof(numbers) / sizeof(numbers[0]);
    
    cout << "Array elements: ";
    for (int i = 0; i < size; i++) {
        cout << numbers[i] << " ";
    }
    cout << endl;
    
    // Find sum
    int sum = 0;
    for (int i = 0; i < size; i++) {
        sum += numbers[i];
    }
    cout << "Sum: " << sum << endl;
    
    return 0;
}`
        },
        {
            id: 'vector',
            name: 'Vector Example',
            code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> numbers = {5, 2, 8, 1, 9, 3};
    
    // Print all elements
    cout << "Numbers: ";
    for (int n : numbers) {
        cout << n << " ";
    }
    cout << endl;
    
    // Sort the vector
    sort(numbers.begin(), numbers.end());
    
    cout << "Sorted: ";
    for (int n : numbers) {
        cout << n << " ";
    }
    cout << endl;
    
    return 0;
}`
        },
        {
            id: 'class',
            name: 'Class Example',
            code: `#include <iostream>
#include <string>
using namespace std;

class Rectangle {
private:
    double width;
    double height;
    
public:
    Rectangle(double w, double h) : width(w), height(h) {}
    
    double area() {
        return width * height;
    }
    
    double perimeter() {
        return 2 * (width + height);
    }
};

int main() {
    Rectangle rect(5.0, 3.0);
    
    cout << "Area: " << rect.area() << endl;
    cout << "Perimeter: " << rect.perimeter() << endl;
    
    return 0;
}`
        },
        {
            id: 'function',
            name: 'Function Example',
            code: `#include <iostream>
using namespace std;

// Function declaration
int factorial(int n);
bool isPrime(int n);

int main() {
    int num = 5;
    
    cout << num << "! = " << factorial(num) << endl;
    cout << num << " is " << (isPrime(num) ? "prime" : "not prime") << endl;
    
    return 0;
}

// Factorial function
int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// Prime check function
bool isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}`
        }
    ];

    // Register to namespace with proper structure matching GLOSSA/Python
    window.Languages.Cpp.content = {
        // Initial code
        initialCode,
        
        // Algorithms - with getDropdownData method for dropdown population
        algorithms: {
            getDropdownData() {
                return [];
            },
            get(id) {
                return algorithms.find(a => a.id === id) || null;
            }
        },
        
        // Exercises - with getDropdownData method for dropdown population  
        exercises: {
            getDropdownData() {
                return [];
            },
            get(id) {
                return exercises.find(e => e.id === id) || null;
            }
        },
        
        // Templates - with getDropdownData method for dropdown population
        templates: {
            getDropdownData() {
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

    console.log('⚡ C++ content module loaded');
})();
