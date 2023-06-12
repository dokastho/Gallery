import React from 'react';
import PropTypes from 'prop-types';

class SmallIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { src, className, onClick } = this.props;
    return (
      <img src={src} className={className} id='small-icon' onClick={() => { onClick() }} />
    )
  }
}

SmallIcon.propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  // onClick: action method on click
};

class SmallTextIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { text, className, onClick, args } = this.props;
    return (
      <h2 className={className} id='small-text' onClick={() => { onClick(args) }}>{text}</h2>
    )
  }
}

SmallTextIcon.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  args: PropTypes.instanceOf(Object),
  // onClick: action method on click
};

export { SmallIcon, SmallTextIcon }
