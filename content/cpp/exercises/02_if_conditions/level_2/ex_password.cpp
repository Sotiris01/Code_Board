// Άσκηση: Έλεγχος Κωδικού (από το PDF)
// Ρώτησε κωδικό και έλεγξε αν είναι σωστός

#include <iostream>
#include <string>
using namespace std;

int main() {
    string password;
    string correct = "secret123";
    
    cout << "Δώσε τον κωδικό: ";
    cin >> password;
    
    // TODO: Σύγκρινε τα strings με ==
    if (password __________ correct) {
        cout << "Πρόσβαση επιτρέπεται!" << endl;
    }
    else {
        cout << "Λάθος κωδικός!" << endl;
    }
    
    return 0;
}
