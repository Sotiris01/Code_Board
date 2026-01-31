// Άσκηση: Πολλαπλές Είσοδοι
// Διάβασε 3 αριθμούς και υπολόγισε άθροισμα, μέσο όρο, min, max

#include <iostream>
using namespace std;

int main() {
    // TODO: Δήλωσε 3 μεταβλητές τύπου int
    __________ a, b, c;
    
    cout << "Δώσε τρεις αριθμούς χωρισμένους με κενό: ";
    // TODO: Διάβασε και τους 3 με ένα cin
    cin >> a >> __________ >> __________;
    
    // Υπολογισμοί
    int sum = a + b + c;
    double avg = (double)sum / 3;
    
    // TODO: Βρες το μέγιστο (χρησιμοποίησε τριαδικό τελεστή ή if)
    int maxVal = (a > b) ? ((a > c) ? a : c) : ((b > c) ? __________ : __________);
    
    cout << "Άθροισμα: " << sum << endl;
    cout << "Μέσος όρος: " << avg << endl;
    cout << "Μέγιστο: " << maxVal << endl;
    
    return 0;
}
