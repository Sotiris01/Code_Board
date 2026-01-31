// Άσκηση: Είσοδος Ονόματος
// Ζήτα το όνομα του χρήστη και χαιρέτισέ τον

#include <iostream>
#include <string>
using namespace std;

int main() {
    // Δηλώνουμε μεταβλητή τύπου string
    string name;
    
    cout << "Πώς σε λένε; ";
    // Διαβάζουμε το όνομα με cin
    cin >> name;
    
    // Εμφανίζουμε χαιρετισμό
    cout << "Γεια σου " << name << "!" << endl;
    
    return 0;
}
