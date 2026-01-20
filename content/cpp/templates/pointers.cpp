// Pointer Basics

#include <iostream>
using namespace std;

int main() {
    int x = 10;
    int* ptr = &x;  // Pointer to x
    
    cout << "Value of x: " << x << endl;
    cout << "Address of x: " << &x << endl;
    cout << "Pointer ptr: " << ptr << endl;
    cout << "Value via ptr: " << *ptr << endl;
    
    // Modify value via pointer
    *ptr = 20;
    cout << "New value of x: " << x << endl;
    
    // Pointer arithmetic with arrays
    int arr[] = {1, 2, 3, 4, 5};
    int* p = arr;
    
    cout << "Array via pointer: ";
    for (int i = 0; i < 5; i++) {
        cout << *(p + i) << " ";
    }
    cout << endl;
    
    return 0;
}
