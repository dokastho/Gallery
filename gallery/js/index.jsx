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
      filteredPictures: [],
      albums: [],
      sidebarShow: true,
      selectedAlbumName: "All Photos"
    }
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.selectAlbum = this.selectAlbum.bind(this);
    this.deletePicture = this.deletePicture.bind(this);
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
          filteredPictures: data.pictures,
          albums: data.albums,
        });
      })
      .catch((error) => console.log(error));
  }

  selectAlbum(args) {
    const { id, name } = args;
    const { pictures } = this.state;
    const filteredPictures = pictures.filter(picture => (id === parseInt(picture.albumid)) || (name === 'All Photos'));
    this.setState({ selectedAlbumName: name, filteredPictures: filteredPictures });
  }

  toggleSidebar() {
    const { sidebarShow } = this.state;
    this.setState({ sidebarShow: !sidebarShow });
  }

  deletePicture(index) {
    // fetch image metadata
    const { pictures, filteredPictures } = this.state;
    const picture = filteredPictures[index];
    fetch(`/api/v1/picture/delete/${picture.fileid}/`, { credentials: 'same-origin', method: 'POST' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .catch((error) => console.log(error));
    const updatedPictures = pictures.filter((item) => {
      return item !== picture;
    });
    const updatedFilteredPictures = filteredPictures.filter((item) => {
      return item !== picture;
    });
    
    this.setState({ pictures: updatedPictures, filteredPictures: updatedFilteredPictures });
  }

  render() {
    const {
      sidebarShow,
      logname,
      filteredPictures,
      albums,
      selectedAlbumName,
    } = this.state;
    return (
      <div className='body-tray'>
        <Topbar logname={logname} />
        <div className='body-content'>
          {
            sidebarShow ? <Sidebar albums={albums} logname={logname} toggleSidebar={this.toggleSidebar} selectAlbum={this.selectAlbum} /> : null
          }
          <Gallery pictures={filteredPictures} sidebarShow={sidebarShow} toggleSidebar={this.toggleSidebar} deletePicture={this.deletePicture} selectedAlbumName={selectedAlbumName} />
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