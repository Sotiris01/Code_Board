/*
 * Άσκηση: Μέσος Όρος Επιτυχόντων
 * Επίπεδο: 2
 * 
 * Περιγραφή:
 * Διάβασε 10 βαθμούς μαθητών (0-20).
 * Υπολόγισε τον μέσο όρο ΜΟΝΟ των επιτυχόντων (βαθμός >= 10).
 */

#include <iostream>
using namespace std;

int main() {
    int grade;
    int sum = 0;
    int count = 0;
    
    cout << "Εισάγετε 10 βαθμούς (0-20):" << endl;
    
    // ΛΥΣΗ: For loop με if για επιτυχόντες
    for (int i = 1; i <= 10; i++) {
        cout << "Βαθμός " << i << ": ";
        cin >> grade;
        
        if (grade >= 10) {
            sum = sum + grade;
            count = count + 1;
        }
    }
    
    // ΛΥΣΗ: Υπολογισμός μέσου όρου με έλεγχο
    cout << endl;
    cout << "Πλήθος επιτυχόντων: " << count << endl;
    
    if (count > 0) {
        double average = (double)sum / count;
        cout << "Μέσος όρος επιτυχόντων: " << average << endl;
    } else {
        cout << "Κανένας επιτυχών!" << endl;
    }
    
    return 0;
}
