// Άσκηση: Πυραμίδα Αριθμών
// Σχεδίασε πυραμίδα με αριθμούς

#include <iostream>
using namespace std;

int main() {
    int rows;
    
    cout << "Πόσες γραμμές; ";
    cin >> rows;
    
    // Δημιουργία πυραμίδας
    for (int i = 1; i <= rows; i++) {
        // Κενά για στοίχιση (rows - i κενά)
        for (int space = 1; space <= rows - i; space++) {
            cout << "  ";
        }
        
        // Αριθμοί 1 έως i
        for (int num = 1; num <= i; num++) {
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
