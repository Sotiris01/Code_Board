// Άσκηση: Στρατιωτική Θητεία (Παράδειγμα από PDF σελ. 6)
// Εμφωλευμένη if: Έλεγξε φύλο και ηλικία

#include <iostream>
#include <string>
using namespace std;

int main() {
    string gender;
    int age;
    
    cout << "Δώσε την ηλικία: ";
    cin >> age;
    cout << "Δώσε το φύλο (boy/girl): ";
    cin >> gender;
    
    // Έλεγξε αν είναι αγόρι
    if (gender == "boy") {
        // Εμφωλευμένη if: Έλεγξε αν είναι >= 18
        if (age >= 18) {
            cout << "Must serve in the Military" << endl;
        }
        else {
            // Υπολόγισε πόσα χρόνια απομένουν
            cout << "Must serve in the Military in " << 18 - age << " years" << endl;
        }
    }
    else {
        cout << "Girls do not serve in the military!" << endl;
    }
    
    return 0;
}
