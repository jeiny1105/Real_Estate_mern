const MS_IN_DAY = 1000 * 60 * 60 * 24;

/* Get remaining days */
const calculateRemainingDays = (startDate, expiryDate) => {
  const now = new Date();

  if (!expiryDate || expiryDate <= now) return 0;

  const remainingMs = expiryDate - now;
  return Math.ceil(remainingMs / MS_IN_DAY);
};

/* Calculate remaining monetary value */
const calculateRemainingValue = (
  remainingDays,
  totalDuration,
  currentPlanPrice
) => {
  if (remainingDays <= 0) return 0;

  const perDayValue = currentPlanPrice / totalDuration;
  return perDayValue * remainingDays;
};

/* Calculate final upgrade payable amount */
const calculateUpgradeAmount = ({
  startDate,
  expiryDate,
  currentPrice,
  currentDuration,
  newPrice,
}) => {
  const remainingDays = calculateRemainingDays(startDate, expiryDate);

  if (remainingDays <= 0) {
    return {
      remainingDays: 0,
      remainingValue: 0,
      payableAmount: newPrice,
    };
  }

  const remainingValue = calculateRemainingValue(
    remainingDays,
    currentDuration,
    currentPrice
  );

  let payableAmount = newPrice - remainingValue;

  if (payableAmount < 0) payableAmount = 0;

  return {
    remainingDays,
    remainingValue: Number(remainingValue.toFixed(2)),
    payableAmount: Number(payableAmount.toFixed(2)),
  };
};

module.exports = {
  calculateUpgradeAmount,
};