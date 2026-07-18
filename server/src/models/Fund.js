import mongoose from 'mongoose';

export const TRANSACTION_TYPES = ['DEPOSIT', 'WITHDRAWAL'];

const transactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: TRANSACTION_TYPES, required: true },
    amount: { type: Number, required: true, min: [1, 'Amount must be at least 1'] },
    note: { type: String, trim: true, default: '', maxlength: 160 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const fundSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    availableBalance: { type: Number, default: 0, min: 0 },
    // Capital currently committed to open positions.
    usedMargin: { type: Number, default: 0, min: 0 },
    transactions: { type: [transactionSchema], default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

fundSchema.virtual('totalDeposits').get(function totalDeposits() {
  return this.transactions
    .filter((t) => t.type === 'DEPOSIT')
    .reduce((sum, t) => sum + t.amount, 0);
});

fundSchema.virtual('totalWithdrawals').get(function totalWithdrawals() {
  return this.transactions
    .filter((t) => t.type === 'WITHDRAWAL')
    .reduce((sum, t) => sum + t.amount, 0);
});

export const Fund = mongoose.model('Fund', fundSchema);
