/*
 * Άσκηση: Μέτρηση Άρτιων και Περιττών
 * Επίπεδο: 1
 * 
 * Περιγραφή:
 * Διάβασε 8 αριθμούς από τον χρήστη.
 * Μέτρησε πόσοι είναι άρτιοι (ζυγοί) και πόσοι περιττοί (μονοί).
 * Hint: Ένας αριθμός είναι άρτιος αν number % 2 == 0
 * 
 * Παράδειγμα:
 * Είσοδος: 2, 5, 8, 3, 6, 1, 4, 9
 * Έξοδος: Άρτιοι: 4, Περιττοί: 4
 */

#include <iostream>
using namespace std;

int main() {
    int number;
    int countEven = 0;
    int countOdd = 0;
    
    cout << "Δώσε 8 αριθμούς:" << endl;
    
    // ΛΥΣΗ: For loop με if-else μέσα
    for (int i = 1; i <= 8; i++) {
        cout << "Αριθμός " << i << ": ";
        cin >> number;
        
        if (number % 2 == 0) {
            countEven = countEven + 1;
        } else {
            countOdd = countOdd + 1;
        }
    }
    
    cout << "Άρτιοι: " << countEven << endl;
    cout << "Περιττοί: " << countOdd << endl;
    
    return 0;
}
