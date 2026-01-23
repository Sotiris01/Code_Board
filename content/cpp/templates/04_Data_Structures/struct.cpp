// Struct Definition

#include <iostream>
#include <string>
using namespace std;

struct Student {
    string name;
    int age;
    double gpa;
};

void printStudent(const Student& s) {
    cout << "Name: " << s.name << endl;
    cout << "Age: " << s.age << endl;
    cout << "GPA: " << s.gpa << endl;
}

int main() {
    // Create and initialize struct
    Student student1 = {"Alice", 20, 3.8};
    
    // Access members
    cout << student1.name << " is " << student1.age << " years old." << endl;
    
    // Modify members
    student1.gpa = 3.9;
    
    // Print struct
    cout << "\nStudent info:" << endl;
    printStudent(student1);
    
    return 0;
}
