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
      selectedAlbumName: "All Photos",
      selectedAlbumId: -1,
    }
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.selectAlbum = this.selectAlbum.bind(this);
    this.deletePicture = this.deletePicture.bind(this);
    this.deleteAlbum = this.deleteAlbum.bind(this);
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
    this.setState({ selectedAlbumName: name, selectedAlbumId: id, filteredPictures: filteredPictures });
  }

  toggleSidebar() {
    const { sidebarShow } = this.state;
    this.setState({ sidebarShow: !sidebarShow });
  }

  deletePicture(index) {
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

    this.setState({
      pictures: updatedPictures,
      filteredPictures: updatedFilteredPictures,
    });
  }

  deleteAlbum(id) {
    const { albums } = this.state;
    const index = albums.map(e => e.id).indexOf(id);
    const album = albums[index];
    fetch(`/api/v1/album/delete/${album.id}/`, { credentials: 'same-origin', method: 'POST' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .catch((error) => console.log(error));
    const updatedAlbums = albums.filter((item) => {
      return item !== album;
    });

    // restore original view
    const { pictures } = this.state;
    const updatedPictures = pictures.filter((item) => {
      return parseInt(item.albumid) !== id;
    });
    this.setState({
      albums: updatedAlbums,
      selectedAlbumName: "All Photos",
      selectedAlbumId: -1,
      pictures: updatedPictures,
      filteredPictures: updatedPictures,
    });
  }

  render() {
    const {
      sidebarShow,
      logname,
      filteredPictures,
      albums,
      selectedAlbumName,
      selectedAlbumId,
    } = this.state;
    return (
      <div className='body-tray'>
        <Topbar logname={logname} />
        <div className='body-content'>
          {
            sidebarShow ? <Sidebar albums={albums} logname={logname} toggleSidebar={this.toggleSidebar} selectAlbum={this.selectAlbum} /> : null
          }
          <Gallery pictures={filteredPictures} logname={logname} sidebarShow={sidebarShow} toggleSidebar={this.toggleSidebar} deletePicture={this.deletePicture} deleteAlbum={this.deleteAlbum} selectedAlbumName={selectedAlbumName} selectedAlbumId={selectedAlbumId} />
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