import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import { v4 as uuid } from "uuid";

export default function useExpenses() {
  const { expenses, setExpenses } = useContext(UserContext);

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: uuid(),
      createdAt: new Date().toISOString(),
    };
    setExpenses([...expenses, newExpense]);
    return newExpense;
  };

  const updateExpense = (id, updatedData) => {
    const updated = expenses.map((exp) =>
      exp.id === id ? { ...exp, ...updatedData } : exp
    );
    setExpenses(updated);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  const getExpensesByProject = (projectId) => {
    return expenses.filter((exp) => exp.projectId === projectId);
  };

  const getTotalExpenses = () => {
    return expenses.reduce((total, exp) => total + Number(exp.amount), 0);
  };

  const getTotalExpensesByProject = (projectId) => {
    return getExpensesByProject(projectId).reduce(
      (total, exp) => total + Number(exp.amount),
      0
    );
  };

  return {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpensesByProject,
    getTotalExpenses,
    getTotalExpensesByProject,
  };
}
