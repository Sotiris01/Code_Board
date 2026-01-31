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
        // TODO: Έλεγξε αν διαιρείται με κάποιον αριθμό από 2 έως num-1
        for (int i = 2; i < num; __________) {
            // TODO: Αν διαιρείται τέλεια, δεν είναι πρώτος
            if (num __________ i == 0) {
                isPrime = __________;
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
