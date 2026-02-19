/*
 * Άσκηση: Αναζήτηση Συνεχόμενων
 * Επίπεδο: 3
 * 
 * Περιγραφή:
 * Εύρεση μέγιστης ακολουθίας αυξανόμενων αριθμών.
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
    
    // ΛΥΣΗ: While loop με tracking ακολουθίας
    while (true) {
        cout << "> ";
        cin >> number;
        
        // Τερματισμός με 0
        if (number == 0) {
            break;
        }
        
        // Πρώτος αριθμός - αρχικοποίηση
        if (firstNumber) {
            firstNumber = false;
            previous = number;
            continue;
        }
        
        // Έλεγχος αν είναι αυξανόμενος
        if (number > previous) {
            currentStreak++;
            if (currentStreak > maxStreak) {
                maxStreak = currentStreak;
            }
        } else {
            // Διακοπή ακολουθίας - επαναφορά
            currentStreak = 1;
        }
        
        // Αποθήκευση για επόμενη σύγκριση
        previous = number;
    }
    
    cout << "Μέγιστη ακολουθία αυξανόμενων: " << maxStreak << " αριθμοί" << endl;
    
    return 0;
}
