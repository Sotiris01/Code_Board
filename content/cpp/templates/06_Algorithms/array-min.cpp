// Find Minimum in Array

#include <iostream>
using namespace std;

int findMin(int arr[], int size) {
    if (size <= 0) return 0;
    
    int minVal = arr[0];
    for (int i = 1; i < size; i++) {
        if (arr[i] < minVal) {
            minVal = arr[i];
        }
    }
    return minVal;
}

int main() {
    int numbers[] = {3, 7, 2, 9, 1, 5};
    int size = sizeof(numbers) / sizeof(numbers[0]);
    
    cout << "Minimum: " << findMin(numbers, size) << endl;
    
    return 0;
}
