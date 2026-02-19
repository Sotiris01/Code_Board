/*
 * Άσκηση: Εύρεση Μέγιστου και Ελάχιστου με Θέσεις
 * Επίπεδο: 2
 * 
 * Περιγραφή:
 * Διάβασε 8 αριθμούς, βρες max/min και τις θέσεις τους.
 */

#include <iostream>
using namespace std;

int main() {
    int number;
    int max, min;
    int maxPos, minPos;
    
    cout << "Δώσε 8 αριθμούς:" << endl;
    
    // ΛΥΣΗ: For loop με αρχικοποίηση στο πρώτο στοιχείο
    for (int i = 1; i <= 8; i++) {
        cout << "Αριθμός " << i << ": ";
        cin >> number;
        
        if (i == 1) {
            // Πρώτος αριθμός: αρχικοποίηση
            max = number;
            min = number;
            maxPos = 1;
            minPos = 1;
        } else {
            // Υπόλοιποι: σύγκριση
            if (number > max) {
                max = number;
                maxPos = i;
            }
            if (number < min) {
                min = number;
                minPos = i;
            }
        }
    }
    
    cout << "\n=== ΑΠΟΤΕΛΕΣΜΑΤΑ ===" << endl;
    cout << "Μέγιστο: " << max << " (θέση " << maxPos << ")" << endl;
    cout << "Ελάχιστο: " << min << " (θέση " << minPos << ")" << endl;
    
    return 0;
}
