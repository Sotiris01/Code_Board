/*
 * Άσκηση: Ηλεκτρονικό Πορτοφόλι
 * Επίπεδο: 3
 * 
 * Περιγραφή:
 * Πλήρες σύστημα με κατάθεση, ανάληψη, έλεγχο υπολοίπου.
 */

#include <iostream>
using namespace std;

int main() {
    double balance = 100.0;
    int transactions = 0;
    int choice;
    double amount;
    
    cout << "=== Ηλεκτρονικό Πορτοφόλι ===" << endl;
    cout << "Αρχικό υπόλοιπο: 100€" << endl;
    
    // ΛΥΣΗ: Do-while με πλήρη διαχείριση
    do {
        cout << "\n--- Μενού ---" << endl;
        cout << "1. Κατάθεση" << endl;
        cout << "2. Ανάληψη" << endl;
        cout << "3. Υπόλοιπο" << endl;
        cout << "4. Ιστορικό" << endl;
        cout << "5. Έξοδος" << endl;
        cout << "Επιλογή: ";
        cin >> choice;
        
        if (choice == 1) {
            // Κατάθεση
            cout << "Ποσό κατάθεσης: ";
            cin >> amount;
            
            if (amount > 0) {
                balance = balance + amount;
                transactions++;
                cout << "Κατάθεση " << amount << "€ επιτυχής!" << endl;
            } else {
                cout << "Το ποσό πρέπει να είναι θετικό!" << endl;
            }
            
        } else if (choice == 2) {
            // Ανάληψη
            cout << "Ποσό ανάληψης: ";
            cin >> amount;
            
            if (amount <= 0) {
                cout << "Το ποσό πρέπει να είναι θετικό!" << endl;
            } else if (amount > balance) {
                cout << "Ανεπαρκές υπόλοιπο! Διαθέσιμα: " << balance << "€" << endl;
            } else {
                balance = balance - amount;
                transactions++;
                cout << "Ανάληψη " << amount << "€ επιτυχής!" << endl;
            }
            
        } else if (choice == 3) {
            // Υπόλοιπο
            cout << "Τρέχον υπόλοιπο: " << balance << "€" << endl;
            
        } else if (choice == 4) {
            // Ιστορικό
            cout << "Συνολικές συναλλαγές: " << transactions << endl;
            
        } else if (choice == 5) {
            cout << "Ευχαριστούμε! Αντίο!" << endl;
            
        } else {
            cout << "Λάθος επιλογή! Δοκίμασε ξανά." << endl;
        }
        
    } while (choice != 5);
    
    return 0;
}
