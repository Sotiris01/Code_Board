// Άσκηση: Υπολογισμοί Κύκλου
// Υπολόγισε εμβαδόν και περίμετρο κύκλου

#include <iostream>
using namespace std;

int main() {
    // Δηλώνουμε το π ως σταθερά
    const double PI = 3.14159;
    
    double radius;
    
    cout << "Δώσε την ακτίνα του κύκλου: ";
    cin >> radius;
    
    // Εμβαδόν: E = π * r²
    double area = PI * radius * radius;
    
    // Περίμετρος: Π = 2 * π * r
    double circumference = 2 * PI * radius;
    
    cout << "Ακτίνα: " << radius << endl;
    cout << "Εμβαδόν: " << area << endl;
    cout << "Περίμετρος: " << circumference << endl;
    
    return 0;
}
