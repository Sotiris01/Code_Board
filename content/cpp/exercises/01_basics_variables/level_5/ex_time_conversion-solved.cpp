// Άσκηση: Μετατροπή Χρόνου
// Μετάτρεψε δευτερόλεπτα σε ώρες:λεπτά:δευτερόλεπτα

#include <iostream>
using namespace std;

int main() {
    int totalSeconds;
    
    cout << "Δώσε τον αριθμό δευτερολέπτων: ";
    cin >> totalSeconds;
    
    // Υπολογίζουμε τις ώρες (3600 sec = 1 hour)
    int hours = totalSeconds / 3600;
    
    // Υπόλοιπα δευτερόλεπτα μετά τις ώρες
    int remaining = totalSeconds % 3600;
    
    // Λεπτά από τα υπόλοιπα
    int minutes = remaining / 60;
    
    // Τελικά δευτερόλεπτα
    int seconds = remaining % 60;
    
    cout << totalSeconds << " δευτερόλεπτα = ";
    cout << hours << " ώρες, ";
    cout << minutes << " λεπτά, ";
    cout << seconds << " δευτερόλεπτα" << endl;
    
    return 0;
}
