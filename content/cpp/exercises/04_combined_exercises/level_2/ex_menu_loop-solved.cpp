/*
 * Άσκηση: Μενού με Επαναλήψεις
 * Επίπεδο: 2
 * 
 * Περιγραφή:
 * Εμφάνισε ένα μενού με 3 επιλογές:
 * 1. Γεια σου
 * 2. Τυχαίος αριθμός
 * 3. Έξοδος
 */

#include <iostream>
#include <cstdlib>
#include <ctime>
using namespace std;

int main() {
    int choice;
    
    srand(time(0));  // Αρχικοποίηση γεννήτριας τυχαίων
    
    // ΛΥΣΗ: Do-while loop με if-else if
    do {
        cout << "\n=== ΜΕΝΟΥ ===" << endl;
        cout << "1. Γεια σου" << endl;
        cout << "2. Τυχαίος αριθμός (1-100)" << endl;
        cout << "3. Έξοδος" << endl;
        cout << "Επιλογή: ";
        cin >> choice;
        
        if (choice == 1) {
            cout << "Γεια σου, φίλε!" << endl;
        } else if (choice == 2) {
            int random = rand() % 100 + 1;
            cout << "Τυχαίος αριθμός: " << random << endl;
        } else if (choice == 3) {
            cout << "Αντίο!" << endl;
        } else {
            cout << "Λάθος επιλογή! Δοκίμασε ξανά." << endl;
        }
        
    } while (choice != 3);
    
    return 0;
}
