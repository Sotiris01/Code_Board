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
    // TODO: Πρόσθεσε τη χρέωση αποστολής
    if (shipping __________ "express") {
        price = price + __________;
    }
    else {
        price = price + __________;
    }
    
    // Συσκευασία δώρου
    cout << "Συσκευασία δώρου; (yes/no): ";
    cin >> giftWrap;
    // TODO: Αν θέλει συσκευασία δώρου
    if (giftWrap __________ "yes") {
        price = price + __________;
    }
    
    // Κάρτα μέλους
    cout << "Έχετε κάρτα μέλους; (yes/no): ";
    cin >> memberCard;
    // TODO: Αν έχει κάρτα, έκπτωση 15%
    if (memberCard __________ "yes") {
        price = price * (1 - __________);  // 0.15 = 15%
    }
    
    cout << "\nThe total cost is " << price << " €" << endl;
    
    return 0;
}
