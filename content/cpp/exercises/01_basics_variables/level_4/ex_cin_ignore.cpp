// Άσκηση: cin.ignore() με getline (ΣΗΜΑΝΤΙΚΟ!)
// Μάθε να χειρίζεσαι το πρόβλημα όταν cin >> ακολουθείται από getline

#include <iostream>
#include <string>
using namespace std;

int main() {
    int age;
    string fullName;
    
    cout << "Δώσε την ηλικία σου: ";
    cin >> age;
    
    // ΠΡΟΒΛΗΜΑ: Το Enter μετά τον αριθμό μένει στο buffer!
    // TODO: Καθάρισε το buffer με cin.ignore()
    // Χωρίς αυτό, η getline θα διαβάσει μια κενή γραμμή!
    __________;
    
    cout << "Δώσε το πλήρες όνομά σου: ";
    // TODO: Χρησιμοποίησε getline για να διαβάσεις ολόκληρη τη γραμμή
    __________(cin, fullName);
    
    cout << "\n=== Στοιχεία ===" << endl;
    cout << "Όνομα: " << fullName << endl;
    cout << "Ηλικία: " << age << " ετών" << endl;
    
    return 0;
}
