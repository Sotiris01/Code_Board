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
    
    // Do-while loop για το παιχνίδι
    do {
        cout << "Δώσε την εκτίμησή σου: ";
        cin >> guess;
        attempts++;
        
        // Δίνουμε hints στον χρήστη
        if (guess < secret) {
            cout << "Πολύ μικρό!" << endl;
        }
        else if (guess > secret) {
            cout << "Πολύ μεγάλο!" << endl;
        }
    } while (guess != secret);
    
    cout << "Μπράβο! Το βρήκες σε " << attempts << " προσπάθειες!" << endl;
    
    return 0;
}
