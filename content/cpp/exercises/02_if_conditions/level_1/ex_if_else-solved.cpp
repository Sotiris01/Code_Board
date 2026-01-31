// Άσκηση: If-Else
// Έλεγξε αν ένας αριθμός είναι άρτιος ή περιττός

#include <iostream>
using namespace std;

int main() {
    int number;
    
    cout << "Δώσε έναν αριθμό: ";
    cin >> number;
    
    // Χρησιμοποιούμε % για υπόλοιπο διαίρεσης
    if (number % 2 == 0) {
        cout << "Ο αριθμός είναι άρτιος" << endl;
    }
    else {
        cout << "Ο αριθμός είναι περιττός" << endl;
    }
    
    return 0;
}
