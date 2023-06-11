import React from 'react';
import Sidebar from './sidebar';
import Gallery from './gallery';
import Footer from './footer';
import Topbar from './topbar';
import { render } from 'react-dom';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logname: "log in",
      pictures: [],
      albums: [],
      sidebarShow: true,
      selectedAlbum: "All Photos"
    }
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.selectAlbum = this.selectAlbum.bind(this);
  }

  componentDidMount() {
    // fetch image metadata
    fetch('/api/v1/pictures/', { credentials: 'same-origin', method: 'POST' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        console.log("state from api");
        console.log(data);
        this.setState({
          logname: data.logname,
          pictures: data.pictures,
          albums: data.albums,
        });
      })
      .catch((error) => console.log(error));
  }

  selectAlbum(album) {
    this.setState({ selectedAlbum: album});
  }

  toggleSidebar() {
    const { sidebarShow } = this.state;
    this.setState({ sidebarShow: !sidebarShow });
  }

  render() {
    const {
      sidebarShow,
      logname,
      pictures,
      albums,
      selectedAlbum
    } = this.state;
    return (
      <div className='body-tray'>
        <Topbar logname={logname} />
        <div className='body-content'>
          {
            sidebarShow ? <Sidebar albums={albums} logname={logname} toggleSidebar={this.toggleSidebar} selectAlbum={this.selectAlbum} /> : null
          }
          <Gallery albumName={selectedAlbum} pictures={pictures} sidebarShow={sidebarShow} toggleSidebar={this.toggleSidebar} selectedAlbum={selectedAlbum} />
        </div>
        {/* <Footer /> */}
      </div>
    )
  }
}

render(
  <Index />,
  document.getElementById('reactEntry')
)