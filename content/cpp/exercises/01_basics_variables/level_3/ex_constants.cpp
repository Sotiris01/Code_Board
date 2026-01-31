// Άσκηση: Χρήση Σταθερών (const)
// Υπολόγισε τον ΦΠΑ ενός προϊόντος χρησιμοποιώντας σταθερά

#include <iostream>
using namespace std;

int main() {
    // TODO: Δήλωσε μια σταθερά για το ποσοστό ΦΠΑ (24%)
    // Hint: const double VAT = 0.24;
    __________ double VAT = 0.24;
    
    double price;
    
    cout << "Δώσε την τιμή του προϊόντος: ";
    cin >> price;
    
    // TODO: Υπολόγισε το ποσό ΦΠΑ
    double vatAmount = price * __________;
    
    // TODO: Υπολόγισε την τελική τιμή
    double finalPrice = price + __________;
    
    cout << "Τιμή χωρίς ΦΠΑ: " << price << endl;
    cout << "ΦΠΑ (24%): " << vatAmount << endl;
    cout << "Τελική τιμή: " << finalPrice << endl;
    
    return 0;
}
