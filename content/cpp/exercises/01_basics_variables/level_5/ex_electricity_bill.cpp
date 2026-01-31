// Άσκηση: Λογαριασμός Ηλεκτρικού (Άσκηση 8 από PDF)
// Υπολόγισε το ποσό πληρωμής με χρέωση ημέρας/νύχτας

#include <iostream>
#include <string>
using namespace std;

int main() {
    string surname;
    double kwh_day, kwh_night;
    
    // Τιμές χρέωσης
    const double RATE_DAY = 0.076;       // €/KWh ημέρα
    const double NIGHT_DISCOUNT = 0.30;  // 30% έκπτωση τη νύχτα
    const double FIXED_CHARGE = 8.0;     // Μηνιαίο πάγιο
    
    cout << "=== Λογαριασμός Ηλεκτρικού ===" << endl;
    
    // Διάβασε το επώνυμο
    cout << "Επώνυμο καταναλωτή: ";
    cin >> surname;
    
    // Διάβασε κατανάλωση ημέρας
    cout << "KWh ημέρας: ";
    cin >> kwh_day;
    
    // Διάβασε κατανάλωση νύχτας
    cout << "KWh νύχτας: ";
    cin >> kwh_night;
    
    // TODO: Υπολόγισε τη χρέωση ημέρας (kwh_day * RATE_DAY)
    double cost_day = __________;
    
    // TODO: Υπολόγισε την τιμή νύχτας με έκπτωση 30%
    // rate_night = RATE_DAY * (1 - NIGHT_DISCOUNT) = RATE_DAY * 0.70
    double rate_night = __________;
    
    // TODO: Υπολόγισε τη χρέωση νύχτας
    double cost_night = __________;
    
    // TODO: Υπολόγισε το συνολικό ποσό (ημέρα + νύχτα + πάγιο)
    double total = __________;
    
    cout << "\n=== Αποτέλεσμα ===" << endl;
    cout << "Καταναλωτής: " << surname << endl;
    cout << "Χρέωση ημέρας: " << cost_day << " ευρώ" << endl;
    cout << "Χρέωση νύχτας: " << cost_night << " ευρώ" << endl;
    cout << "Πάγιο: " << FIXED_CHARGE << " ευρώ" << endl;
    cout << "ΣΥΝΟΛΟ: " << __________ << " ευρώ" << endl;
    
    return 0;
}
