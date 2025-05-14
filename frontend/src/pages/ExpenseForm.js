import React, { useState } from 'react';
import { handleError } from '../utils';
import './ExpenseForm.css';
function ExpenseForm({ addTransaction }) {
    const [expenseInfo, setExpenseInfo] = useState({
        amount: '',
        text: '',
        type: 'Select' // Adding a type field to distinguish between income and expense
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpenseInfo((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const addExpenses = (e) => {
        e.preventDefault();
        const { amount, text, type } = expenseInfo;
        if (!amount || !text || type=='Select') {
            handleError('Please add Expense Details');
            return;
        }

        // Convert amount to number
        const amountValue = parseFloat(amount);

        // Ensure proper type
        const transaction = { 
            ...expenseInfo, 
            amount: type === 'expense' ? -Math.abs(amountValue) : Math.abs(amountValue) // Handle expense or income
        };

        addTransaction(transaction);
        setExpenseInfo({ amount: '', text: '', type: 'expense' }); // Resetting form
    };

    return (
        <div className='container'>
            <h1>Expense Tracker</h1>
            <form onSubmit={addExpenses}>
                <div>
                    <label htmlFor='text'>Detail</label>
                    <input
                        onChange={handleChange}
                        type='text'
                        name='text'
                        placeholder='Enter detail...'
                        value={expenseInfo.text}
                    />
                </div>
                <div>
                    <label htmlFor='amount'>Amount</label>
                    <input
                        onChange={handleChange}
                        type='number'
                        name='amount'
                        placeholder='Enter amount...'
                        value={expenseInfo.amount}
                    />
                </div>
                <div>
                    <label htmlFor='type'>Type</label>
                    <select
                        name='type'
                        onChange={handleChange}
                        value={expenseInfo.type}
                    >
                        <option value='Select'>Select</option>
                        <option value='expense'>Expense</option>
                        <option value='income'>Income</option>
                    </select>
                </div>
                <button type='submit'>Add Transaction</button>
            </form>
        </div>
    );
}

export default ExpenseForm;
