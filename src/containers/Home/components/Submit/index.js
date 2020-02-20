import React, { memo } from 'react';
import './style.css';

export default memo(function Submit(props) {
  const { onSubmit } = props;

  return (
    <div className="submit">
      <button
        type="submit"
        className="submit-button"
        onClick={() => onSubmit()}
      >
        {' '}
        搜索{' '}
      </button>
    </div>
  );
});
