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
        // Όσο ο αριθμός είναι > 0
        while (num > 0) {
            digitCount++;
            // Αφαιρούμε το τελευταίο ψηφίο με διαίρεση
            num = num / 10;
        }
    }
    
    cout << "Ο αριθμός " << original << " έχει " << digitCount << " ψηφία" << endl;
    
    return 0;
}
