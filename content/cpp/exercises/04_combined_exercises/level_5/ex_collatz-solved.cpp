/*
 * ΑΣΚΗΣΗ: Το Παράξενο Παιχνίδι του Νίκου
 * 
 * Ουσία: Collatz conjecture - ζυγός/2, μονός*3+1, μέχρι 1
 */

#include <iostream>
using namespace std;

int main() {
    int n;
    int steps = 0;
    
    // Είσοδος με επικύρωση
    do {
        cout << "Δώσε θετικό ακέραιο: ";
        cin >> n;
    } while (n <= 0);
    
    cout << "Ακολουθία: " << n;
    
    while (n != 1) {
        if (n % 2 == 0) {
            n = n / 2;
        } else {
            n = n * 3 + 1;
        }
        cout << " -> " << n;
        steps++;
    }
    
    cout << endl;
    cout << "Βήματα: " << steps << endl;
    
    return 0;
}
