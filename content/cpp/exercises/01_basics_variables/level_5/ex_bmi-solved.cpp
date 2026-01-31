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
    
    // Τύπος: BMI = βάρος / (ύψος²)
    bmi = weight / (height * height);
    
    cout << "\nΤο BMI σου είναι: " << bmi << endl;
    
    // Κατηγοριοποίηση BMI
    cout << "Κατηγορία: ";
    if (bmi < 18.5) {
        cout << "Λιποβαρής" << endl;
    }
    else if (bmi < 25) {
        cout << "Κανονικό βάρος" << endl;
    }
    else if (bmi < 30) {
        cout << "Υπέρβαρος" << endl;
    }
    else {
        cout << "Παχύσαρκος" << endl;
    }
    
    return 0;
}
