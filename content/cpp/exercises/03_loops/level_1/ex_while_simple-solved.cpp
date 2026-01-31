// Άσκηση: Απλό While Loop
// Εμφάνισε τους αριθμούς 1 έως 5

#include <iostream>
using namespace std;

int main() {
    // Δηλώνουμε μεταβλητή μετρητή
    int i = 1;
    
    // While loop: όσο η συνθήκη είναι true
    while (i <= 5) {
        cout << i << endl;
        // Αυξάνουμε το i κατά 1
        i++;
    }
    
    return 0;
}
