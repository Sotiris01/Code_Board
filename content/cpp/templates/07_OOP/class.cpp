// Class Definition

#include <iostream>
#include <string>
using namespace std;

class Person {
private:
    string name;
    int age;

public:
    // Constructor
    Person(string n, int a) : name(n), age(a) {}
    
    // Methods
    string greet() {
        return "Hello, I'm " + name + "!";
    }
    
    string birthday() {
        age++;
        return "Happy birthday! Now " + to_string(age) + " years old.";
    }
    
    // Getters
    string getName() { return name; }
    int getAge() { return age; }
};

int main() {
    Person person("Alice", 25);
    
    cout << person.greet() << endl;
    cout << person.birthday() << endl;
    
    return 0;
}
