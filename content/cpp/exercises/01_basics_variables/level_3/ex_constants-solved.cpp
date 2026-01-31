// Άσκηση: Χρήση Σταθερών (const)
// Υπολόγισε τον ΦΠΑ ενός προϊόντος χρησιμοποιώντας σταθερά

#include <iostream>
using namespace std;

int main() {
    // Δηλώνουμε σταθερά με const - δεν μπορεί να αλλάξει
    const double VAT = 0.24;
    
    double price;
    
    cout << "Δώσε την τιμή του προϊόντος: ";
    cin >> price;
    
    // Υπολογίζουμε το ποσό ΦΠΑ
    double vatAmount = price * VAT;
    
    // Υπολογίζουμε την τελική τιμή
    double finalPrice = price + vatAmount;
    
    cout << "Τιμή χωρίς ΦΠΑ: " << price << endl;
    cout << "ΦΠΑ (24%): " << vatAmount << endl;
    cout << "Τελική τιμή: " << finalPrice << endl;
    
    return 0;
}
