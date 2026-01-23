// Binary Search (requires sorted array)

#include <iostream>
using namespace std;

int binarySearch(int arr[], int size, int target) {
    int left = 0, right = size - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}

int main() {
    int numbers[] = {1, 2, 3, 5, 7, 9, 11, 13};
    int size = sizeof(numbers) / sizeof(numbers[0]);
    int target = 7;
    
    int index = binarySearch(numbers, size, target);
    
    if (index != -1) {
        cout << "Found " << target << " at index " << index << endl;
    } else {
        cout << target << " not found" << endl;
    }
    
    return 0;
}
