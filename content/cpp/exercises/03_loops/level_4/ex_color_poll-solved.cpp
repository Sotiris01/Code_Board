/*
 * Άσκηση: Έρευνα αγαπημένου χρώματος
 * Επίπεδο: 4
 * 
 * Περιγραφή:
 * Γράψτε πρόγραμμα που καταμετρά απαντήσεις σε έρευνα για αγαπημένο χρώμα.
 * Εμφανίζει 4 επιλογές: 1.Blue 2.Red 3.Yellow 4.Other
 * Καταμετρά τις απαντήσεις μέχρι να πληκτρολογηθεί 0.
 * Τέλος εμφανίζει τα αποτελέσματα και το ποσοστό του "Other".
 * 
 * Παράδειγμα:
 * Απαντήσεις: 1 2 1 4 3 2 4 0
 * Blue: 2, Red: 2, Yellow: 1, Other: 2
 * Ποσοστό Other: 28.57%
 */

#include <iostream>
using namespace std;

int main() {
    int choice;
    int countBlue = 0, countRed = 0, countYellow = 0, countOther = 0;
    int total;
    double percentOther;
    
    cout << "Έρευνα: Ποιο είναι το αγαπημένο σου χρώμα?" << endl;
    cout << "1. Blue" << endl;
    cout << "2. Red" << endl;
    cout << "3. Yellow" << endl;
    cout << "4. Other" << endl;
    cout << "0. Τέλος έρευνας" << endl;
    cout << endl;
    
    cout << "Επιλογή: ";
    cin >> choice;
    
    // Βρόχος while μέχρι choice == 0
    while (choice != 0) {
        // Καταμέτρηση ανάλογα με την επιλογή
        if (choice == 1) {
            countBlue = countBlue + 1;
        } else if (choice == 2) {
            countRed = countRed + 1;
        } else if (choice == 3) {
            countYellow = countYellow + 1;
        } else if (choice == 4) {
            countOther = countOther + 1;
        }
        
        cout << "Επιλογή: ";
        cin >> choice;
    }
    
    // Υπολογισμός συνόλου και ποσοστού
    total = countBlue + countRed + countYellow + countOther;
    
    cout << "\n=== ΑΠΟΤΕΛΕΣΜΑΤΑ ===" << endl;
    cout << "Blue: " << countBlue << endl;
    cout << "Red: " << countRed << endl;
    cout << "Yellow: " << countYellow << endl;
    cout << "Other: " << countOther << endl;
    
    if (total > 0) {
        percentOther = (double)countOther / total * 100;
        cout << "Ποσοστό Other: " << percentOther << "%" << endl;
    }
    
    return 0;
}
