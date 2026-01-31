// Άσκηση: Ημέρα της Εβδομάδας
// Εμφάνισε το όνομα της ημέρας από αριθμό (1-7)

#include <iostream>
using namespace std;

int main() {
    int day;
    
    cout << "Δώσε αριθμό ημέρας (1-7): ";
    cin >> day;
    
    // TODO: Χρησιμοποίησε switch για κάθε ημέρα
    switch (day) {
        __________ 1:
            cout << "Δευτέρα" << endl;
            break;
        case 2:
            cout << "Τρίτη" << endl;
            __________;
        case 3:
            cout << "Τετάρτη" << endl;
            break;
        case 4:
            cout << "Πέμπτη" << endl;
            break;
        case 5:
            cout << "Παρασκευή" << endl;
            break;
        case 6:
            cout << "Σάββατο" << endl;
            break;
        case 7:
            cout << "Κυριακή" << endl;
            break;
        default:
            cout << "Μη έγκυρη ημέρα!" << endl;
    }
    
    return 0;
}
