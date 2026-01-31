// Άσκηση: Χρήση break και continue
// Εκτύπωσε αριθμούς 1-10 αλλά παράλειψε το 5 και σταμάτα στο 8

#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 10; i++) {
        // continue: παραλείπει την τρέχουσα επανάληψη
        if (i == 5) {
            continue;
        }
        
        // break: τερματίζει το loop
        if (i == 8) {
            break;
        }
        
        cout << i << " ";
    }
    cout << endl;
    // Έξοδος: 1 2 3 4 6 7
    
    return 0;
}
