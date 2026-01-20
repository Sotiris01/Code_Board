// Greatest Common Divisor (GCD)

#include <iostream>
using namespace std;

// Euclidean algorithm
int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Recursive version
int gcdRecursive(int a, int b) {
    if (b == 0) return a;
    return gcdRecursive(b, a % b);
}

int main() {
    int a = 48, b = 18;
    
    cout << "GCD(" << a << ", " << b << ") = " << gcd(a, b) << endl;
    cout << "GCD (recursive) = " << gcdRecursive(a, b) << endl;
    
    return 0;
}
