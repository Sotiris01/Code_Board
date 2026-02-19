/*
 * ΑΣΚΗΣΗ: Προσομοίωση ATM
 * 
 * Σωστό PIN: 1234. Ο χρήστης έχει 3 προσπάθειες για να το βρει.
 * Αν αποτύχει 3 φορές, εμφανίζεται "Η κάρτα κλειδώθηκε" και τερματίζει.
 * Αν το βρει, εμφανίζεται μενού:
 *   1. Κατάθεση (ποσό > 0)
 *   2. Ανάληψη (ποσό > 0, όχι πάνω από το υπόλοιπο)
 *   3. Υπόλοιπο
 *   0. Έξοδος
 * Αρχικό υπόλοιπο: 500€. Μετά από κάθε συναλλαγή εμφανίζεται το νέο υπόλοιπο.
 */

#include <iostream>
using namespace std;

int main() {
    int pin, tries = 0;
    double balance = 500;
    bool loggedIn = false;
    
    // Login
    while (tries < 3 && !loggedIn) {
        cout << "PIN: ";
        cin >> pin;
        tries++;
        
        if (pin == 1234) {
            loggedIn = true;
        } else {
            cout << "Λάθος! Απομένουν " << (3 - tries) << endl;
        }
    }
    
    if (!loggedIn) {
        cout << "Κλείδωμα!" << endl;
        return 0;
    }
    
    // Menu
    int choice;
    double amount;
    
    do {
        cout << "\n1.Κατάθεση 2.Ανάληψη 3.Υπόλοιπο 4.Έξοδος\n> ";
        cin >> choice;
        
        if (choice == 1) {
            cout << "Ποσό: ";
            cin >> amount;
            if (amount > 0) balance += amount;
        } else if (choice == 2) {
            cout << "Ποσό: ";
            cin >> amount;
            if (amount > 0 && amount <= balance) {
                balance -= amount;
            } else {
                cout << "Αδύνατο!" << endl;
            }
        } else if (choice == 3) {
            cout << "Υπόλοιπο: " << balance << endl;
        }
    } while (choice != 4);
    
    return 0;
}
