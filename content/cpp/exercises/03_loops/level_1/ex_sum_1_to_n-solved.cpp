// Άσκηση: Άθροισμα 1 έως Ν
// Υπολόγισε το άθροισμα 1+2+3+...+N

#include <iostream>
using namespace std;

int main() {
    int n;
    int sum = 0;
    
    cout << "Δώσε το N: ";
    cin >> n;
    
    // Χρησιμοποιούμε for loop
    for (int i = 1; i <= n; i++) {
        // Προσθέτουμε το i στο sum
        sum = sum + i;
    }
    
    cout << "Το άθροισμα 1 έως " << n << " είναι: " << sum << endl;
    
    return 0;
}
