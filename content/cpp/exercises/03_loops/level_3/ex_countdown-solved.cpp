// Άσκηση: Αντίστροφη Μέτρηση
// Μέτρησε αντίστροφα από N έως 1 και εμφάνισε "Εκτόξευση!"

#include <iostream>
using namespace std;

int main() {
    int n;
    
    cout << "Από πόσο να ξεκινήσει η αντίστροφη μέτρηση; ";
    cin >> n;
    
    cout << "Αντίστροφη μέτρηση:" << endl;
    
    // For loop που μειώνεται
    for (int i = n; i >= 1; i--) {
        cout << i << "..." << endl;
    }
    
    // Μήνυμα εκτόξευσης
    cout << "Εκτόξευση!" << endl;
    
    return 0;
}
