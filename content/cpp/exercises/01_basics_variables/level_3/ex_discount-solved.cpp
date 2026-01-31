// Άσκηση: Υπολογισμός Έκπτωσης (Άσκηση 7 από PDF)
// Υπολόγισε την έκπτωση 7% και το τελικό ποσό

#include <iostream>
using namespace std;

int main() {
    double price, discount_percent, discount_amount, final_price;
    
    // Αρχικό ποσό και ποσοστό έκπτωσης
    price = 86.35;
    discount_percent = 7.0;  // 7%
    
    cout << "=== Υπολογισμός Έκπτωσης ===" << endl;
    cout << "Αρχικό ποσό: " << price << " ευρώ" << endl;
    cout << "Ποσοστό έκπτωσης: " << discount_percent << "%" << endl;
    
    // Υπολόγισε το ποσό της έκπτωσης (price * discount_percent / 100)
    discount_amount = price * discount_percent / 100;
    
    // Υπολόγισε το τελικό ποσό (price - discount_amount)
    final_price = price - discount_amount;
    
    cout << "\nΠοσό έκπτωσης: " << discount_amount << " ευρώ" << endl;
    cout << "Τελικό ποσό: " << final_price << " ευρώ" << endl;
    
    return 0;
}
