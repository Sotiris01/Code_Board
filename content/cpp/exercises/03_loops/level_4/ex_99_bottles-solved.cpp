// Άσκηση: 99 Bottles of Beer (από το PDF)
// Κλασική άσκηση αντίστροφης μέτρησης με κείμενο

#include <iostream>
using namespace std;

int main() {
    // Αντίστροφη μέτρηση από 99 έως 1
    for (int bottles = 99; bottles >= 1; bottles--) {
        cout << bottles << " bottles of beer on the wall," << endl;
        cout << bottles << " bottles of beer!" << endl;
        cout << "Take one down, pass it around," << endl;
        
        // Εμφάνισε πόσα μένουν
        cout << (bottles - 1) << " bottles of beer on the wall." << endl;
        cout << endl;
        
        // Σταμάτα μετά από 5 για να μην είναι πολύ μεγάλο
        if (bottles == 95) {
            cout << "... (συνεχίζει μέχρι το 0)" << endl;
            break;
        }
    }
    
    return 0;
}
