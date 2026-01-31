// Άσκηση: Βαθμολογία (από το PDF)
// Μετάτρεψε βαθμό σε χαρακτηρισμό

#include <iostream>
using namespace std;

int main() {
    int grade;
    
    cout << "Δώσε τον βαθμό (0-100): ";
    cin >> grade;
    
    // TODO: Συμπλήρωσε τις συνθήκες
    // >= 90: Excellent, >= 70: Pass, < 70: Fail
    if (grade __________ 90) {
        cout << "Excellent!" << endl;
    }
    else __________ (grade >= 70) {
        cout << "Pass" << endl;
    }
    else {
        cout << "Fail" << endl;
    }
    
    return 0;
}
