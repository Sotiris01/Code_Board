// Άσκηση: Παιχνίδι Μαντέψτε τον Αριθμό (από το PDF)
// Ο χρήστης μαντεύει έναν τυχαίο αριθμό

#include <iostream>
#include <cstdlib>
#include <ctime>
using namespace std;

int main() {
    // Δημιουργία τυχαίου αριθμού 1-100
    srand(time(0));
    int secret = rand() % 100 + 1;
    int guess;
    int attempts = 0;
    
    cout << "Μάντεψε τον αριθμό (1-100)!" << endl;
    
    // TODO: Συμπλήρωσε το loop
    __________ {
        cout << "Δώσε την εκτίμησή σου: ";
        cin >> guess;
        attempts++;
        
        // TODO: Έλεγξε αν guess < secret ή guess > secret
        if (guess __________ secret) {
            cout << "Πολύ μικρό!" << endl;
        }
        else if (guess __________ secret) {
            cout << "Πολύ μεγάλο!" << endl;
        }
    } __________ (guess != secret);
    
    cout << "Μπράβο! Το βρήκες σε " << attempts << " προσπάθειες!" << endl;
    
    return 0;
}
