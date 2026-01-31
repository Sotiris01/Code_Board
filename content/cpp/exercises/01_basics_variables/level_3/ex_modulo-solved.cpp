// Άσκηση: Τελεστής Modulo (%)
// Διαχώρισε έναν αριθμό σε ψηφία (μονάδες και δεκάδες)

#include <iostream>
using namespace std;

int main() {
    int number;
    
    cout << "Δώσε έναν διψήφιο αριθμό (10-99): ";
    cin >> number;
    
    // Μονάδες: υπόλοιπο διαίρεσης με 10
    int units = number % 10;
    
    // Δεκάδες: ακέραια διαίρεση με 10
    int tens = number / 10;
    
    cout << "Ο αριθμός " << number << " έχει:" << endl;
    cout << "  Δεκάδες: " << tens << endl;
    cout << "  Μονάδες: " << units << endl;
    cout << "  Άθροισμα ψηφίων: " << (tens + units) << endl;
    
    return 0;
}
