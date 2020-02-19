import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

export default function Header(props) {
  const { onBack, title, isShowBack } = props;

  return (
    <div className="header-wrapper">
      <div className="header">
        {isShowBack ? (
          <div className="header-back" onClick={onBack}>
            <svg width="42" height="42">
              <polyline
                points="25,13 16,21 25,29"
                stroke="#fff"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        ) : null}
        <h1 className="header-title">{title}</h1>
      </div>
    </div>
  );
}

Header.propTypes = {
  onBack: PropTypes.func,
  title: PropTypes.string.isRequired,
  isShowBack: PropTypes.bool
};

Header.defaultProps = {
  isShowBack: true
};
