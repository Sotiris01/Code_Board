// Άσκηση: Do-While Loop
// Ζήτα αριθμούς μέχρι ο χρήστης να δώσει 0

#include <iostream>
using namespace std;

int main() {
    int number;
    int sum = 0;
    
    // Do-while: εκτελείται τουλάχιστον μία φορά
    do {
        cout << "Δώσε αριθμό (0 για τέλος): ";
        cin >> number;
        sum = sum + number;
    } while (number != 0);
    
    cout << "Το άθροισμα είναι: " << sum << endl;
    
    return 0;
}
