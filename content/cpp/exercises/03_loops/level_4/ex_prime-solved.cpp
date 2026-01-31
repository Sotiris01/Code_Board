// Άσκηση: Έλεγχος Πρώτου Αριθμού
// Έλεγξε αν ένας αριθμός είναι πρώτος

#include <iostream>
using namespace std;

int main() {
    int num;
    bool isPrime = true;
    
    cout << "Δώσε έναν θετικό αριθμό: ";
    cin >> num;
    
    // Ειδικές περιπτώσεις
    if (num <= 1) {
        isPrime = false;
    }
    else {
        // Έλεγχος διαιρετότητας
        for (int i = 2; i < num; i++) {
            // Αν διαιρείται τέλεια, δεν είναι πρώτος
            if (num % i == 0) {
                isPrime = false;
                break;  // Δεν χρειάζεται να συνεχίσουμε
            }
        }
    }
    
    if (isPrime) {
        cout << num << " είναι πρώτος αριθμός" << endl;
    }
    else {
        cout << num << " δεν είναι πρώτος αριθμός" << endl;
    }
    
    return 0;
}
