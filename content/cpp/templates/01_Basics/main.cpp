/**
 * Main Program Template
 * Entry point for C++ application
 */
#include <iostream>
#include <string>
using namespace std;

int main() {
    // Welcome message
    cout << "Welcome to the C++ program!" << endl;
    
    // Read user input
    cout << "Enter your name: ";
    string name;
    getline(cin, name);
    
    // Display greeting
    cout << "Hello, " << name << "!" << endl;
    
    return 0;
}
