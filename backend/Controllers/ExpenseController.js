const UserModel = require("../Models/User");

const addTransaction = async (req, res) => {
    const { _id } = req.user;
    const transaction = req.body;

    try {
        // Check if transaction type is 'expense' or 'income' and set amount accordingly
        if (transaction.type === 'expense') {
            transaction.amount = -Math.abs(transaction.amount);
        } else if (transaction.type === 'income') {
            transaction.amount = Math.abs(transaction.amount);
        }

        const userData = await UserModel.findByIdAndUpdate(
            _id,
            { $push: { expenses: transaction } },
            { new: true } // Return the updated document
        );

        if (!userData) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        res.status(200).json({
            message: "Transaction added successfully",
            success: true,
            data: userData.expenses
        });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({
            message: "Failed to add transaction",
            error: err.message,
            success: false
        });
    }
};

const getAllTransactions = async (req, res) => {
    const { _id } = req.user;

    try {
        const userData = await UserModel.findById(_id).select('expenses');

        if (!userData) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        res.status(200).json({
            message: "Expenses fetched successfully",
            success: true,
            data: userData.expenses
        });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({
            message: "Failed to fetch expenses",
            error: err.message, // Provide error message instead of error object
            success: false
        });
    }
};

const deleteTransaction = async (req, res) => {
    const { _id } = req.user;
    const expenseId = req.params.expenseId;

    try {
        const userData = await UserModel.findByIdAndUpdate(
            _id,
            { $pull: { expenses: { _id: expenseId } } },
            { new: true } // Return the updated document
        );

        if (!userData) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        res.status(200).json({
            message: "Expense deleted successfully",
            success: true,
            data: userData.expenses
        });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({
            message: "Failed to delete expense",
            error: err.message,
            success: false
        });
    }
};


module.exports = {
    addTransaction,
    getAllTransactions,
    deleteTransaction
};
