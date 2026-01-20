// Function with Default Parameters

#include <iostream>
#include <string>
using namespace std;

string greet(string name, string greeting = "Hello") {
    return greeting + ", " + name + "!";
}

int main() {
    cout << greet("Alice") << endl;
    cout << greet("Bob", "Hi") << endl;
    
    return 0;
}
