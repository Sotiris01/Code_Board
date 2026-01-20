// Find Maximum in Array

#include <iostream>
using namespace std;

int findMax(int arr[], int size) {
    if (size <= 0) return 0;
    
    int maxVal = arr[0];
    for (int i = 1; i < size; i++) {
        if (arr[i] > maxVal) {
            maxVal = arr[i];
        }
    }
    return maxVal;
}

int main() {
    int numbers[] = {3, 7, 2, 9, 1, 5};
    int size = sizeof(numbers) / sizeof(numbers[0]);
    
    cout << "Maximum: " << findMax(numbers, size) << endl;
    
    return 0;
}
