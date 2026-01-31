// Άσκηση: Τύπος char - Χαρακτήρες
// Διάβασε έναν χαρακτήρα και εμφάνισε τον κωδικό ASCII του

#include <iostream>
using namespace std;

int main() {
    // Δηλώνουμε μεταβλητή τύπου char (1 χαρακτήρας)
    char letter;
    
    cout << "Δώσε έναν χαρακτήρα: ";
    cin >> letter;
    
    cout << "Ο χαρακτήρας '" << letter << "' έχει κωδικό ASCII: ";
    
    // Μετατροπή char σε int για τον ASCII κωδικό
    cout << (int)(letter) << endl;
    
    // Bonus: Εμφάνισε τον επόμενο χαρακτήρα
    cout << "Ο επόμενος χαρακτήρας είναι: '" << (char)(letter + 1) << "'" << endl;
    
    return 0;
}
