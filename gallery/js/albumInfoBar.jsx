import React from 'react';
import PropTypes from 'prop-types';
import { SmallIcon, SmallTextIcon, SmallConfirmatoryTextIcon } from './smallIcon';
import DropDownSearch from './dropDownSearch';

class AlbumInfoBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shareButtonSelected: false,
    }
    this.toggleShareButton = this.toggleShareButton.bind(this);
  }

  toggleShareButton() {
    const { shareButtonSelected } = this.state;
    this.setState({ shareButtonSelected: !shareButtonSelected });
  }

  render() {
    const {
      logname,
      albumName,
      albumid,
      sidebarShow,
      toggleSidebar,
      deleteAlbum,
      usernames
    } = this.props;
    const {
      shareButtonSelected
    } = this.state;
    const usernamesNotMe = usernames.filter(item => item !== logname)
    return (
      <div className='album-info-bar'>
        {
          sidebarShow ? (null) : (<SmallIcon src='/static/img/sidebar-collapse.png' keyName={'sidebar'} className='sidebar-icon' onClick={toggleSidebar} />)
        }
        <h1 style={{ paddingLeft: '1rem' }}>{albumName}</h1>
        <div>
          {
            logname === 'dokastho' && albumName !== 'All Photos' ? <SmallConfirmatoryTextIcon text={'delete album'} className={'infobar-text'} onClick={deleteAlbum} args={{ id: albumid }} /> : null
          }
          {
            shareButtonSelected ? <DropDownSearch items={usernamesNotMe} name={'drop-down'} target={`/api/v1/album/share/${albumid}/`} toggleRender={this.toggleShareButton} /> : (
              albumName !== 'All Photos' ? <SmallTextIcon text={'share album'} className={'infobar-text'} onClick={this.toggleShareButton} args={null} /> : null
            ) 
          }
        </div>
      </div>
    )
  }
}

AlbumInfoBar.propTypes = {
  logname: PropTypes.string.isRequired,
  albumName: PropTypes.string.isRequired,
  albumid: PropTypes.number.isRequired,
  sidebarShow: PropTypes.bool.isRequired,
  usernames: PropTypes.instanceOf(Array)
  // toggleSidebar: raise sidebar
  // deleteAlbum: delete an entire album
};

export default AlbumInfoBar
