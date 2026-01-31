// Άσκηση: Σύστημα Δύο Χρηστών (Άσκηση 4 από PDF)
// Έλεγξε είσοδο για δύο χρήστες: Chris/abbey ή Annabel/1551

#include <iostream>
#include <string>
using namespace std;

int main() {
    string username, password;
    
    cout << "=== Σύστημα Εισόδου ===" << endl;
    cout << "Username: ";
    cin >> username;
    cout << "Password: ";
    cin >> password;
    
    // Χρήστης 1: Chris με κωδικό abbey
    // Χρήστης 2: Annabel με κωδικό 1551
    
    // Έλεγξε αν είναι ο Chris με σωστό κωδικό
    if (username == "Chris" && password == "abbey") {
        cout << "Access allowed to user Chris" << endl;
    }
    // Έλεγξε αν είναι η Annabel με σωστό κωδικό
    else if (username == "Annabel" && password == "1551") {
        cout << "Access allowed to user Annabel" << endl;
    }
    // Λάθος στοιχεία
    else {
        cout << "Invalid username or password" << endl;
    }
    
    return 0;
}
