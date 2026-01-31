// Άσκηση: Μέγιστο από Τέσσερα (Άσκηση 6 από PDF)
// Βρες το μέγιστο χρησιμοποιώντας την ίδια μεταβλητή

#include <iostream>
using namespace std;

int main() {
    double height, maxHeight;
    
    cout << "=== Βρες το Μεγαλύτερο Ύψος ===" << endl;
    
    // Πρώτο ύψος - αρχικοποίησε το max
    cout << "Ύψος 1ου φίλου: ";
    cin >> height;
    maxHeight = height;  // Το πρώτο είναι και το μέγιστο αρχικά
    
    // Δεύτερο ύψος
    cout << "Ύψος 2ου φίλου: ";
    cin >> height;
    // Αν είναι μεγαλύτερο, ενημέρωσε το max
    if (height > maxHeight) {
        maxHeight = height;
    }
    
    // Τρίτο ύψος
    cout << "Ύψος 3ου φίλου: ";
    cin >> height;
    // Αν είναι μεγαλύτερο, ενημέρωσε το max
    if (height > maxHeight) {
        maxHeight = height;
    }
    
    // Τέταρτο ύψος
    cout << "Ύψος 4ου φίλου: ";
    cin >> height;
    // Αν είναι μεγαλύτερο, ενημέρωσε το max
    if (height > maxHeight) {
        maxHeight = height;
    }
    
    cout << "\nΤο μεγαλύτερο ύψος είναι: " << maxHeight << " εκ." << endl;
    
    return 0;
}
