// Άσκηση: Εμφωλευμένα If (Nested If)
// Κατηγοριοποίησε αριθμό: θετικός/αρνητικός και άρτιος/περιττός

#include <iostream>
using namespace std;

int main() {
    int number;
    
    cout << "Δώσε έναν αριθμό: ";
    cin >> number;
    
    // Έλεγχος θετικού/αρνητικού/μηδέν
    if (number > 0) {
        cout << "Ο αριθμός είναι θετικός";
        
        // Εμφωλευμένος έλεγχος για άρτιο/περιττό
        if (number % 2 == 0) {
            cout << " και άρτιος" << endl;
        }
        else {
            cout << " και περιττός" << endl;
        }
    }
    else if (number < 0) {
        cout << "Ο αριθμός είναι αρνητικός" << endl;
    }
    else {
        cout << "Ο αριθμός είναι μηδέν" << endl;
    }
    
    return 0;
}
