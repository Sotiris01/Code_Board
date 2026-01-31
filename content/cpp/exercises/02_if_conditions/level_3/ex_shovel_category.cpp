// Άσκηση: Κατηγοριοποίηση Φτυαριού (Άσκηση 14-15 από PDF)
// Κατηγοριοποίησε με βάση πλάτος και μήκος

#include <iostream>
using namespace std;

int main() {
    double width, length;
    int quantity;
    double pricePerUnit, totalCost;
    
    /*
        Κατηγορίες:
        - Στενό & μικρό: πλάτος < 10 και μήκος < 25 -> 1.00€
        - Στενό & μεγάλο: πλάτος < 10 και μήκος >= 25 -> 1.40€
        - Φαρδύ & μικρό: πλάτος >= 10 και μήκος < 25 -> 1.20€
        - Φαρδύ & μεγάλο: πλάτος >= 10 και μήκος >= 25 -> 1.60€
    */
    
    cout << "=== Κατηγοριοποίηση Φτυαριού ===" << endl;
    cout << "Πλάτος (εκ.): ";
    cin >> width;
    cout << "Μήκος (εκ.): ";
    cin >> length;
    cout << "Ποσότητα: ";
    cin >> quantity;
    
    // TODO: Έλεγξε αν είναι στενό (πλάτος < 10)
    if (width __________ 10) {
        // Στενό - έλεγξε αν είναι μικρό ή μεγάλο
        if (length __________ 25) {
            cout << "Κατηγορία: Στενό και Μικρό" << endl;
            pricePerUnit = __________;
        }
        else {
            cout << "Κατηγορία: Στενό και Μεγάλο" << endl;
            pricePerUnit = __________;
        }
    }
    else {
        // Φαρδύ - έλεγξε αν είναι μικρό ή μεγάλο
        if (length < 25) {
            cout << "Κατηγορία: Φαρδύ και Μικρό" << endl;
            pricePerUnit = __________;
        }
        else {
            cout << "Κατηγορία: Φαρδύ και Μεγάλο" << endl;
            pricePerUnit = __________;
        }
    }
    
    // TODO: Υπολόγισε το συνολικό κόστος
    totalCost = pricePerUnit __________ quantity;
    
    cout << "Τιμή μονάδας: " << pricePerUnit << " €" << endl;
    cout << "Συνολικό κόστος: " << totalCost << " €" << endl;
    
    return 0;
}
