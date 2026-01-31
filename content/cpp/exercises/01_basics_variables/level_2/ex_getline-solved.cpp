// Άσκηση: Χρήση getline
// Διάβασε ολόκληρη πρόταση (με κενά) από τον χρήστη

#include <iostream>
#include <string>
using namespace std;

int main() {
    string fullName;
    
    cout << "Δώσε το πλήρες όνομά σου: ";
    
    // Χρησιμοποιούμε getline για ολόκληρη τη γραμμή
    getline(cin, fullName);
    
    cout << "Καλημέρα " << fullName << "!" << endl;
    
    return 0;
}
