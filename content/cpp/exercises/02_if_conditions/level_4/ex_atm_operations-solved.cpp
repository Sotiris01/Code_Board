// Άσκηση: Λειτουργίες ATM (Άσκηση 13 από PDF)
// Ανάληψη, Κατάθεση, Έξοδος με έλεγχο υπολοίπου

#include <iostream>
using namespace std;

int main() {
    double balance = 480.0;  // Αρχικό υπόλοιπο
    int choice;
    double amount;
    
    cout << "=== ATM ===" << endl;
    cout << "Υπόλοιπο: " << balance << " €\n" << endl;
    
    // Εμφάνισε το μενού
    cout << "1. Withdrawal (Ανάληψη)" << endl;
    cout << "2. Deposit (Κατάθεση)" << endl;
    cout << "3. Exit (Έξοδος)" << endl;
    cout << "\nΕπιλογή: ";
    cin >> choice;
    
    // Έλεγξε την επιλογή του χρήστη
    if (choice == 1) {
        // Ανάληψη
        cout << "Ποσό ανάληψης: ";
        cin >> amount;
        
        // Έλεγξε αν επαρκεί το υπόλοιπο
        if (amount <= balance) {
            balance = balance - amount;
            cout << "Νέο υπόλοιπο: " << balance << " €" << endl;
        }
        else {
            cout << "Not enough money in account" << endl;
        }
    }
    else if (choice == 2) {
        // Κατάθεση
        cout << "Ποσό κατάθεσης: ";
        cin >> amount;
        
        // Πρόσθεσε το ποσό στο υπόλοιπο
        balance = balance + amount;
        cout << "Νέο υπόλοιπο: " << balance << " €" << endl;
    }
    else if (choice == 3) {
        // Έξοδος
        cout << "Thank you for your preference to our Bank" << endl;
    }
    else {
        cout << "Μη έγκυρη επιλογή!" << endl;
    }
    
    return 0;
}
