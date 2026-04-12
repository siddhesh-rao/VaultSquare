// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract RentalAgreement {
    struct Agreement {
        uint256 agreementId;
        address payable renter;
        address payable owner;
        string productId;
        uint256 startDate;
        uint256 endDate;
        uint256 depositAmount;
        bool isPaymentReleased;
        bool isDepositRefunded;
        bool exists;
    }

    uint256 public agreementCounter;
    mapping(uint256 => Agreement) public agreements;

    event RentalAgreementCreated(
        uint256 indexed agreementId,
        address indexed renter,
        address indexed owner,
        string productId,
        uint256 startDate,
        uint256 endDate,
        uint256 depositAmount
    );
    event PaymentReleased(uint256 indexed agreementId, uint256 amount);
    event DepositRefunded(uint256 indexed agreementId, uint256 amount);

    function createRentalAgreement(
        address renter,
        address owner,
        string memory productId,
        uint256 startDate,
        uint256 endDate,
        uint256 depositAmount
    ) external returns (uint256) {
        require(renter != address(0), "Invalid renter");
        require(owner != address(0), "Invalid owner");
        require(endDate >= startDate, "Invalid duration");

        agreementCounter += 1;

        agreements[agreementCounter] = Agreement({
            agreementId: agreementCounter,
            renter: payable(renter),
            owner: payable(owner),
            productId: productId,
            startDate: startDate,
            endDate: endDate,
            depositAmount: depositAmount,
            isPaymentReleased: false,
            isDepositRefunded: false,
            exists: true
        });

        emit RentalAgreementCreated(
            agreementCounter,
            renter,
            owner,
            productId,
            startDate,
            endDate,
            depositAmount
        );

        return agreementCounter;
    }

    function releasePayment(uint256 agreementId) external {
        Agreement storage agreement = agreements[agreementId];

        require(agreement.exists, "Agreement does not exist");
        require(!agreement.isPaymentReleased, "Payment already released");

        agreement.isPaymentReleased = true;

        emit PaymentReleased(agreementId, agreement.depositAmount);
    }

    function refundDeposit(uint256 agreementId) external {
        Agreement storage agreement = agreements[agreementId];

        require(agreement.exists, "Agreement does not exist");
        require(!agreement.isDepositRefunded, "Deposit already refunded");

        agreement.isDepositRefunded = true;

        emit DepositRefunded(agreementId, agreement.depositAmount);
    }
}
