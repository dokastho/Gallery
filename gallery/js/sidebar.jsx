import React from 'react';
import PropTypes from 'prop-types';
import SmallIcon from './smallIcon';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { albums, toggleSidebar } = this.props;
    return (
      <div className='sidebar-tray'>
        <div className='sidebar-content'>
          <SmallIcon src='/static/img/sidebar-collapse.png' className='sidebar-icon' onClick={toggleSidebar} />
          <h1>Albums</h1>
          {
            albums.map((album) => {
              return (<h2>{album.name}</h2>)
            })
          }
        </div>
      </div>
    )
  }
}

Sidebar.propTypes = {
  albums: PropTypes.instanceOf(Array),
  // toggleSidebar: collapse sidebar
};

export default Sidebar
