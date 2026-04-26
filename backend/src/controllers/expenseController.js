import Expense from '../models/Expense.js';

export const getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ user: req.user._id })
      .populate('category', 'name color')
      .sort({ date: -1 });
    res.json({ success: true, count: expenses.length, data: expenses });
  } catch (error) { next(error); }
};

export const getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id })
      .populate('category', 'name color');
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    res.json({ success: true, data: expense });
  } catch (error) { next(error); }
};

export const createExpense = async (req, res, next) => {
  try {
    const { title, amount, category, date, note } = req.body;
    if (!title || !amount || !category) {
      return res.status(400).json({ success: false, message: 'Please provide title, amount and category' });
    }
    if (amount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be greater than zero' });
    }
    const expense = await Expense.create({
      title: title.trim(), amount, category,
      user: req.user._id,
      date: date || Date.now(),
      note: note?.trim() || '',
    });
    const populated = await expense.populate('category', 'name color');
    res.status(201).json({ success: true, data: populated });
  } catch (error) { next(error); }
};

export const updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    const { title, amount, category, date, note } = req.body;
    if (title) expense.title = title.trim();
    if (amount !== undefined) {
      if (amount <= 0) return res.status(400).json({ success: false, message: 'Amount must be greater than zero' });
      expense.amount = amount;
    }
    if (category) expense.category = category;
    if (date) expense.date = date;
    if (note !== undefined) expense.note = note.trim();
    await expense.save();
    const populated = await expense.populate('category', 'name color');
    res.json({ success: true, data: populated });
  } catch (error) { next(error); }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    await expense.deleteOne();
    res.json({ success: true, message: 'Expense deleted' });
  } catch (error) { next(error); }
};

export const getExpenseSummary = async (req, res, next) => {
  try {
    const summary = await Expense.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
      { $unwind: '$category' },
      { $sort: { total: -1 } },
    ]);
    const totalSpent = summary.reduce((acc, item) => acc + item.total, 0);
    res.json({ success: true, totalSpent, data: summary });
  } catch (error) { next(error); }
};