// Άσκηση: Αποτίμηση Λογικών Εκφράσεων (Άσκηση Α4 από PDF)
// Αποτίμησε σύνθετες λογικές εκφράσεις

#include <iostream>
using namespace std;

int main() {
    // Αποτίμηση λογικών εκφράσεων
    // Ιεραρχία: ! (NOT) -> && (AND) -> || (OR)
    
    bool result;
    
    // Έκφραση 1: !( true && false )
    // Βήμα 1: true && false = false
    // Βήμα 2: !false = true
    result = !(true && false);
    cout << "!( true && false ) = " << (result ? "true" : "false") << endl;
    
    // Έκφραση 2: !( true || false )
    // Βήμα 1: true || false = true
    // Βήμα 2: !true = false
    result = !(true || false);
    cout << "!( true || false ) = " << (result ? "true" : "false") << endl;
    
    // Έκφραση 3: !( false || true && false )
    // Προσοχή: Πρώτα το && μετά το ||
    // Βήμα 1: true && false = false
    // Βήμα 2: false || false = false
    // Βήμα 3: !false = true
    result = !(false || true && false);
    cout << "!( false || true && false ) = " << (result ? "true" : "false") << endl;
    
    // Έκφραση 4: !( false || false ) && false
    // Βήμα 1: false || false = false
    // Βήμα 2: !false = true
    // Βήμα 3: true && false = false
    result = !(false || false) && false;
    cout << "!( false || false ) && false = " << (result ? "true" : "false") << endl;
    
    return 0;
}
