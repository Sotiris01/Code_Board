/*
 * Άσκηση: Προσπάθειες Κωδικού
 * Επίπεδο: 1
 * 
 * Περιγραφή:
 * Ο σωστός κωδικός είναι 1234.
 * Δώσε στον χρήστη 3 προσπάθειες να τον μαντέψει.
 * Αν τον βρει, εμφάνισε "Επιτυχία!" και σταμάτα.
 * Αν εξαντληθούν οι προσπάθειες, εμφάνισε "Αποκλεισμός!"
 */

#include <iostream>
using namespace std;

int main() {
    int password;
    int correctPassword = 1234;
    bool found = false;
    
    cout << "=== Σύστημα Ασφαλείας ===" << endl;
    
    // ΛΥΣΗ: For loop με if-else και break
    for (int i = 1; i <= 3; i++) {
        cout << "Προσπάθεια " << i << ": ";
        cin >> password;
        
        if (password == correctPassword) {
            found = true;
            cout << "Επιτυχία! Πρόσβαση επιτρέπεται." << endl;
            break;
        } else {
            cout << "Λάθος κωδικός" << endl;
        }
    }
    
    // Μετά το loop, έλεγξε αν δεν βρέθηκε
    if (!found) {
        cout << "Αποκλεισμός! Εξαντλήθηκαν οι προσπάθειες." << endl;
    }
    
    return 0;
}
