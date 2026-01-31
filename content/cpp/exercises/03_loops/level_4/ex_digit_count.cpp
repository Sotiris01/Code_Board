// Άσκηση: Μέτρηση Ψηφίων
// Μέτρησε πόσα ψηφία έχει ένας αριθμός

#include <iostream>
using namespace std;

int main() {
    int num;
    int digitCount = 0;
    
    cout << "Δώσε έναν θετικό αριθμό: ";
    cin >> num;
    
    // Αποθήκευση αρχικής τιμής για εμφάνιση
    int original = num;
    
    // Ειδική περίπτωση: το 0 έχει 1 ψηφίο
    if (num == 0) {
        digitCount = 1;
    }
    else {
        // TODO: Όσο ο αριθμός είναι > 0, διαίρεσε με 10
        while (num __________ 0) {
            digitCount++;
            // TODO: Αφαίρεσε το τελευταίο ψηφίο
            num = num __________ 10;
        }
    }
    
    cout << "Ο αριθμός " << original << " έχει " << digitCount << " ψηφία" << endl;
    
    return 0;
}
