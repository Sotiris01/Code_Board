/*
 * Άσκηση: Παιχνίδι Ζάρι με Στατιστικά
 * Επίπεδο: 3
 * 
 * Περιγραφή:
 * Πλήρες παιχνίδι με random, loops και στατιστικά.
 */

#include <iostream>
#include <cstdlib>
#include <ctime>
using namespace std;

int main() {
    int roll;
    int lastRoll = 0;
    int totalRolls = 0;
    int count1 = 0, count2 = 0, count3 = 0;
    int count4 = 0, count5 = 0, count6 = 0;
    
    srand(time(0));  // Αρχικοποίηση random
    
    cout << "=== Παιχνίδι Ζαριού ===" << endl;
    cout << "Φέρε δύο συνεχόμενα 6 για να κερδίσεις!" << endl;
    cout << "(Πάτα Enter για κάθε ρίψη)" << endl << endl;
    
    // ΛΥΣΗ: Κύριο loop παιχνιδιού
    while (true) {
        cout << "Πάτα Enter...";
        cin.get();
        
        // Ρίψη ζαριού
        roll = rand() % 6 + 1;
        totalRolls++;
        
        // Καταγραφή στατιστικών
        if (roll == 1) count1++;
        else if (roll == 2) count2++;
        else if (roll == 3) count3++;
        else if (roll == 4) count4++;
        else if (roll == 5) count5++;
        else if (roll == 6) count6++;
        
        cout << "Ρίψη " << totalRolls << ": Έπεσε " << roll << endl;
        
        // Έλεγχος νίκης
        if (roll == 6 && lastRoll == 6) {
            cout << "\n*** ΝΙΚΗ! Δύο συνεχόμενα 6! ***" << endl;
            break;
        }
        
        lastRoll = roll;
    }
    
    // ΛΥΣΗ: Εμφάνιση στατιστικών
    cout << "\n=== ΣΤΑΤΙΣΤΙΚΑ ===" << endl;
    cout << "Συνολικές ρίψεις: " << totalRolls << endl;
    cout << endl;
    cout << "Κατανομή:" << endl;
    cout << "  1: " << count1 << " φορές" << endl;
    cout << "  2: " << count2 << " φορές" << endl;
    cout << "  3: " << count3 << " φορές" << endl;
    cout << "  4: " << count4 << " φορές" << endl;
    cout << "  5: " << count5 << " φορές" << endl;
    cout << "  6: " << count6 << " φορές" << endl;
    
    // Εύρεση μέγιστου
    int maxCount = count1;
    int maxNum = 1;
    
    if (count2 > maxCount) { maxCount = count2; maxNum = 2; }
    if (count3 > maxCount) { maxCount = count3; maxNum = 3; }
    if (count4 > maxCount) { maxCount = count4; maxNum = 4; }
    if (count5 > maxCount) { maxCount = count5; maxNum = 5; }
    if (count6 > maxCount) { maxCount = count6; maxNum = 6; }
    
    cout << "\nΠιο συχνός αριθμός: " << maxNum << " (" << maxCount << " φορές)" << endl;
    
    return 0;
}
