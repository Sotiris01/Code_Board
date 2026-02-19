/*
 * Άσκηση: Μάντεψε τον Αριθμό
 * Επίπεδο: 2
 * 
 * Περιγραφή:
 * Ο "μυστικός" αριθμός είναι 42.
 * Δίνονται hints για μεγαλύτερο/μικρότερο.
 */

#include <iostream>
using namespace std;

int main() {
    int secret = 42;
    int guess;
    int attempts = 0;
    
    cout << "=== Μάντεψε τον Αριθμό (1-100) ===" << endl;
    
    // ΛΥΣΗ: Do-while loop με if-else if
    do {
        attempts++;
        cout << "Προσπάθεια " << attempts << " - Μάντεψε: ";
        cin >> guess;
        
        if (guess < secret) {
            cout << "Μεγαλύτερος!" << endl;
        } else if (guess > secret) {
            cout << "Μικρότερος!" << endl;
        } else {
            cout << "Μπράβο! Τον βρήκες σε " << attempts << " προσπάθειες!" << endl;
        }
        
    } while (guess != secret);
    
    return 0;
}
