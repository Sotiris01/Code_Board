// Άσκηση: Εμφωλευμένα Loops - Μοτίβο Αστεριών
// Σχεδίασε ένα τρίγωνο από αστεράκια

#include <iostream>
using namespace std;

int main() {
    int rows;
    
    cout << "Πόσες γραμμές; ";
    cin >> rows;
    
    // TODO: Εξωτερικό loop για κάθε γραμμή
    for (int i = 1; i <= rows; __________) {
        // TODO: Εσωτερικό loop για τα αστέρια κάθε γραμμής
        // Η γραμμή i έχει i αστέρια
        for (int j = 1; j <= __________; j++) {
            cout << "* ";
        }
        // Αλλαγή γραμμής
        cout << endl;
    }
    
    // Έξοδος για rows=5:
    // *
    // * *
    // * * *
    // * * * *
    // * * * * *
    
    return 0;
}
