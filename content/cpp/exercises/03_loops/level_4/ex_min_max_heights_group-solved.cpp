/*
 * Άσκηση: Μέγιστο και ελάχιστο ύψος παρέας
 * Επίπεδο: 4
 * 
 * Περιγραφή:
 * Γράψτε πρόγραμμα που ζητά το πλήθος των ατόμων σε μία παρέα.
 * Διαβάζει τα ύψη κάθε ατόμου και εμφανίζει το μεγαλύτερο
 * και το χαμηλότερο ύψος.
 * 
 * Παράδειγμα:
 * Πλήθος ατόμων: 4
 * Ύψη: 1.70 1.65 1.82 1.75
 * Μεγαλύτερο ύψος: 1.82
 * Χαμηλότερο ύψος: 1.65
 */

#include <iostream>
using namespace std;

int main() {
    int count;
    double height;
    double maxHeight, minHeight;
    
    cout << "Πόσα άτομα είναι στην παρέα; ";
    cin >> count;
    
    // Διαβάζουμε το πρώτο ύψος
    cout << "Ύψος 1: ";
    cin >> height;
    maxHeight = height;
    minHeight = height;
    
    // Διαβάζουμε τα υπόλοιπα ύψη
    for (int i = 2; i <= count; i++) {
        cout << "Ύψος " << i << ": ";
        cin >> height;
        
        // Έλεγχος για νέο μέγιστο
        if (height > maxHeight) {
            maxHeight = height;
        }
        
        // Έλεγχος για νέο ελάχιστο
        if (height < minHeight) {
            minHeight = height;
        }
    }
    
    cout << "Μεγαλύτερο ύψος: " << maxHeight << endl;
    cout << "Χαμηλότερο ύψος: " << minHeight << endl;
    
    return 0;
}
