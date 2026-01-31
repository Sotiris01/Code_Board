// Άσκηση: Λογικοί Τελεστές
// Έλεγξε αν ένας αριθμός είναι μεταξύ 1 και 100

#include <iostream>
using namespace std;

int main() {
    int number;
    
    cout << "Δώσε έναν αριθμό: ";
    cin >> number;
    
    // Χρησιμοποιούμε && (AND) για σύνθετη συνθήκη
    if (number >= 1 && number <= 100) {
        cout << "Ο αριθμός είναι μεταξύ 1 και 100" << endl;
    }
    else {
        cout << "Ο αριθμός είναι εκτός ορίων" << endl;
    }
    
    return 0;
}
