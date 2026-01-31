// Άσκηση: Τύπος bool - Λογικές Τιμές
// Κατανόησε τις τιμές true/false και πώς αποθηκεύονται

#include <iostream>
using namespace std;

int main() {
    // TODO: Δήλωσε μια λογική μεταβλητή
    __________ isRaining = true;
    __________ hasUmbrella = false;
    
    cout << "Βρέχει; " << isRaining << endl;         // Εμφανίζει 1
    cout << "Έχω ομπρέλα; " << hasUmbrella << endl;  // Εμφανίζει 0
    
    // TODO: Υπολόγισε αν πρέπει να πάρεις ομπρέλα
    // Χρειάζεσαι ομπρέλα αν βρέχει ΚΑΙ δεν έχεις ήδη
    bool needUmbrella = isRaining __________ !hasUmbrella;
    
    cout << "\nΧρειάζομαι ομπρέλα; " << needUmbrella << endl;
    
    // Bonus: Τα μη μηδενικά είναι true
    int number = 42;
    bool isNonZero = __________; // Ένας αριθμός μετατρέπεται σε bool
    cout << "\nΤο 42 ως bool είναι: " << isNonZero << endl;
    
    return 0;
}
