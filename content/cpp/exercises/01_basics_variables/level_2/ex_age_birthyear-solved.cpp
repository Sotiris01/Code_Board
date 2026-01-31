// Άσκηση: Ηλικία και Έτος Γέννησης (Άσκηση Δ από PDF)
// Διάβασε την ηλικία και το έτος γέννησης και εμφάνισέ τα

#include <iostream>
using namespace std;

int main() {
    int age, year;
    
    // Ζήτησε από τον χρήστη την ηλικία του
    cout << "How old are you? ";
    cin >> age;
    
    // Ζήτησε από τον χρήστη το έτος γέννησης
    cout << "When were you born? ";
    cin >> year;
    
    // Εμφάνισε και τις δύο τιμές σε μία γραμμή
    // Παράδειγμα εξόδου: "You were born in 2008 You are 17 years old."
    cout << "You were born in " << year 
         << " You are " << age 
         << " years old." << endl;
    
    return 0;
}
