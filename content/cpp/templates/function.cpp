// Function Definition

#include <iostream>
#include <string>
using namespace std;

// Function declaration
string greet(string name);

int main() {
    string message = greet("World");
    cout << message << endl;
    
    return 0;
}

// Function definition
string greet(string name) {
    return "Hello, " + name + "!";
}
