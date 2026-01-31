// Άσκηση: Χρήση break και continue
// Εκτύπωσε αριθμούς 1-10 αλλά παράλειψε το 5 και σταμάτα στο 8

#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 10; i++) {
        // TODO: Αν i == 5, παράλειψέ το με continue
        if (i == 5) {
            __________;
        }
        
        // TODO: Αν i == 8, σταμάτα με break
        if (i == 8) {
            __________;
        }
        
        cout << i << " ";
    }
    cout << endl;
    
    return 0;
}
