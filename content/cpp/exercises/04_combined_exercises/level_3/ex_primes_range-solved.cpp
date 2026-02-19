/*
 * Άσκηση: Πρώτοι Αριθμοί σε Εύρος
 * Επίπεδο: 3
 * 
 * Περιγραφή:
 * Εύρεση πρώτων αριθμών με nested loops.
 */

#include <iostream>
using namespace std;

int main() {
    int start, end;
    int countPrimes = 0;
    
    // Είσοδος με επικύρωση
    cout << "Δώσε αρχή διαστήματος: ";
    cin >> start;
    cout << "Δώσε τέλος διαστήματος: ";
    cin >> end;
    
    // Έλεγχος εγκυρότητας
    if (start > end) {
        cout << "Λάθος! Η αρχή πρέπει να είναι <= τέλος" << endl;
        return 0;
    }
    
    cout << "Πρώτοι αριθμοί στο [" << start << ", " << end << "]:" << endl;
    
    // ΛΥΣΗ: Nested loops για έλεγχο πρώτων
    for (int n = start; n <= end; n++) {
        // Αριθμοί < 2 δεν είναι πρώτοι
        if (n < 2) {
            continue;
        }
        
        // Υπόθεση: είναι πρώτος
        bool isPrime = true;
        
        // Έλεγχος αν διαιρείται με κάποιον
        for (int i = 2; i < n; i++) {
            if (n % i == 0) {
                isPrime = false;
                break;
            }
        }
        
        // Αν είναι πρώτος, εμφάνισε
        if (isPrime) {
            cout << n << " ";
            countPrimes++;
        }
    }
    
    cout << "\nΣύνολο πρώτων: " << countPrimes << endl;
    
    return 0;
}
