import React from 'react';
import { render } from 'react-dom';
import Topbar from './topbar';

class UploadPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      albums: [],
      logname: '',
      newAlbumName: '',
      isNewAlbum: false,
    }
    this.albumNameUpdate = this.albumNameUpdate.bind(this);
    this.createNewAlbum = this.createNewAlbum.bind(this);
    this.cancelNewAlbum = this.cancelNewAlbum.bind(this);
  }

  albumNameUpdate(s) {
    this.setState({ newAlbumName: s });
  }

  createNewAlbum() {
    this.setState({ isNewAlbum: true });
  }

  cancelNewAlbum() {
    this.setState({ isNewAlbum: false });
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
          albums: data.albums,
        });
      })
      .catch((error) => console.log(error));
  }

  render() {
    const {
      logname,
      albums,
      newAlbumName,
      isNewAlbum
    } = this.state;
    return (
      <>
        <Topbar logname={logname} /><div className='account-background'>
          <div className='account-view'>
            <h1>Upload Pictures</h1>
            <form action="/api/v1/pictures/upload/" encType='multipart/form-data' method="post">
              <h2>Attach Pictures</h2>
              <br />
              {/* for now 10 MB */}
              <input type="file" id="file" name="file" required multiple max={10000000}/>
              <br />
              <br />
              <label htmlFor="albums">select an album to upload to:</label><br />
              {
                albums.map((album) => {
                  return (
                    <><input type='radio' id={`label-${album.name}`} name='album-choice' value={album.id} required /><label htmlFor={`label-${album.name}`}>{album.name}</label><br /></>
                  )
                })
              }
              <br />
              {
                isNewAlbum ?
                  (
                    <><input type='radio' aria-selected id='label-new-album' name='album-choice' value={0} /><input type='text' name='new-album-name' value={newAlbumName} onChange={(e) => { this.albumNameUpdate(e.target.value); }} required /><input type='button' value='cancel' onClick={() => { this.cancelNewAlbum(); }} /></>
                  ) : (
                    <><label htmlFor='label-new-album'>or </label><button onClick={() => { this.createNewAlbum(); } }>create a new album</button></>
                  )
              }
              <br />
              <br />
              <input type="submit" />
            </form>
          </div>
        </div>
      </>
    )
  }
}

render(
  <UploadPage />,
  document.getElementById('reactEntry'),
);
