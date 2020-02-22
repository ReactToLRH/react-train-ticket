import { useCallback } from 'react';
import { h0 } from '../utils/utils';

export default function useNav(departDate, prevDate, nextDate) {
  const isPrevDisabled = h0(departDate) <= h0();
  const isNextDisabled = h0(departDate) - h0() > 20 * 24 * 60 * 60 * 1000;

  const prev = useCallback(() => {
    if (isPrevDisabled) {
      return;
    }
    prevDate();
  }, [isPrevDisabled, prevDate]);

  const next = useCallback(() => {
    if (isNextDisabled) {
      return;
    }
    nextDate();
  }, [isNextDisabled, nextDate]);

  return {
    isPrevDisabled,
    isNextDisabled,
    prev,
    next
  };
}
