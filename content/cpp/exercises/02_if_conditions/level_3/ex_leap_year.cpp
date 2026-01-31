// Άσκηση: Έλεγχος Δίσεκτου Έτους
// Ένα έτος είναι δίσεκτο αν διαιρείται με 4, εκτός αν διαιρείται με 100,
// εκτός αν διαιρείται με 400

#include <iostream>
using namespace std;

int main() {
    int year;
    
    cout << "Δώσε ένα έτος: ";
    cin >> year;
    
    // TODO: Συμπλήρωσε τη σύνθετη συνθήκη
    // Δίσεκτο: (διαιρείται με 400) Ή (διαιρείται με 4 ΚΑΙ ΔΕΝ διαιρείται με 100)
    
    bool divisibleBy4 = (year % 4 == 0);
    bool divisibleBy100 = (year % 100 == 0);
    bool divisibleBy400 = (year __________ 400 == 0);
    
    if (divisibleBy400 __________ (divisibleBy4 && !divisibleBy100)) {
        cout << year << " είναι δίσεκτο έτος" << endl;
    }
    else {
        cout << year << " δεν είναι δίσεκτο έτος" << endl;
    }
    
    return 0;
}
