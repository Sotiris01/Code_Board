// Άσκηση: Έλεγχος Δίσεκτου Έτους
// Ένα έτος είναι δίσεκτο αν διαιρείται με 4, εκτός αν διαιρείται με 100,
// εκτός αν διαιρείται με 400

#include <iostream>
using namespace std;

int main() {
    int year;
    
    cout << "Δώσε ένα έτος: ";
    cin >> year;
    
    // Σύνθετη συνθήκη για δίσεκτο έτος
    bool divisibleBy4 = (year % 4 == 0);
    bool divisibleBy100 = (year % 100 == 0);
    bool divisibleBy400 = (year % 400 == 0);
    
    // Δίσεκτο: διαιρείται με 400 Ή (διαιρείται με 4 ΚΑΙ ΔΕΝ με 100)
    if (divisibleBy400 || (divisibleBy4 && !divisibleBy100)) {
        cout << year << " είναι δίσεκτο έτος" << endl;
    }
    else {
        cout << year << " δεν είναι δίσεκτο έτος" << endl;
    }
    
    return 0;
}
