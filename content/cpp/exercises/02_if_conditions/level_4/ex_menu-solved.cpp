// Άσκηση: Μενού Επιλογών
// Δημιούργησε ένα μενού με πολλές επιλογές

#include <iostream>
using namespace std;

int main() {
    int choice;
    
    cout << "===== ΜΕΝΟΥ =====" << endl;
    cout << "1. Νέο παιχνίδι" << endl;
    cout << "2. Φόρτωση παιχνιδιού" << endl;
    cout << "3. Ρυθμίσεις" << endl;
    cout << "4. Έξοδος" << endl;
    cout << "=================" << endl;
    cout << "Επιλογή: ";
    cin >> choice;
    
    // Switch για επιλογή μενού
    switch (choice) {
        case 1:
            cout << "Ξεκινάει νέο παιχνίδι..." << endl;
            break;
        case 2:
            cout << "Φόρτωση αποθηκευμένου παιχνιδιού..." << endl;
            break;
        case 3:
            cout << "Άνοιγμα ρυθμίσεων..." << endl;
            break;
        case 4:
            cout << "Αντίο!" << endl;
            break;
        default:
            cout << "Μη έγκυρη επιλογή. Δοκιμάστε ξανά." << endl;
    }
    
    return 0;
}
