/*
 * Άσκηση: Κωδικός Pierce
 * Επίπεδο: 3
 * 
 * Περιγραφή:
 * Γράψτε πρόγραμμα που ζητά από τον χρήστη να εισάγει τον κωδικό του.
 * Το πρόγραμμα συνεχίζει να ζητά τον κωδικό μέχρι να εισαχθεί ο σωστός.
 * Ο σωστός κωδικός είναι "Pierce".
 * Όταν εισαχθεί σωστός κωδικός, εμφανίζει:
 * "You made X attempts to type the correct password"
 * 
 * Παράδειγμα:
 * Είσοδος: abc, 123, Pierce
 * Έξοδος: You made 3 attempts to type the correct password
 */

#include <iostream>
#include <string>
using namespace std;

int main() {
    string password;
    int attempts = 0;
    
    // Διαβάζουμε τον πρώτο κωδικό
    cout << "Enter password: ";
    cin >> password;
    attempts = 1;
    
    // Βρόχος while μέχρι να εισαχθεί ο σωστός κωδικός
    while (password != "Pierce") {
        cout << "Wrong password! Try again: ";
        cin >> password;
        attempts = attempts + 1;
    }
    
    cout << "You made " << attempts << " attempts to type the correct password" << endl;
    
    return 0;
}
