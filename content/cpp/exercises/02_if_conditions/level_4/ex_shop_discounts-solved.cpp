// Άσκηση: Εκπτώσεις Καταστήματος (Άσκηση 12 από PDF)
// Κλιμακωτές εκπτώσεις και δόσεις

#include <iostream>
using namespace std;

int main() {
    double amount, discount, finalAmount, installment;
    int numInstallments;
    
    /*
        Τιμολόγηση:
        < 50€: Χωρίς έκπτωση, χωρίς δόσεις
        50-200€: 5% έκπτωση, 4 δόσεις
        200-500€: 10% έκπτωση, 6 δόσεις
        > 500€: 12% έκπτωση, 12 δόσεις
    */
    
    cout << "=== Κατάστημα Ηλεκτρικών ===" << endl;
    cout << "Ποσό αγορών: ";
    cin >> amount;
    
    // Έλεγξε το ποσό και υπολόγισε έκπτωση/δόσεις
    if (amount < 50) {
        discount = 0;
        numInstallments = 0;
        cout << "\nΧωρίς έκπτωση, πληρωμή εφάπαξ" << endl;
    }
    else if (amount <= 200) {
        discount = amount * 5 / 100;  // 5%
        numInstallments = 4;
        cout << "\nΈκπτωση 5%, 4 δόσεις" << endl;
    }
    else if (amount <= 500) {
        discount = amount * 10 / 100;  // 10%
        numInstallments = 6;
        cout << "\nΈκπτωση 10%, 6 δόσεις" << endl;
    }
    else {
        discount = amount * 12 / 100;  // 12%
        numInstallments = 12;
        cout << "\nΈκπτωση 12%, 12 δόσεις" << endl;
    }
    
    // Υπολόγισε τελικό ποσό
    finalAmount = amount - discount;
    
    cout << "Ποσό έκπτωσης: " << discount << " €" << endl;
    cout << "Τελικό ποσό: " << finalAmount << " €" << endl;
    
    // Αν υπάρχουν δόσεις, υπολόγισε το ποσό δόσης
    if (numInstallments > 0) {
        installment = finalAmount / numInstallments;
        cout << "Ποσό δόσης: " << installment << " €" << endl;
    }
    
    return 0;
}
