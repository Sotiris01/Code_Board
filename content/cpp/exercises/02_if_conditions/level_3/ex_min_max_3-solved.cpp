// Άσκηση: Εύρεση Μέγιστου/Ελάχιστου από 3 αριθμούς
// Βρες το μεγαλύτερο και μικρότερο από 3 αριθμούς

#include <iostream>
using namespace std;

int main() {
    int a, b, c;
    int maxVal, minVal;
    
    cout << "Δώσε τρεις αριθμούς: ";
    cin >> a >> b >> c;
    
    // Εύρεση μέγιστου με && (AND)
    if (a >= b && a >= c) {
        maxVal = a;
    }
    else if (b >= a && b >= c) {
        maxVal = b;
    }
    else {
        maxVal = c;
    }
    
    // Εύρεση ελάχιστου
    if (a <= b && a <= c) {
        minVal = a;
    }
    else if (b <= a && b <= c) {
        minVal = b;
    }
    else {
        minVal = c;
    }
    
    cout << "Μέγιστο: " << maxVal << endl;
    cout << "Ελάχιστο: " << minVal << endl;
    
    return 0;
}
