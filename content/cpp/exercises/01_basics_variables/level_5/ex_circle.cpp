// Άσκηση: Υπολογισμοί Κύκλου
// Υπολόγισε εμβαδόν και περίμετρο κύκλου

#include <iostream>
using namespace std;

int main() {
    // TODO: Δήλωσε το π ως σταθερά
    __________ double PI = 3.14159;
    
    double radius;
    
    cout << "Δώσε την ακτίνα του κύκλου: ";
    cin >> radius;
    
    // TODO: Υπολόγισε το εμβαδόν (E = π * r²)
    // Hint: r² γράφεται radius * radius
    double area = PI * __________;
    
    // TODO: Υπολόγισε την περίμετρο (Π = 2 * π * r)
    double circumference = 2 * __________ * radius;
    
    cout << "Ακτίνα: " << radius << endl;
    cout << "Εμβαδόν: " << area << endl;
    cout << "Περίμετρος: " << circumference << endl;
    
    return 0;
}
