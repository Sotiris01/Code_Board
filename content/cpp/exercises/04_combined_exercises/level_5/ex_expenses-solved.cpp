/*
 * ΑΣΚΗΣΗ: Ο Κύριος Παπαδόπουλος και οι Λογαριασμοί του
 * 
 * Ουσία: Είσοδος εξόδων μέχρι 0, αγνόηση αρνητικών,
 * σύνολο, πλήθος, σύγκριση με 850€
 */

#include <iostream>
using namespace std;

int main() {
    double expense;
    double total = 0;
    int count = 0;
    double salary = 850;
    
    cout << "Καταγραφή εξόδων (0 για τέλος):" << endl;
    
    while (true) {
        cout << "Έξοδο: ";
        cin >> expense;
        
        if (expense == 0) {
            break;
        }
        
        if (expense < 0) {
            cout << "Μη έγκυρο! Ξαναδώσε." << endl;
            continue;
        }
        
        total += expense;
        count++;
    }
    
    cout << "\n=== ΑΠΟΤΕΛΕΣΜΑΤΑ ===" << endl;
    cout << "Συνολικά έξοδα: " << total << "€" << endl;
    cout << "Πλήθος εξόδων: " << count << endl;
    
    if (total > salary) {
        cout << "ΠΡΟΕΙΔΟΠΟΙΗΣΗ: Υπέρβαση προϋπολογισμού!" << endl;
        cout << "Υπέρβαση κατά: " << (total - salary) << "€" << endl;
    } else {
        cout << "Υπόλοιπο: " << (salary - total) << "€" << endl;
    }
    
    return 0;
}
