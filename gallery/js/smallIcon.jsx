import React from 'react';
import PropTypes from 'prop-types';

class SmallIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { src, className, onClick } = this.props;
    return (
        <img src={src} className={className} id='small-icon' onClick={() => {onClick()}} />
    )
  }
}

SmallIcon.propTypes = {
    src: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
};

export default SmallIcon
