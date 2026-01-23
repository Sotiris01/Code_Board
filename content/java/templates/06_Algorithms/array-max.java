// Find Maximum in Array

public class ArrayMax {
    public static int findMax(int[] arr) {
        if (arr.length <= 0) return 0;
        
        int maxVal = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > maxVal) {
                maxVal = arr[i];
            }
        }
        return maxVal;
    }
    
    public static void main(String[] args) {
        int[] numbers = {3, 7, 2, 9, 1, 5};
        
        System.out.println("Maximum: " + findMax(numbers));
    }
}
