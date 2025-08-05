export const calculatePenalty = (dueAt: string): number => {
  const now = new Date().getTime();
  const due = new Date(dueAt).getTime();

  const diffInMs = now - due;

  const gracePeriodMs = 24 * 60 * 60 * 1000;

  if (diffInMs <= gracePeriodMs) return 0;

  const overdueHours = Math.floor(
    (diffInMs - gracePeriodMs) / (1000 * 60 * 60)
  );
  return overdueHours * 5;
};
