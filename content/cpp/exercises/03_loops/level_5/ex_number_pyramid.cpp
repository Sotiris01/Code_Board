// Άσκηση: Πυραμίδα Αριθμών
// Σχεδίασε πυραμίδα με αριθμούς

#include <iostream>
using namespace std;

int main() {
    int rows;
    
    cout << "Πόσες γραμμές; ";
    cin >> rows;
    
    // TODO: Δημιούργησε πυραμίδα
    // Για κάθε γραμμή i (1 έως rows):
    //   1. Εκτύπωσε (rows - i) κενά για στοίχιση
    //   2. Εκτύπωσε αριθμούς 1 έως i
    
    for (int i = 1; i <= rows; i++) {
        // TODO: Εκτύπωσε κενά για στοίχιση
        for (int space = 1; space <= rows - __________; space++) {
            cout << "  ";
        }
        
        // TODO: Εκτύπωσε αριθμούς 1 έως i
        for (int num = 1; num <= __________; num++) {
            cout << num << " ";
        }
        
        cout << endl;
    }
    
    // Έξοδος για rows=5:
    //         1
    //       1 2
    //     1 2 3
    //   1 2 3 4
    // 1 2 3 4 5
    
    return 0;
}
