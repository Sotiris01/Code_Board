// Άσκηση: Σύγκριση Αριθμών
// Βρες τον μεγαλύτερο από δύο αριθμούς

#include <iostream>
using namespace std;

int main() {
    int a, b;
    
    cout << "Δώσε τον πρώτο αριθμό: ";
    cin >> a;
    cout << "Δώσε τον δεύτερο αριθμό: ";
    cin >> b;
    
    // Χρησιμοποιούμε if-else if-else για σύγκριση
    if (a > b) {
        cout << "Ο μεγαλύτερος είναι: " << a << endl;
    }
    else if (b > a) {
        cout << "Ο μεγαλύτερος είναι: " << b << endl;
    }
    else {
        cout << "Οι αριθμοί είναι ίσοι" << endl;
    }
    
    return 0;
}
