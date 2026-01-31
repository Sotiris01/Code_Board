// Άσκηση: Υπολογιστής BMI
// Υπολόγισε τον Δείκτη Μάζας Σώματος

#include <iostream>
using namespace std;

int main() {
    double weight, height, bmi;
    
    cout << "=== Υπολογιστής BMI ===" << endl;
    
    cout << "Δώσε το βάρος σου (kg): ";
    cin >> weight;
    
    cout << "Δώσε το ύψος σου (m): ";
    cin >> height;
    
    // TODO: Υπολόγισε το BMI
    // Τύπος: BMI = βάρος / (ύψος²)
    bmi = weight / (___________ * ___________);
    
    cout << "\nΤο BMI σου είναι: " << bmi << endl;
    
    // TODO: Εμφάνισε την κατηγορία
    // < 18.5: Λιποβαρής, 18.5-24.9: Κανονικό, 25-29.9: Υπέρβαρος, >= 30: Παχύσαρκος
    cout << "Κατηγορία: ";
    if (bmi < 18.5) {
        cout << "Λιποβαρής" << endl;
    }
    else if (bmi < __________) {
        cout << "Κανονικό βάρος" << endl;
    }
    else if (bmi < __________) {
        cout << "Υπέρβαρος" << endl;
    }
    else {
        cout << "Παχύσαρκος" << endl;
    }
    
    return 0;
}
