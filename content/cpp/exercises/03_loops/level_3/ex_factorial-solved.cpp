// Άσκηση: Υπολογισμός Παραγοντικού
// Υπολόγισε το n! = 1 * 2 * 3 * ... * n

#include <iostream>
using namespace std;

int main() {
    int n;
    long long factorial = 1;  // long long για μεγάλους αριθμούς
    
    cout << "Δώσε έναν θετικό αριθμό: ";
    cin >> n;
    
    // Υπολογισμός παραγοντικού με for loop
    for (int i = 1; i <= n; i++) {
        // Πολλαπλασιάζουμε το factorial με κάθε i
        factorial = factorial * i;
    }
    
    cout << n << "! = " << factorial << endl;
    
    return 0;
}
