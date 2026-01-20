// Vector Operations (Dynamic Array)

#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Create vector
    vector<int> numbers = {1, 2, 3, 4, 5};
    
    // Add elements
    numbers.push_back(6);
    numbers.insert(numbers.begin(), 0);
    
    // Remove elements
    numbers.pop_back();
    
    // Access elements
    cout << "First: " << numbers.front() << endl;
    cout << "Last: " << numbers.back() << endl;
    cout << "Size: " << numbers.size() << endl;
    
    // Print all elements
    cout << "Vector: ";
    for (int num : numbers) {
        cout << num << " ";
    }
    cout << endl;
    
    return 0;
}
