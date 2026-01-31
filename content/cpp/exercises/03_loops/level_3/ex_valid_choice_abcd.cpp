/*
 * Άσκηση: Έγκυρη επιλογή A, B, C, D
 * Επίπεδο: 3
 * 
 * Περιγραφή:
 * Γράψτε πρόγραμμα που ζητά από τον χρήστη να επιλέξει μεταξύ A, B, C, D.
 * Το πρόγραμμα επαναλαμβάνει μέχρι ο χρήστης να δώσει έγκυρη επιλογή.
 * 
 * Παράδειγμα:
 * Enter choice (A/B/C/D): X
 * Invalid! Enter A, B, C, or D: Z
 * Invalid! Enter A, B, C, or D: B
 * You selected: B
 * 
 * Υπόδειξη: Χρησιμοποιήστε do-while για να εκτελεστεί τουλάχιστον μία φορά
 */

#include <iostream>
using namespace std;

int main() {
    char choice;
    
    // TODO: Γράψτε βρόχο do-while που ζητά επιλογή
    // μέχρι να εισαχθεί A, B, C ή D
    do {
        cout << "Enter choice (A/B/C/D): ";
        cin >> __________;
        
        // Έλεγχος αν η επιλογή είναι άκυρη
        if (choice != 'A' && choice != 'B' && choice != 'C' && choice != __________) {
            cout << "Invalid! ";
        }
        
    } while (choice != 'A' && choice != __________ && choice != __________ && choice != 'D');
    
    cout << "You selected: " << choice << endl;
    
    return 0;
}
