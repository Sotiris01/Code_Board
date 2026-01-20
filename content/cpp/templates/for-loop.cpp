// For Loop

#include <iostream>
using namespace std;

int main() {
    // Basic for loop
    for (int i = 0; i < 5; i++) {
        cout << i << " ";
    }
    cout << endl;
    
    // Range-based for loop (C++11)
    int numbers[] = {1, 2, 3, 4, 5};
    for (int num : numbers) {
        cout << num << " ";
    }
    cout << endl;
    
    return 0;
}
