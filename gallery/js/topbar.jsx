import React from 'react';
import PropTypes from 'prop-types';

class Topbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { logname } = this.props;
    return (
      <div className='topbar-tray'>
        <div className='topbar-content'>
          <h1>Photos</h1>
          <h2>{logname}</h2>
        </div>
      </div>
    )
  }
}

Topbar.propTypes = {
    logname: PropTypes.string.isRequired
};

export default Topbar
