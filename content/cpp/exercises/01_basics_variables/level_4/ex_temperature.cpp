// Άσκηση: Μετατροπή Θερμοκρασίας
// Μετάτρεψε Celsius σε Fahrenheit και αντίστροφα

#include <iostream>
using namespace std;

int main() {
    double celsius, fahrenheit;
    
    cout << "=== Μετατροπέας Θερμοκρασίας ===" << endl;
    
    // Celsius σε Fahrenheit
    cout << "Δώσε βαθμούς Celsius: ";
    cin >> celsius;
    
    // TODO: Τύπος: F = C * 9/5 + 32
    fahrenheit = celsius * __________ + 32;
    
    cout << celsius << "°C = " << fahrenheit << "°F" << endl;
    
    // Fahrenheit σε Celsius
    cout << "\nΔώσε βαθμούς Fahrenheit: ";
    cin >> fahrenheit;
    
    // TODO: Τύπος: C = (F - 32) * 5/9
    celsius = (fahrenheit - __________) * 5.0/9.0;
    
    cout << fahrenheit << "°F = " << celsius << "°C" << endl;
    
    return 0;
}
