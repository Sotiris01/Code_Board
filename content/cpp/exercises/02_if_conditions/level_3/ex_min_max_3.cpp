// Άσκηση: Εύρεση Μέγιστου/Ελάχιστου από 3 αριθμούς
// Βρες το μεγαλύτερο και μικρότερο από 3 αριθμούς

#include <iostream>
using namespace std;

int main() {
    int a, b, c;
    int maxVal, minVal;
    
    cout << "Δώσε τρεις αριθμούς: ";
    cin >> a >> b >> c;
    
    // TODO: Βρες το μέγιστο
    if (a >= b __________ a >= c) {
        maxVal = a;
    }
    else if (b >= a __________ b >= c) {
        maxVal = b;
    }
    else {
        maxVal = __________;
    }
    
    // TODO: Βρες το ελάχιστο
    if (a <= b && a <= c) {
        minVal = __________;
    }
    else if (__________ <= a && b <= c) {
        minVal = b;
    }
    else {
        minVal = c;
    }
    
    cout << "Μέγιστο: " << maxVal << endl;
    cout << "Ελάχιστο: " << minVal << endl;
    
    return 0;
}
