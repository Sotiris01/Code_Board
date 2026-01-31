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
    
    // TODO: Εμφάνισε num x 1, num x 2, ... num x 10
    for (int i = 1; i <= __________; i++) {
        // TODO: Υπολόγισε το γινόμενο
        int result = num __________ i;
        cout << num << " x " << i << " = " << result << endl;
    }
    
    return 0;
}
