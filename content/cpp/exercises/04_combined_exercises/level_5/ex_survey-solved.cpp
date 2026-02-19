/*
 * ΑΣΚΗΣΗ: Η Δημοσκόπηση της Μαρίας
 * 
 * Ουσία: 20 απαντήσεις, έγκυρες 0-200, μέσος όρος/max/count
 */

#include <iostream>
using namespace std;

int main() {
    double amount;
    double sum = 0;
    int valid = 0;
    int invalid = 0;
    int bigConsumers = 0;
    double maxAmount = 0;
    
    cout << "Δημοσκόπηση: Μηνιαία έξοδα για καφέ" << endl;
    
    for (int i = 1; i <= 20; i++) {
        cout << "Ερωτώμενος " << i << ": ";
        cin >> amount;
        
        if (amount < 0 || amount > 200) {
            invalid++;
            cout << "(Άκυρη απάντηση)" << endl;
        } else {
            valid++;
            sum += amount;
            
            if (amount > maxAmount) {
                maxAmount = amount;
            }
            
            if (amount > 50) {
                bigConsumers++;
            }
        }
    }
    
    cout << "\n=== ΑΠΟΤΕΛΕΣΜΑΤΑ ===" << endl;
    cout << "Έγκυρες απαντήσεις: " << valid << endl;
    cout << "Άκυρες απαντήσεις: " << invalid << endl;
    
    if (valid > 0) {
        cout << "Μέσος όρος: " << (sum / valid) << "€" << endl;
        cout << "Μέγιστο: " << maxAmount << "€" << endl;
        cout << "Μεγάλοι καταναλωτές (>50€): " << bigConsumers << endl;
    } else {
        cout << "Καμία έγκυρη απάντηση!" << endl;
    }
    
    return 0;
}
