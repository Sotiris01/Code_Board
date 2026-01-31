// Άσκηση: Χρέωση Πάρκινγκ (Άσκηση 9 από PDF)
// 2€ πρώτη ώρα, 1.50€ κάθε επόμενη

#include <iostream>
using namespace std;

int main() {
    int minutes, hours;
    double cost;
    
    cout << "=== Υπολογισμός Χρέωσης Πάρκινγκ ===" << endl;
    cout << "Λεπτά παραμονής: ";
    cin >> minutes;
    
    // TODO: Υπολόγισε τις ώρες (στρογγυλοποίηση προς τα πάνω)
    // Αν minutes % 60 > 0, πρόσθεσε 1 ώρα
    hours = minutes / 60;
    if (minutes % 60 __________ 0) {
        hours = hours + 1;
    }
    
    // TODO: Υπολόγισε το κόστος
    if (hours __________ 1) {
        // Μέχρι 1 ώρα: 2€
        cost = 2.0;
    }
    else {
        // Πρώτη ώρα 2€ + (hours-1) * 1.50€
        cost = 2.0 + (hours - 1) * __________;
    }
    
    cout << "\nΏρες χρέωσης: " << hours << endl;
    cout << "Κόστος: " << cost << " €" << endl;
    
    return 0;
}
