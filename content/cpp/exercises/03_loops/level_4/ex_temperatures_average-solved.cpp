/*
 * Άσκηση: Μέσος όρος θερμοκρασιών
 * Επίπεδο: 4
 * 
 * Περιγραφή:
 * Γράψτε πρόγραμμα που διαβάζει θερμοκρασίες (άγνωστο πλήθος)
 * που καταγράφηκαν τον μήνα Δεκέμβριο και εμφανίζει τον μέσο όρο τους.
 * Η τιμή 100 χρησιμοποιείται ως σημαία τερματισμού (sentinel).
 * 
 * Παράδειγμα:
 * Θερμοκρασίες: 5 8 3 12 7 100
 * Μέσος όρος θερμοκρασιών: 7
 */

#include <iostream>
using namespace std;

int main() {
    double temperature;
    double sum = 0;
    int count = 0;
    double average;
    
    cout << "Εισάγετε θερμοκρασίες (100 για τερματισμό):" << endl;
    
    cout << "Θερμοκρασία: ";
    cin >> temperature;
    
    // Βρόχος while όσο η θερμοκρασία δεν είναι 100
    while (temperature != 100) {
        sum = sum + temperature;
        count = count + 1;
        
        cout << "Θερμοκρασία: ";
        cin >> temperature;
    }
    
    // Υπολογισμός μέσου όρου
    if (count > 0) {
        average = sum / count;
        cout << "Μέσος όρος θερμοκρασιών: " << average << endl;
    } else {
        cout << "Δεν εισήχθησαν θερμοκρασίες!" << endl;
    }
    
    return 0;
}
