// Prime Number Check

#include <iostream>
#include <cmath>
using namespace std;

bool isPrime(int n) {
    if (n < 2) return false;
    if (n == 2) return true;
    if (n % 2 == 0) return false;
    
    for (int i = 3; i <= sqrt(n); i += 2) {
        if (n % i == 0) return false;
    }
    return true;
}

int main() {
    cout << "Prime numbers from 1 to 20: ";
    for (int num = 1; num <= 20; num++) {
        if (isPrime(num)) {
            cout << num << " ";
        }
    }
    cout << endl;
    
    return 0;
}
