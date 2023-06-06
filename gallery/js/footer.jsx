import React from 'react';
import PropTypes from 'prop-types';

class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='footer-tray'>
        <div className='footer-content'>
          <h3>link 1</h3>
          <h3>link 2</h3>
          <h3>link 3</h3>
        </div>
      </div>
    )
  }
}

Footer.propTypes = {};

export default Footer
