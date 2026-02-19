/*
 * Άσκηση: Κατηγοριοποίηση Βαθμών
 * Επίπεδο: 2
 * 
 * Περιγραφή:
 * Διάβασε 12 βαθμούς μαθητών και κατηγοριοποίησέ τους.
 */

#include <iostream>
using namespace std;

int main() {
    int grade;
    int failed = 0;     // 0-9
    int medium = 0;     // 10-14
    int good = 0;       // 15-17
    int excellent = 0;  // 18-20
    
    cout << "Εισάγετε 12 βαθμούς:" << endl;
    
    // ΛΥΣΗ: For loop με if-else if chain
    for (int i = 1; i <= 12; i++) {
        cout << "Βαθμός " << i << ": ";
        cin >> grade;
        
        if (grade >= 18) {
            excellent++;
        } else if (grade >= 15) {
            good++;
        } else if (grade >= 10) {
            medium++;
        } else {
            failed++;
        }
    }
    
    // Εμφάνιση αποτελεσμάτων
    cout << "\n=== ΑΠΟΤΕΛΕΣΜΑΤΑ ===" << endl;
    cout << "Αποτυχόντες (0-9):  " << failed << endl;
    cout << "Μέτριοι (10-14):    " << medium << endl;
    cout << "Καλοί (15-17):      " << good << endl;
    cout << "Άριστοι (18-20):    " << excellent << endl;
    
    return 0;
}
