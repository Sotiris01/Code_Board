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
    
    // TODO: Έλεγξε την επιλογή του χρήστη
    if (choice __________ 1) {
        // Ανάληψη
        cout << "Ποσό ανάληψης: ";
        cin >> amount;
        
        // TODO: Έλεγξε αν επαρκεί το υπόλοιπο
        if (amount __________ balance) {
            balance = balance - amount;
            cout << "Νέο υπόλοιπο: " << balance << " €" << endl;
        }
        else {
            cout << "Not enough money in account" << endl;
        }
    }
    else if (choice __________ 2) {
        // Κατάθεση
        cout << "Ποσό κατάθεσης: ";
        cin >> amount;
        
        // TODO: Πρόσθεσε το ποσό στο υπόλοιπο
        balance = balance __________ amount;
        cout << "Νέο υπόλοιπο: " << balance << " €" << endl;
    }
    else if (choice == __________) {
        // Έξοδος
        cout << "Thank you for your preference to our Bank" << endl;
    }
    else {
        cout << "Μη έγκυρη επιλογή!" << endl;
    }
    
    return 0;
}
