// Άσκηση: Πολλαπλές Είσοδοι
// Διάβασε 3 αριθμούς και υπολόγισε άθροισμα, μέσο όρο, min, max

#include <iostream>
using namespace std;

int main() {
    // Δηλώνουμε 3 μεταβλητές
    int a, b, c;
    
    cout << "Δώσε τρεις αριθμούς χωρισμένους με κενό: ";
    // Διαβάζουμε πολλές τιμές με ένα cin
    cin >> a >> b >> c;
    
    // Υπολογισμοί
    int sum = a + b + c;
    double avg = (double)sum / 3;
    
    // Τριαδικός τελεστής για μέγιστο
    int maxVal = (a > b) ? ((a > c) ? a : c) : ((b > c) ? b : c);
    
    cout << "Άθροισμα: " << sum << endl;
    cout << "Μέσος όρος: " << avg << endl;
    cout << "Μέγιστο: " << maxVal << endl;
    
    return 0;
}
