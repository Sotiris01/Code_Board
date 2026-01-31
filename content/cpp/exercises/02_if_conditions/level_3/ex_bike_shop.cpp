// Άσκηση: Κατάστημα Ποδηλάτων (Παράδειγμα Same Variable - PDF σελ. 7-8)
// Χρήση της ίδιας μεταβλητής για απλοποίηση

#include <iostream>
#include <string>
using namespace std;

int main() {
    double price;
    string wantExtra;
    
    cout << "=== Κατάστημα Ποδηλάτων ===" << endl;
    
    // Διάβασε την τιμή του ποδηλάτου
    cout << "Τιμή ποδηλάτου: ";
    cin >> price;
    
    // Ερώτηση για κράνος (24€)
    cout << "Θέλετε κράνος; (yes/no): ";
    cin >> wantExtra;
    // TODO: Αν θέλει κράνος, πρόσθεσε 24 στην τιμή
    if (wantExtra __________ "yes") {
        price = price __________ 24;
    }
    
    // Ερώτηση για φως (8€)
    cout << "Θέλετε φως; (yes/no): ";
    cin >> wantExtra;
    // TODO: Αν θέλει φως, πρόσθεσε 8 στην τιμή
    if (wantExtra __________ "yes") {
        price = price __________ 8;
    }
    
    // Ερώτηση για κουδουνάκι (5€)
    cout << "Θέλετε κουδουνάκι; (yes/no): ";
    cin >> wantExtra;
    // TODO: Αν θέλει κουδουνάκι, πρόσθεσε 5 στην τιμή
    if (wantExtra == __________) {
        price = __________;
    }
    
    cout << "\nΣυνολικό κόστος: " << price << " €" << endl;
    
    return 0;
}
