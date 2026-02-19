/*
 * Άσκηση: Αναζήτηση Συνεχόμενων
 * Επίπεδο: 3
 * 
 * Περιγραφή:
 * Διάβασε αριθμούς μέχρι να δοθεί 0.
 * Βρες τη μεγαλύτερη ακολουθία συνεχόμενων αυξανόμενων αριθμών.
 * 
 * Παράδειγμα:
 * Είσοδος: 3, 5, 7, 2, 4, 6, 8, 10, 1, 0
 * Ακολουθίες: [3,5,7]=3, [2,4,6,8,10]=5, [1]=1
 * Μέγιστη ακολουθία: 5 συνεχόμενοι αυξανόμενοι
 */

#include <iostream>
using namespace std;

int main() {
    int number;
    int previous;
    int currentStreak = 1;
    int maxStreak = 1;
    bool firstNumber = true;
    
    cout << "Δώσε αριθμούς (0 για τέλος):" << endl;
    
    // TODO: Γράψε ένα while(true) loop
    //
    // Μέσα στο loop:
    // 1. Διάβασε αριθμό
    // 2. Αν είναι 0, break
    //
    // 3. Αν είναι ο πρώτος αριθμός (firstNumber == true):
    //    - Θέσε firstNumber = false
    //    - previous = number
    //    - continue
    //
    // 4. Αν number > previous (αυξανόμενος):
    //    - Αύξησε currentStreak
    //    - Αν currentStreak > maxStreak:
    //        * maxStreak = currentStreak
    //
    // 5. Αλλιώς (διακοπή ακολουθίας):
    //    - currentStreak = 1 (επαναφορά)
    //
    // 6. previous = number (για την επόμενη σύγκριση)
    
    
    
    cout << "Μέγιστη ακολουθία αυξανόμενων: " << maxStreak << " αριθμοί" << endl;
    
    return 0;
}
