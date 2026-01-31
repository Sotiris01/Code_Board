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
    
    // Σωστός τρόπος - μετατρέπουμε σε double
    double correctAvg = (double)(a + b) / 2.0;
    
    cout << "Σωστός μέσος όρος (double): " << correctAvg << endl;
    
    return 0;
}
