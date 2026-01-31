// Άσκηση: Δυνάμεις του 2 (από το PDF)
// Εμφάνισε 2^0, 2^1, 2^2, ... 2^N

#include <iostream>
using namespace std;

int main() {
    int n;
    
    cout << "Μέχρι ποια δύναμη του 2; ";
    cin >> n;
    
    cout << "Δυνάμεις του 2:" << endl;
    
    // Ξεκινάμε με power = 1 (2^0 = 1)
    int power = 1;
    
    for (int i = 0; i <= n; i++) {
        cout << "2^" << i << " = " << power << endl;
        
        // Διπλασιάζουμε για την επόμενη δύναμη
        power = power * 2;
    }
    
    return 0;
}
