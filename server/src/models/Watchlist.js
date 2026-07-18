import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    stockName: { type: String, required: true, trim: true },
    symbol: { type: String, required: true, trim: true, uppercase: true },
    exchange: { type: String, enum: ['NSE', 'BSE'], default: 'NSE' },
    lastPrice: { type: Number, default: 0, min: 0 },
    changePercent: { type: Number, default: 0 },
    notes: { type: String, trim: true, default: '', maxlength: 240 },
  },
  { timestamps: true },
);

watchlistSchema.index({ user: 1, symbol: 1 }, { unique: true });

export const Watchlist = mongoose.model('Watchlist', watchlistSchema);
