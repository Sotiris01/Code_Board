// Linear Search

#include <iostream>
using namespace std;

int linearSearch(int arr[], int size, int target) {
    for (int i = 0; i < size; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}

int main() {
    int numbers[] = {3, 7, 2, 9, 1, 5};
    int size = sizeof(numbers) / sizeof(numbers[0]);
    int target = 9;
    
    int index = linearSearch(numbers, size, target);
    
    if (index != -1) {
        cout << "Found " << target << " at index " << index << endl;
    } else {
        cout << target << " not found" << endl;
    }
    
    return 0;
}
