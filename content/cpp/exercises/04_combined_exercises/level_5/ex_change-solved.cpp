/*
 * ΑΣΚΗΣΗ: Ο Αλγόριθμος του Ταμία
 * 
 * Ουσία: Greedy algorithm για ρέστα σε λεπτά
 */

#include <iostream>
using namespace std;

int main() {
    int bill, paid, change;
    
    cout << "Λογαριασμός (λεπτά): ";
    cin >> bill;
    cout << "Πληρωμή (λεπτά): ";
    cin >> paid;
    
    change = paid - bill;
    
    if (change < 0) {
        cout << "Ανεπαρκές ποσό! Χρωστάει " << (-change) << " λεπτά." << endl;
        return 0;
    }
    
    if (change == 0) {
        cout << "Ακριβές ποσό, δεν υπάρχουν ρέστα." << endl;
        return 0;
    }
    
    cout << "Ρέστα: " << change << " λεπτά" << endl;
    
    int coins[] = {5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1};
    string names[] = {"50€", "20€", "10€", "5€", "2€", "1€", "50λ", "20λ", "10λ", "5λ", "2λ", "1λ"};
    
    // Εναλλακτικά χωρίς πίνακες:
    int c;
    
    c = change / 5000;
    if (c > 0) { cout << "50€: " << c << endl; change %= 5000; }
    
    c = change / 2000;
    if (c > 0) { cout << "20€: " << c << endl; change %= 2000; }
    
    c = change / 1000;
    if (c > 0) { cout << "10€: " << c << endl; change %= 1000; }
    
    c = change / 500;
    if (c > 0) { cout << "5€: " << c << endl; change %= 500; }
    
    c = change / 200;
    if (c > 0) { cout << "2€: " << c << endl; change %= 200; }
    
    c = change / 100;
    if (c > 0) { cout << "1€: " << c << endl; change %= 100; }
    
    c = change / 50;
    if (c > 0) { cout << "50λ: " << c << endl; change %= 50; }
    
    c = change / 20;
    if (c > 0) { cout << "20λ: " << c << endl; change %= 20; }
    
    c = change / 10;
    if (c > 0) { cout << "10λ: " << c << endl; change %= 10; }
    
    c = change / 5;
    if (c > 0) { cout << "5λ: " << c << endl; change %= 5; }
    
    c = change / 2;
    if (c > 0) { cout << "2λ: " << c << endl; change %= 2; }
    
    c = change;
    if (c > 0) { cout << "1λ: " << c << endl; }
    
    return 0;
}
