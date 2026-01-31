// Άσκηση: Προπαίδεια
// Εμφάνισε την προπαίδεια ενός αριθμού (1-10)

#include <iostream>
using namespace std;

int main() {
    int num;
    
    cout << "Δώσε έναν αριθμό για την προπαίδεια: ";
    cin >> num;
    
    cout << "Προπαίδεια του " << num << ":" << endl;
    cout << "==================" << endl;
    
    // Εμφάνιση προπαίδειας από 1 έως 10
    for (int i = 1; i <= 10; i++) {
        // Υπολογισμός γινομένου
        int result = num * i;
        cout << num << " x " << i << " = " << result << endl;
    }
    
    return 0;
}
