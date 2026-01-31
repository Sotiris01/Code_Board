// Άσκηση: Σύγκριση Τιμής ανά Μονάδα (Άσκηση 7 από PDF)
// Σύγκρινε δύο μέλια με βάση την τιμή ανά κιλό

#include <iostream>
#include <string>
using namespace std;

int main() {
    string name1, name2;
    double weight1, price1, weight2, price2;
    double pricePerKg1, pricePerKg2;
    
    cout << "=== Σύγκριση Μελιού ===" << endl;
    
    // Πρώτο μέλι
    cout << "\nΠρώτο μέλι:" << endl;
    cout << "Ονομασία: ";
    cin >> name1;
    cout << "Βάρος (kg): ";
    cin >> weight1;
    cout << "Τιμή (€): ";
    cin >> price1;
    
    // Δεύτερο μέλι
    cout << "\nΔεύτερο μέλι:" << endl;
    cout << "Ονομασία: ";
    cin >> name2;
    cout << "Βάρος (kg): ";
    cin >> weight2;
    cout << "Τιμή (€): ";
    cin >> price2;
    
    // TODO: Υπολόγισε την τιμή ανά κιλό για κάθε μέλι
    pricePerKg1 = price1 __________ weight1;
    pricePerKg2 = price2 __________ weight2;
    
    cout << "\n=== Αποτελέσματα ===" << endl;
    cout << name1 << ": " << pricePerKg1 << " €/kg" << endl;
    cout << name2 << ": " << pricePerKg2 << " €/kg" << endl;
    
    // TODO: Βρες το φθηνότερο
    if (pricePerKg1 __________ pricePerKg2) {
        cout << "\nΤο φθηνότερο είναι το " << __________ << endl;
    }
    else if (pricePerKg2 < pricePerKg1) {
        cout << "\nΤο φθηνότερο είναι το " << __________ << endl;
    }
    else {
        cout << "\nΈχουν την ίδια τιμή ανά κιλό!" << endl;
    }
    
    return 0;
}
