import React from 'react';
import PropTypes from 'prop-types';
import { SmallIcon, SmallTextIcon } from './smallIcon';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      albums,
      toggleSidebar,
      selectAlbum,
      logname
    } = this.props;
    return (
      <div className='sidebar-tray'>
        <div className='sidebar-content'>
          <SmallIcon src='/static/img/sidebar-collapse.png' className='sidebar-icon' onClick={toggleSidebar} />
          <h1>Albums</h1>
          {
            albums.map((album) => {
              return (<SmallTextIcon text={album.name} className={'sidebar-album'} onClick={selectAlbum} args={{ id: album.id, name: album.name }} />)
            })
          }
        </div>
        <div className='upload-link'>
          {
            logname === 'dokastho' ? <h2><a href='/upload/'>Upload</a></h2> : null
          }
        </div>
      </div>
    )
  }
}

Sidebar.propTypes = {
  albums: PropTypes.instanceOf(Array),
  logname: PropTypes.string.isRequired,
  // toggleSidebar: collapse sidebar
  // selectAlbum: select album for focusing
};

export default Sidebar
