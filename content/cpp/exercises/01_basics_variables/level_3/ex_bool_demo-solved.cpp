// Άσκηση: Τύπος bool - Λογικές Τιμές
// Κατανόησε τις τιμές true/false και πώς αποθηκεύονται

#include <iostream>
using namespace std;

int main() {
    // Λογικές μεταβλητές (boolean)
    bool isRaining = true;
    bool hasUmbrella = false;
    
    cout << "Βρέχει; " << isRaining << endl;         // Εμφανίζει 1
    cout << "Έχω ομπρέλα; " << hasUmbrella << endl;  // Εμφανίζει 0
    
    // Χρειάζεσαι ομπρέλα αν βρέχει ΚΑΙ δεν έχεις ήδη
    bool needUmbrella = isRaining && !hasUmbrella;
    
    cout << "\nΧρειάζομαι ομπρέλα; " << needUmbrella << endl;
    
    // Bonus: Τα μη μηδενικά είναι true
    int number = 42;
    bool isNonZero = number; // Αυτόματη μετατροπή: 0=false, άλλο=true
    cout << "\nΤο 42 ως bool είναι: " << isNonZero << endl;
    
    return 0;
}
