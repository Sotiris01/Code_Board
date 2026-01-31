// Άσκηση: Δευτεροβάθμια Εξίσωση
// Λύσε την εξίσωση ax² + bx + c = 0

#include <iostream>
#include <cmath>
using namespace std;

int main() {
    double a, b, c;
    
    cout << "Δευτεροβάθμια εξίσωση: ax² + bx + c = 0" << endl;
    cout << "Δώσε a, b, c: ";
    cin >> a >> b >> c;
    
    // TODO: Έλεγξε αν είναι πραγματικά δευτεροβάθμια (a != 0)
    if (a __________ 0) {
        cout << "Δεν είναι δευτεροβάθμια εξίσωση!" << endl;
        return 1;
    }
    
    // TODO: Υπολόγισε τη διακρίνουσα Δ = b² - 4ac
    double discriminant = b*b - 4*__________*c;
    
    cout << "Διακρίνουσα Δ = " << discriminant << endl;
    
    // TODO: Έλεγξε τις περιπτώσεις
    if (discriminant __________ 0) {
        // Δύο πραγματικές ρίζες
        double x1 = (-b + sqrt(discriminant)) / (2*a);
        double x2 = (-b - sqrt(discriminant)) / (2*a);
        cout << "Δύο ρίζες: x1 = " << x1 << ", x2 = " << x2 << endl;
    }
    else if (discriminant __________ 0) {
        // Μία διπλή ρίζα
        double x = -b / (2*a);
        cout << "Μία διπλή ρίζα: x = " << x << endl;
    }
    else {
        // Μιγαδικές ρίζες
        cout << "Δεν υπάρχουν πραγματικές ρίζες (μιγαδικές)" << endl;
    }
    
    return 0;
}
