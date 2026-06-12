// Inheritance: SavingsAccount extends BankAccount
public class SavingsAccount extends BankAccount {
    private double interestRate;

    public SavingsAccount(String accountNumber, String accountHolderName, double balance, double interestRate) {
        super(accountNumber, accountHolderName, balance); // Call parent constructor
        this.interestRate = interestRate;
    }

    // Implementing the abstract method
    @Override
    public void calculateInterest() {
        double interest = balance * (interestRate / 100);
        System.out.println("Savings Interest at " + interestRate + "% : $" + interest);
        deposit(interest); // Adds interest to balance
    }
}
