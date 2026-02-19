/*
 * ΘΕΜΑ Δ - ΛΥΣΗ
 */

#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    double temp, prevTemp;
    double sum = 0;
    int count = 0;
    int frostCount = 0, heatCount = 0;
    double maxTemp = -999, minTemp = 999;
    double maxIncrease = 0;
    bool first = true;
    
    cout << "Εισαγωγή θερμοκρασιών (-50 έως 50, -999 για τέλος)" << endl;
    
    while (true) {
        cout << "Θερμοκρασία: ";
        cin >> temp;
        
        if (temp == -999) break;
        
        // Έλεγχος εγκυρότητας
        if (temp < -50 || temp > 50) {
            cout << "(Σφάλμα μέτρησης - αγνοείται)" << endl;
            continue;
        }
        
        // Επεξεργασία
        count++;
        sum += temp;
        
        // Max/Min
        if (temp > maxTemp) maxTemp = temp;
        if (temp < minTemp) minTemp = temp;
        
        // Παγετός/Καύσωνας
        if (temp < 0) frostCount++;
        if (temp > 30) heatCount++;
        
        // Μέγιστη διαδοχική αύξηση
        if (!first) {
            double increase = temp - prevTemp;
            if (increase > 0 && increase > maxIncrease) {
                maxIncrease = increase;
            }
        }
        first = false;
        prevTemp = temp;
    }
    
    // Αποτελέσματα
    cout << "\n=== ΑΠΟΤΕΛΕΣΜΑΤΑ ΑΝΑΛΥΣΗΣ ===" << endl;
    
    if (count == 0) {
        cout << "Δεν καταχωρήθηκαν έγκυρες μετρήσεις." << endl;
        return 0;
    }
    
    double avg = sum / count;
    
    cout << fixed << setprecision(2);
    cout << "Πλήθος μετρήσεων: " << count << endl;
    cout << "i) Μέση θερμοκρασία: " << avg << "°C" << endl;
    cout << "ii) Μέγιστη: " << maxTemp << "°C, Ελάχιστη: " << minTemp << "°C" << endl;
    cout << "iii) Μετρήσεις παγετού (<0): " << frostCount << endl;
    cout << "iv) Μετρήσεις καύσωνα (>30): " << heatCount << endl;
    cout << "v) Θερμοκρασιακό εύρος: " << (maxTemp - minTemp) << "°C" << endl;
    cout << "vi) Μέγιστη διαδοχική αύξηση: " << maxIncrease << "°C" << endl;
    
    // Χαρακτηρισμός
    cout << "\nΧαρακτηρισμός: ";
    if (avg < 0) {
        cout << "ΠΑΓΩΝΙΑ" << endl;
    } else if (avg <= 15) {
        cout << "ΨΥΧΡΟΣ ΚΑΙΡΟΣ" << endl;
    } else if (avg <= 25) {
        cout << "ΕΥΧΑΡΙΣΤΟΣ ΚΑΙΡΟΣ" << endl;
    } else if (avg <= 35) {
        cout << "ΖΕΣΤΟΣ ΚΑΙΡΟΣ" << endl;
    } else {
        cout << "ΚΑΥΣΩΝΑΣ" << endl;
    }
    
    return 0;
}
