// Fibonacci Sequence

#include <iostream>
#include <vector>
using namespace std;

// Iterative version
vector<int> fibonacci(int n) {
    vector<int> fib;
    if (n <= 0) return fib;
    
    fib.push_back(0);
    if (n == 1) return fib;
    
    fib.push_back(1);
    for (int i = 2; i < n; i++) {
        fib.push_back(fib[i-1] + fib[i-2]);
    }
    return fib;
}

// Recursive version
int fibRecursive(int n) {
    if (n <= 1) return n;
    return fibRecursive(n-1) + fibRecursive(n-2);
}

int main() {
    int n = 10;
    
    cout << "First " << n << " Fibonacci: ";
    vector<int> fib = fibonacci(n);
    for (int num : fib) {
        cout << num << " ";
    }
    cout << endl;
    
    cout << "Fib(" << n << "): " << fibRecursive(n) << endl;
    
    return 0;
}
