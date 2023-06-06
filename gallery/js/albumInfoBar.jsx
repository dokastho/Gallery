import React from 'react';
import PropTypes from 'prop-types';
import {SmallIcon} from './smallIcon';

class AlbumInfoBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { albumName, sidebarShow, toggleSidebar } = this.props;
    return (
      <div className='album-info-bar'>
        {
          sidebarShow ? (null) : (<SmallIcon src='/static/img/sidebar-collapse.png' className='sidebar-icon' onClick={toggleSidebar} />)
        }
        <h1 style={{paddingLeft: '1rem'}}>{albumName}</h1>
      </div>
    )
  }
}

AlbumInfoBar.propTypes = {
  albumName: PropTypes.string.isRequired,
  sidebarShow: PropTypes.bool.isRequired,
  // toggleSidebar: raise sidebar
};

export default AlbumInfoBar
