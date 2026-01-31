// Άσκηση: Μετατροπή Χρόνου
// Μετάτρεψε δευτερόλεπτα σε ώρες:λεπτά:δευτερόλεπτα

#include <iostream>
using namespace std;

int main() {
    int totalSeconds;
    
    cout << "Δώσε τον αριθμό δευτερολέπτων: ";
    cin >> totalSeconds;
    
    // TODO: Υπολόγισε τις ώρες
    // Hint: ακέραια διαίρεση με 3600 (60*60)
    int hours = totalSeconds / __________;
    
    // TODO: Υπολόγισε τα υπόλοιπα δευτερόλεπτα μετά τις ώρες
    int remaining = totalSeconds __________ 3600;
    
    // TODO: Υπολόγισε τα λεπτά από τα υπόλοιπα
    int minutes = remaining / __________;
    
    // TODO: Υπολόγισε τα τελικά δευτερόλεπτα
    int seconds = remaining __________ 60;
    
    cout << totalSeconds << " δευτερόλεπτα = ";
    cout << hours << " ώρες, ";
    cout << minutes << " λεπτά, ";
    cout << seconds << " δευτερόλεπτα" << endl;
    
    return 0;
}
