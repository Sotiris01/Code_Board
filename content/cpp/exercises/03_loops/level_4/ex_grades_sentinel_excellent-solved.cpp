/*
 * Άσκηση: Βαθμοί με τιμή φρουρό - Άριστοι και ποσοστό
 * Επίπεδο: 4
 * 
 * Περιγραφή:
 * Γράψτε πρόγραμμα που διαβάζει βαθμούς μαθητών (άγνωστο πλήθος)
 * και εμφανίζει πόσοι είναι άριστοι (>= 18) και το ποσοστό τους.
 * Η εισαγωγή σταματά όταν δοθεί αρνητικός αριθμός (τιμή φρουρός).
 * 
 * Παράδειγμα:
 * Βαθμοί: 15 18 20 12 19 -1
 * Πλήθος άριστων: 3
 * Ποσοστό άριστων: 60%
 */

#include <iostream>
using namespace std;

int main() {
    int grade;
    int totalCount = 0;     // Συνολικό πλήθος βαθμών
    int excellentCount = 0; // Πλήθος άριστων
    double percentage;
    
    cout << "Εισάγετε βαθμούς (αρνητικός για τερματισμό):" << endl;
    
    cout << "Βαθμός: ";
    cin >> grade;
    
    // Βρόχος while όσο ο βαθμός δεν είναι αρνητικός
    while (grade >= 0) {
        totalCount = totalCount + 1;
        
        // Έλεγχος αν ο βαθμός είναι άριστος
        if (grade >= 18) {
            excellentCount = excellentCount + 1;
        }
        
        cout << "Βαθμός: ";
        cin >> grade;
    }
    
    // Υπολογισμός ποσοστού
    if (totalCount > 0) {
        percentage = (double)excellentCount / totalCount * 100;
        
        cout << "Πλήθος άριστων: " << excellentCount << endl;
        cout << "Ποσοστό άριστων: " << percentage << "%" << endl;
    } else {
        cout << "Δεν εισήχθησαν βαθμοί!" << endl;
    }
    
    return 0;
}
