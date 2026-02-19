/*
 * Άσκηση: Σύστημα Βαθμολογίας Μαθητών
 * Επίπεδο: 3
 * 
 * Περιγραφή:
 * Πλήρες σύστημα με επικύρωση, στατιστικά και ποσοστά.
 */

#include <iostream>
using namespace std;

int main() {
    int grade;
    int sum = 0;
    int count = 0;
    int passed = 0;
    int failed = 0;
    
    cout << "=== Σύστημα Βαθμολογίας ===" << endl;
    cout << "(Δώσε -1 για τερματισμό)" << endl << endl;
    
    // ΛΥΣΗ: While loop με επικύρωση και break/continue
    while (true) {
        cout << "Βαθμός: ";
        cin >> grade;
        
        // Έξοδος με -1
        if (grade == -1) {
            break;
        }
        
        // Έλεγχος εγκυρότητας
        if (grade < 0 || grade > 20) {
            cout << "Μη έγκυρος βαθμός! (0-20)" << endl;
            continue;
        }
        
        // Έγκυρος βαθμός - επεξεργασία
        count++;
        sum = sum + grade;
        
        if (grade >= 10) {
            passed++;
        } else {
            failed++;
        }
    }
    
    // ΛΥΣΗ: Εμφάνιση αποτελεσμάτων με έλεγχο
    cout << "\n=== ΣΤΑΤΙΣΤΙΚΑ ===" << endl;
    
    if (count > 0) {
        double average = (double)sum / count;
        double successRate = (double)passed / count * 100;
        
        cout << "Πλήθος βαθμών: " << count << endl;
        cout << "Μέσος όρος: " << average << endl;
        cout << "Επιτυχόντες: " << passed << endl;
        cout << "Αποτυχόντες: " << failed << endl;
        cout << "Ποσοστό επιτυχίας: " << successRate << "%" << endl;
    } else {
        cout << "Δεν εισήχθηκαν βαθμοί." << endl;
    }
    
    return 0;
}
