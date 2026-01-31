// Άσκηση: Online Αγορές (Άσκηση 16 από PDF)
// Αποστολή + Συσκευασία δώρου + Κάρτα μέλους

#include <iostream>
#include <string>
using namespace std;

int main() {
    double price;
    string shipping, giftWrap, memberCard;
    
    /*
        Χρεώσεις:
        - Standard αποστολή: 3.90€
        - Express αποστολή: 10€
        - Συσκευασία δώρου: +2.50€
        - Κάρτα μέλους: -15% έκπτωση
    */
    
    cout << "=== Online Κατάστημα ===" << endl;
    
    cout << "Κόστος αγοράς: ";
    cin >> price;
    
    // Αποστολή
    cout << "Τύπος αποστολής (standard/express): ";
    cin >> shipping;
    // Πρόσθεσε τη χρέωση αποστολής
    if (shipping == "express") {
        price = price + 10.0;
    }
    else {
        price = price + 3.90;
    }
    
    // Συσκευασία δώρου
    cout << "Συσκευασία δώρου; (yes/no): ";
    cin >> giftWrap;
    // Αν θέλει συσκευασία δώρου
    if (giftWrap == "yes") {
        price = price + 2.50;
    }
    
    // Κάρτα μέλους
    cout << "Έχετε κάρτα μέλους; (yes/no): ";
    cin >> memberCard;
    // Αν έχει κάρτα, έκπτωση 15%
    if (memberCard == "yes") {
        price = price * (1 - 0.15);  // 0.15 = 15%
    }
    
    cout << "\nThe total cost is " << price << " €" << endl;
    
    return 0;
}
