/*
 * ΑΣΚΗΣΗ: Μέγιστο σερί ίσων
 * 
 * Ο χρήστης δίνει πρώτα τον αριθμό N (πόσους αριθμούς θα εισάγει).
 * Στη συνέχεια δίνει N ακέραιους αριθμούς, έναν-έναν.
 * Το πρόγραμμα βρίσκει το μεγαλύτερο πλήθος διαδοχικών ίσων τιμών
 * και ποια ήταν η τιμή αυτή.
 * Παράδειγμα: Για τους 5 5 3 3 3 2 7 7 → μέγιστο σερί 3 (τιμή: 3)
 */

#include <iostream>
using namespace std;

int main() {
    int n, num, prev;
    int streak = 1, maxStreak = 1;
    
    cout << "Πόσοι; ";
    cin >> n;
    
    for (int i = 0; i < n; i++) {
        cout << "Αριθμός: ";
        cin >> num;
        
        if (i == 0) {
            prev = num;
        } else {
            if (num == prev) {
                streak++;
                if (streak > maxStreak) {
                    maxStreak = streak;
                }
            } else {
                streak = 1;
            }
            prev = num;
        }
    }
    
    cout << "Μέγιστο σερί: " << maxStreak << endl;
    
    return 0;
}
