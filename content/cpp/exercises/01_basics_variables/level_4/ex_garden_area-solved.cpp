// Άσκηση: Σχεδιασμός Κήπου (Άσκηση 4 από PDF)
// Υπολόγισε την επιφάνεια γκαζόν και λουλουδιών

#include <iostream>
using namespace std;

int main() {
    double side, radius;
    const double PI = 3.14159;
    
    /*
        Κήπος: Τετράγωνο με κυκλικό παρτέρι στη μέση
        
        +-------------+
        |             |
        |    (  )     |   Κύκλος = λουλούδια
        |             |   Υπόλοιπο = γκαζόν
        +-------------+
        
        Εμβαδόν τετραγώνου = side * side
        Εμβαδόν κύκλου = PI * radius * radius
        Γκαζόν = Τετράγωνο - Κύκλος
    */
    
    cout << "=== Σχεδιασμός Κήπου ===" << endl;
    
    // Διάβασε την πλευρά του τετραγώνου
    cout << "Πλευρά τετραγώνου: ";
    cin >> side;
    
    // Διάβασε την ακτίνα του κύκλου
    cout << "Ακτίνα κύκλου: ";
    cin >> radius;
    
    // Υπολόγισε το εμβαδόν του τετραγώνου
    double square_area = side * side;
    
    // Υπολόγισε το εμβαδόν του κύκλου (PI * radius * radius)
    double circle_area = PI * radius * radius;
    
    // Υπολόγισε την επιφάνεια με γκαζόν (τετράγωνο - κύκλος)
    double lawn_area = square_area - circle_area;
    
    cout << "\n=== Αποτελέσματα ===" << endl;
    cout << "Εμβαδόν τετραγώνου: " << square_area << endl;
    cout << "Εμβαδόν κύκλου: " << circle_area << endl;
    cout << "Επιφάνεια με λουλούδια: " << circle_area << endl;
    cout << "Επιφάνεια με γκαζόν: " << lawn_area << endl;
    
    return 0;
}
