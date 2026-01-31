// Άσκηση: Τύπος char - Χαρακτήρες
// Διάβασε έναν χαρακτήρα και εμφάνισε τον κωδικό ASCII του

#include <iostream>
using namespace std;

int main() {
    // TODO: Δήλωσε μια μεταβλητή τύπου char
    __________ letter;
    
    cout << "Δώσε έναν χαρακτήρα: ";
    cin >> letter;
    
    cout << "Ο χαρακτήρας '" << letter << "' έχει κωδικό ASCII: ";
    
    // TODO: Μετέτρεψε τον χαρακτήρα σε int για να δεις τον ASCII κωδικό
    cout << __________(letter) << endl;
    
    // Bonus: Εμφάνισε τον επόμενο χαρακτήρα
    cout << "Ο επόμενος χαρακτήρας είναι: '" << (char)(letter + 1) << "'" << endl;
    
    return 0;
}
