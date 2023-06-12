import React from 'react';
import PropTypes from 'prop-types';
import { SmallIcon, SmallTextIcon } from './smallIcon';

class AlbumInfoBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      logname,
      albumName,
      albumid,
      sidebarShow,
      toggleSidebar,
      deleteAlbum
    } = this.props;
    return (
      <div className='album-info-bar'>
        {
          sidebarShow ? (null) : (<SmallIcon src='/static/img/sidebar-collapse.png' className='sidebar-icon' onClick={toggleSidebar} />)
        }
        <h1 style={{ paddingLeft: '1rem' }}>{albumName}</h1>
        {
          logname === 'dokastho' && albumName !== 'All Photos' ? <SmallTextIcon text={'delete album'} className={'sidebar-icon'} onClick={deleteAlbum} args={{ id: albumid }} /> : null
        }
      </div>
    )
  }
}

AlbumInfoBar.propTypes = {
  logname: PropTypes.string.isRequired,
  albumName: PropTypes.string.isRequired,
  albumid: PropTypes.number.isRequired,
  sidebarShow: PropTypes.bool.isRequired,
  // toggleSidebar: raise sidebar
  // deleteAlbum: delete an entire album
};

export default AlbumInfoBar
