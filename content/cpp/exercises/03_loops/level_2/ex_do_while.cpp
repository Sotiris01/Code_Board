// Άσκηση: Do-While Loop
// Ζήτα αριθμούς μέχρι ο χρήστης να δώσει 0

#include <iostream>
using namespace std;

int main() {
    int number;
    int sum = 0;
    
    // TODO: Συμπλήρωσε το do-while loop
    // Hint: Εκτελείται τουλάχιστον μία φορά
    __________ {
        cout << "Δώσε αριθμό (0 για τέλος): ";
        cin >> number;
        sum = sum + number;
    } __________ (number != 0);
    
    cout << "Το άθροισμα είναι: " << sum << endl;
    
    return 0;
}
