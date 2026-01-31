// Άσκηση: Εύρεση ΜΚΔ (GCD) με τον αλγόριθμο του Ευκλείδη
// Βρες τον Μέγιστο Κοινό Διαιρέτη δύο αριθμών

#include <iostream>
using namespace std;

int main() {
    int a, b;
    
    cout << "Δώσε δύο θετικούς αριθμούς: ";
    cin >> a >> b;
    
    // Αποθήκευση αρχικών τιμών
    int originalA = a;
    int originalB = b;
    
    // TODO: Αλγόριθμος Ευκλείδη
    // Όσο το b δεν είναι 0:
    //   temp = b
    //   b = a % b
    //   a = temp
    
    while (b __________ 0) {
        int temp = b;
        b = a __________ b;
        a = __________;
    }
    
    // Το a περιέχει τώρα το ΜΚΔ
    cout << "ΜΚΔ(" << originalA << ", " << originalB << ") = " << a << endl;
    
    return 0;
}
