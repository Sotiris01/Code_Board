// Άσκηση: Υπολογισμός Εμβαδού Ορθογωνίου
// Διάβασε μήκος και πλάτος, υπολόγισε εμβαδόν και περίμετρο

#include <iostream>
using namespace std;

int main() {
    // Δηλώνουμε μεταβλητές τύπου double (δεκαδικοί)
    double length, width, area, perimeter;
    
    cout << "Δώσε το μήκος: ";
    cin >> length;
    cout << "Δώσε το πλάτος: ";
    cin >> width;
    
    // Υπολογίζουμε το εμβαδόν
    area = length * width;
    
    // Υπολογίζουμε την περίμετρο
    perimeter = 2 * length + 2 * width;
    
    cout << "Εμβαδόν: " << area << endl;
    cout << "Περίμετρος: " << perimeter << endl;
    
    return 0;
}
