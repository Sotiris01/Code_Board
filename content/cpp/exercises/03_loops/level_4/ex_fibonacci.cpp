// Άσκηση: Ακολουθία Fibonacci
// Εμφάνισε τους πρώτους N αριθμούς Fibonacci
// 0, 1, 1, 2, 3, 5, 8, 13, 21, ...

#include <iostream>
using namespace std;

int main() {
    int n;
    
    cout << "Πόσους αριθμούς Fibonacci να εμφανίσω; ";
    cin >> n;
    
    // TODO: Αρχικοποίησε τους δύο πρώτους αριθμούς
    int prev = 0;
    int curr = 1;
    
    cout << "Fibonacci: ";
    
    for (int i = 0; i < n; i++) {
        cout << prev << " ";
        
        // TODO: Υπολόγισε τον επόμενο αριθμό (άθροισμα των δύο προηγούμενων)
        int next = prev __________ curr;
        
        // TODO: Μετακίνησε τις τιμές
        prev = __________;
        curr = __________;
    }
    
    cout << endl;
    
    return 0;
}
