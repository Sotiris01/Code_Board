/*
 * ΘΕΜΑ Α - ΛΥΣΗ
 */

#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int num;
    int count = 0, sum = 0;
    int evenCount = 0, oddCount = 0;
    int maxEven = -1, minOdd = 101;
    bool hasEven = false, hasOdd = false;
    
    cout << "Εισαγωγή αριθμών (τερματισμός: -999)" << endl;
    
    while (true) {
        cout << "> ";
        cin >> num;
        
        if (num == -999) break;
        
        // Έλεγχος εγκυρότητας
        if (num < 1 || num > 100) {
            cout << "(Μη έγκυρος)" << endl;
            continue;
        }
        
        // Επεξεργασία έγκυρου
        count++;
        sum += num;
        
        if (num % 2 == 0) {
            evenCount++;
            hasEven = true;
            if (num > maxEven) maxEven = num;
        } else {
            oddCount++;
            hasOdd = true;
            if (num < minOdd) minOdd = num;
        }
    }
    
    // Α2: Αποτελέσματα
    cout << "\n=== ΑΠΟΤΕΛΕΣΜΑΤΑ ===" << endl;
    cout << "i) Πλήθος έγκυρων: " << count << endl;
    
    if (count > 0) {
        double avg = (double)sum / count;
        cout << fixed << setprecision(2);
        cout << "ii) Μέσος όρος: " << avg << endl;
        cout << "iii) Πλήθος άρτιων: " << evenCount << endl;
        cout << "iv) Πλήθος περιττών: " << oddCount << endl;
        
        if (hasEven) {
            cout << "v) Μεγαλύτερος άρτιος: " << maxEven << endl;
        } else {
            cout << "v) Μεγαλύτερος άρτιος: ΔΕΝ ΥΠΑΡΧΕΙ" << endl;
        }
        
        if (hasOdd) {
            cout << "vi) Μικρότερος περιττός: " << minOdd << endl;
        } else {
            cout << "vi) Μικρότερος περιττός: ΔΕΝ ΥΠΑΡΧΕΙ" << endl;
        }
        
        // Α3
        if (avg > 50) {
            cout << "\nΠΑΝΩ ΑΠΟ ΤΟ ΜΕΣΟ" << endl;
        } else {
            cout << "\nΚΑΤΩ ΑΠΟ ΤΟ ΜΕΣΟ" << endl;
        }
    } else {
        cout << "Δεν εισήχθηκαν έγκυροι αριθμοί." << endl;
    }
    
    return 0;
}
