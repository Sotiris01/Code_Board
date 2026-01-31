// Άσκηση: Αριθμομηχανή με Switch
// Εκτέλεσε αριθμητική πράξη βάσει επιλογής χρήστη

#include <iostream>
using namespace std;

int main() {
    double a, b, result;
    char op;
    
    cout << "Δώσε τον πρώτο αριθμό: ";
    cin >> a;
    cout << "Δώσε τον τελεστή (+, -, *, /): ";
    cin >> op;
    cout << "Δώσε τον δεύτερο αριθμό: ";
    cin >> b;
    
    // Switch για τον τελεστή
    switch (op) {
        case '+':
            result = a + b;
            break;
        case '-':
            result = a - b;
            break;
        case '*':
            result = a * b;
            break;
        case '/':
            if (b != 0) {
                result = a / b;
            }
            else {
                cout << "Σφάλμα: Διαίρεση με μηδέν!" << endl;
                return 1;
            }
            break;
        default:
            cout << "Άγνωστος τελεστής!" << endl;
            return 1;
    }
    
    cout << a << " " << op << " " << b << " = " << result << endl;
    
    return 0;
}
