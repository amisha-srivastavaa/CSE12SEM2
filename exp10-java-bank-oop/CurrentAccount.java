// Inheritance: CurrentAccount extends BankAccount
public class CurrentAccount extends BankAccount {
    private double maintenanceFee;

    public CurrentAccount(String accountNumber, String accountHolderName, double balance, double maintenanceFee) {
        super(accountNumber, accountHolderName, balance);
        this.maintenanceFee = maintenanceFee;
    }

    // Implementing the abstract method
    @Override
    public void calculateInterest() {
        System.out.println("Current Accounts do not earn interest.");
        System.out.println("Deducting maintenance fee: $" + maintenanceFee);
        
        if (balance >= maintenanceFee) {
            balance -= maintenanceFee;
            System.out.println("New Balance after fee deduction: $" + balance);
        } else {
            System.out.println("Insufficient funds to deduct fee.");
        }
    }
}
