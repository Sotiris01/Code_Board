// Άσκηση: Υπολογισμός Παραγοντικού
// Υπολόγισε το n! = 1 * 2 * 3 * ... * n

#include <iostream>
using namespace std;

int main() {
    int n;
    long long factorial = 1;  // long long για μεγάλους αριθμούς
    
    cout << "Δώσε έναν θετικό αριθμό: ";
    cin >> n;
    
    // TODO: Υπολόγισε το παραγοντικό με for loop
    for (int i = 1; i <= n; __________) {
        // TODO: Πολλαπλασίασε το factorial με το i
        factorial = factorial __________ i;
    }
    
    cout << n << "! = " << factorial << endl;
    
    return 0;
}
