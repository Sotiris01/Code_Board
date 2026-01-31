// Άσκηση: Μετατροπή Τύπων (Type Casting)
// Υπολόγισε τον μέσο όρο δύο ακεραίων με δεκαδικό αποτέλεσμα

#include <iostream>
using namespace std;

int main() {
    int a, b;
    
    cout << "Δώσε τον πρώτο αριθμό: ";
    cin >> a;
    cout << "Δώσε τον δεύτερο αριθμό: ";
    cin >> b;
    
    // Λάθος τρόπος (ακέραια διαίρεση)
    int wrongAvg = (a + b) / 2;
    cout << "Λάθος μέσος όρος (int): " << wrongAvg << endl;
    
    // TODO: Σωστός τρόπος - μετέτρεψε σε double πριν τη διαίρεση
    // Hint: (double)(a + b) ή static_cast<double>(a + b)
    double correctAvg = __________  / 2.0;
    
    cout << "Σωστός μέσος όρος (double): " << correctAvg << endl;
    
    return 0;
}
