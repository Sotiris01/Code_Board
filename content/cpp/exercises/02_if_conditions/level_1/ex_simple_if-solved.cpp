// Άσκηση: Απλή Συνθήκη
// Έλεγξε αν ένας αριθμός είναι θετικός

#include <iostream>
using namespace std;

int main() {
    int number;
    
    cout << "Δώσε έναν αριθμό: ";
    cin >> number;
    
    // Χρησιμοποιούμε if για έλεγχο συνθήκης
    if (number > 0) {
        cout << "Ο αριθμός είναι θετικός" << endl;
    }
    
    return 0;
}
