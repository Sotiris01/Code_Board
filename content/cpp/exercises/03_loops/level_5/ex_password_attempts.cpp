// Άσκηση: Κωδικός με 3 Προσπάθειες (από το PDF)
// Επανάληψη εισαγωγής κωδικού - κλείδωμα μετά από 3 αποτυχίες

#include <iostream>
#include <string>
using namespace std;

int main() {
    const string CORRECT_PASSWORD = "secret123";
    const int MAX_ATTEMPTS = 3;
    
    string password;
    int attempts = 0;
    bool success = false;
    
    cout << "=== Σύστημα Εισόδου ===" << endl;
    
    // TODO: Επανάλαβε όσο δεν έχει επιτύχει ΚΑΙ έχει προσπάθειες
    while (!success __________ attempts < MAX_ATTEMPTS) {
        cout << "\nΠροσπάθεια " << (attempts + 1) << "/" << MAX_ATTEMPTS << endl;
        cout << "Δώσε κωδικό: ";
        cin >> password;
        
        // TODO: Αύξησε τις προσπάθειες
        __________;
        
        // TODO: Έλεγξε αν ο κωδικός είναι σωστός
        if (password __________ CORRECT_PASSWORD) {
            success = true;
        }
        else {
            cout << "Λάθος κωδικός!" << endl;
        }
    }
    
    // Αποτέλεσμα
    if (success) {
        cout << "\n*** Καλώς ήρθες! ***" << endl;
    }
    else {
        cout << "\n!!! ΚΛΕΙΔΩΜΑ - Πολλές αποτυχημένες προσπάθειες !!!" << endl;
    }
    
    return 0;
}
