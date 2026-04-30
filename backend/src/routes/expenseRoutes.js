import express from 'express';
import {
  getExpenses, getExpenseById, createExpense,
  updateExpense, deleteExpense, getExpenseSummary,
} from '../controllers/expenseController.js';
import { protectRoute } from '../middleware/authMiddleWare.js';

const router = express.Router();
router.use(protectRoute);

router.get('/summary', getExpenseSummary);
router.get('/', getExpenses);
router.get('/:id', getExpenseById);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;