/*
 * ΘΕΜΑ Β - ΛΥΣΗ
 */

#include <iostream>
#include <cmath>
using namespace std;

int main() {
    int a, b, limit;
    int countEven = 0, countMult3 = 0, countBoth = 0;
    int maxPerfectSquare = -1;
    bool hasPerfectSquare = false;
    
    // Είσοδος
    do {
        cout << "a (θετικός): ";
        cin >> a;
    } while (a <= 0);
    
    do {
        cout << "b (θετικός): ";
        cin >> b;
    } while (b <= 0);
    
    cout << "Όριο L: ";
    cin >> limit;
    
    // Β1: Υπολογισμός ακολουθίας
    cout << "\nΑκολουθία: ";
    
    int prev2 = a;
    int prev1 = b;
    int current;
    
    // Πρώτος όρος
    if (a <= limit) {
        cout << a << " ";
        
        if (a % 2 == 0) countEven++;
        if (a % 3 == 0) countMult3++;
        if (a % 2 == 0 && a % 3 == 0) countBoth++;
        
        int root = sqrt(a);
        if (root * root == a) {
            hasPerfectSquare = true;
            if (a > maxPerfectSquare) maxPerfectSquare = a;
        }
    }
    
    // Δεύτερος όρος
    if (b <= limit) {
        cout << b << " ";
        
        if (b % 2 == 0) countEven++;
        if (b % 3 == 0) countMult3++;
        if (b % 2 == 0 && b % 3 == 0) countBoth++;
        
        int root = sqrt(b);
        if (root * root == b) {
            hasPerfectSquare = true;
            if (b > maxPerfectSquare) maxPerfectSquare = b;
        }
    }
    
    // Υπόλοιποι όροι
    while (true) {
        current = prev1 + prev2;
        
        if (current > limit) break;
        
        cout << current << " ";
        
        // Β2: Μετρήσεις
        if (current % 2 == 0) countEven++;
        if (current % 3 == 0) countMult3++;
        if (current % 2 == 0 && current % 3 == 0) countBoth++;
        
        // Β3: Τέλειο τετράγωνο
        int root = sqrt(current);
        if (root * root == current) {
            hasPerfectSquare = true;
            if (current > maxPerfectSquare) maxPerfectSquare = current;
        }
        
        prev2 = prev1;
        prev1 = current;
    }
    
    // Αποτελέσματα
    cout << "\n\n=== ΣΤΑΤΙΣΤΙΚΑ ===" << endl;
    cout << "Άρτιοι: " << countEven << endl;
    cout << "Πολλαπλάσια του 3: " << countMult3 << endl;
    cout << "Και τα δύο: " << countBoth << endl;
    
    if (hasPerfectSquare) {
        cout << "Μεγαλύτερο τέλειο τετράγωνο: " << maxPerfectSquare << endl;
    } else {
        cout << "Δεν υπάρχει τέλειο τετράγωνο." << endl;
    }
    
    return 0;
}
