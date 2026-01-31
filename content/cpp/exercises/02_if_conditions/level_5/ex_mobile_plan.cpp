// Άσκηση: Πρόγραμμα Κινητής Τηλεφωνίας (Άσκηση 17 από PDF)
// Υπολόγισε υπερβάσεις κλήσεων, SMS, GB

#include <iostream>
using namespace std;

int main() {
    int minutes, sms, gb;
    double charge;
    
    /*
        Πρόγραμμα SuperCom:
        - Πάγιο: 20€/μήνα
        - Δωρεάν: 1000 λεπτά, 1000 SMS, 2 GB
        
        Υπερβάσεις:
        - Κλήσεις: 0.005€/δευτερόλεπτο = 0.30€/λεπτό
        - SMS: 0.08€/SMS
        - GB: 2.50€/GB
    */
    
    const double FIXED_CHARGE = 20.0;
    const int FREE_MINUTES = 1000;
    const int FREE_SMS = 1000;
    const int FREE_GB = 2;
    
    const double RATE_MINUTE = 0.005 * 60;  // €/λεπτό (0.005€/sec * 60 sec)
    const double RATE_SMS = 0.08;
    const double RATE_GB = 2.50;
    
    cout << "=== Πρόγραμμα SuperCom ===" << endl;
    
    cout << "Λεπτά ομιλίας: ";
    cin >> minutes;
    cout << "Πλήθος SMS: ";
    cin >> sms;
    cout << "GB δεδομένων: ";
    cin >> gb;
    
    // Ξεκίνα με το πάγιο
    charge = FIXED_CHARGE;
    
    // TODO: Αν ξεπέρασε τα δωρεάν λεπτά
    if (minutes __________ FREE_MINUTES) {
        int extraMinutes = minutes - FREE_MINUTES;
        charge = charge + extraMinutes * __________;
        cout << "Υπέρβαση λεπτών: " << extraMinutes << endl;
    }
    
    // TODO: Αν ξεπέρασε τα δωρεάν SMS
    if (sms __________ FREE_SMS) {
        int extraSMS = sms - __________;
        charge = charge + extraSMS * __________;
        cout << "Υπέρβαση SMS: " << extraSMS << endl;
    }
    
    // TODO: Αν ξεπέρασε τα δωρεάν GB
    if (gb __________ FREE_GB) {
        int extraGB = gb - __________;
        charge = charge + extraGB * __________;
        cout << "Υπέρβαση GB: " << extraGB << endl;
    }
    
    cout << "\nΜηνιαία χρέωση: " << charge << " €" << endl;
    
    return 0;
}
