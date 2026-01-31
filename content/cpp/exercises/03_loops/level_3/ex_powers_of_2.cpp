// Άσκηση: Δυνάμεις του 2 (από το PDF)
// Εμφάνισε 2^0, 2^1, 2^2, ... 2^N

#include <iostream>
using namespace std;

int main() {
    int n;
    
    cout << "Μέχρι ποια δύναμη του 2; ";
    cin >> n;
    
    cout << "Δυνάμεις του 2:" << endl;
    
    // TODO: Ξεκίνα με power = 1 (που είναι 2^0)
    int power = 1;
    
    for (int i = 0; i <= n; __________) {
        cout << "2^" << i << " = " << power << endl;
        
        // TODO: Διπλασίασε το power για την επόμενη δύναμη
        power = power __________ 2;
    }
    
    return 0;
}
