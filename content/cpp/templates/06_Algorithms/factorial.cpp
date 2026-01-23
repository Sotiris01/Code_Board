// Factorial Calculation

#include <iostream>
using namespace std;

// Recursive version
long long factorial(int n) {
    if (n < 0) return -1;
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// Iterative version
long long factorialIter(int n) {
    if (n < 0) return -1;
    long long result = 1;
    for (int i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

int main() {
    int n = 5;
    
    cout << n << "! = " << factorial(n) << endl;
    cout << n << "! = " << factorialIter(n) << " (iterative)" << endl;
    
    return 0;
}
