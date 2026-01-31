// Άσκηση: 99 Bottles of Beer (από το PDF)
// Κλασική άσκηση αντίστροφης μέτρησης με κείμενο

#include <iostream>
using namespace std;

int main() {
    // TODO: Ξεκίνα από 99 και πήγαινε μέχρι 1
    for (int bottles = 99; bottles >= 1; __________) {
        cout << bottles << " bottles of beer on the wall," << endl;
        cout << bottles << " bottles of beer!" << endl;
        cout << "Take one down, pass it around," << endl;
        
        // TODO: Εμφάνισε πόσα μένουν
        cout << (bottles __________) << " bottles of beer on the wall." << endl;
        cout << endl;
        
        // Σταμάτα μετά από 5 για να μην είναι πολύ μεγάλο
        if (bottles == 95) {
            cout << "... (συνεχίζει μέχρι το 0)" << endl;
            break;
        }
    }
    
    return 0;
}
