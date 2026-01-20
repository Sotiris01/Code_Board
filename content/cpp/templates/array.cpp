// Array Operations

#include <iostream>
using namespace std;

int main() {
    // Declare and initialize array
    int numbers[5] = {1, 2, 3, 4, 5};
    int size = 5;
    
    // Access elements
    cout << "First: " << numbers[0] << endl;
    cout << "Last: " << numbers[size - 1] << endl;
    
    // Modify element
    numbers[2] = 10;
    
    // Print all elements
    cout << "Array: ";
    for (int i = 0; i < size; i++) {
        cout << numbers[i] << " ";
    }
    cout << endl;
    
    // Calculate sum
    int sum = 0;
    for (int i = 0; i < size; i++) {
        sum += numbers[i];
    }
    cout << "Sum: " << sum << endl;
    
    return 0;
}
