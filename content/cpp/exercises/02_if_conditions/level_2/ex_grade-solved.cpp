// Άσκηση: Βαθμολογία (από το PDF)
// Μετάτρεψε βαθμό σε χαρακτηρισμό

#include <iostream>
using namespace std;

int main() {
    int grade;
    
    cout << "Δώσε τον βαθμό (0-100): ";
    cin >> grade;
    
    // Χρησιμοποιούμε if-else if-else για πολλαπλές περιπτώσεις
    if (grade >= 90) {
        cout << "Excellent!" << endl;
    }
    else if (grade >= 70) {
        cout << "Pass" << endl;
    }
    else {
        cout << "Fail" << endl;
    }
    
    return 0;
}
