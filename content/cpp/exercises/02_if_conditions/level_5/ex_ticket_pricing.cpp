// Άσκηση: Τιμολόγηση Εισιτηρίων
// Υπολόγισε την τιμή εισιτηρίου με βάση ηλικία και ημέρα

#include <iostream>
#include <string>
using namespace std;

int main() {
    int age;
    string day;
    double basePrice = 10.0;
    double finalPrice;
    
    cout << "=== Αγορά Εισιτηρίου ===" << endl;
    cout << "Δώσε την ηλικία: ";
    cin >> age;
    cout << "Δώσε την ημέρα (weekday/weekend): ";
    cin >> day;
    
    // TODO: Υπολόγισε την τιμή βάσει ηλικίας
    // Παιδιά (<12): 50% έκπτωση
    // Ηλικιωμένοι (>=65): 30% έκπτωση
    // Κανονικοί: πλήρης τιμή
    
    if (age __________ 12) {
        finalPrice = basePrice * 0.5;  // 50% έκπτωση
        cout << "Παιδικό εισιτήριο (50% έκπτωση)" << endl;
    }
    else if (age __________ 65) {
        finalPrice = basePrice * 0.7;  // 30% έκπτωση
        cout << "Εισιτήριο ηλικιωμένου (30% έκπτωση)" << endl;
    }
    else {
        finalPrice = basePrice;
        cout << "Κανονικό εισιτήριο" << endl;
    }
    
    // TODO: Επιπλέον χρέωση Σαββατοκύριακου
    if (day __________ "weekend") {
        finalPrice = finalPrice + 2.0;
        cout << "Επιπλέον χρέωση Σ/Κ: +2€" << endl;
    }
    
    cout << "Τελική τιμή: " << finalPrice << "€" << endl;
    
    return 0;
}
