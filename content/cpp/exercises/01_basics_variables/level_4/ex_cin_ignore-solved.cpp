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
    
    // ΣΗΜΑΝΤΙΚΟ: Το Enter μετά τον αριθμό μένει στο buffer!
    // cin.ignore() αφαιρεί τον χαρακτήρα newline από το buffer
    cin.ignore();
    
    cout << "Δώσε το πλήρες όνομά σου: ";
    // getline διαβάζει ολόκληρη τη γραμμή (με κενά)
    getline(cin, fullName);
    
    cout << "\n=== Στοιχεία ===" << endl;
    cout << "Όνομα: " << fullName << endl;
    cout << "Ηλικία: " << age << " ετών" << endl;
    
    return 0;
}
