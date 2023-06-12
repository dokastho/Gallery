import React from 'react';
import PropTypes from 'prop-types';
import Picture from './picture';
import BigPicture from './bigPicture';
import AlbumInfoBar from './albumInfoBar';
import BigPictureControls from './bigPictureControls';

class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blownUpThumbnail: -1
    }
  }

  thumbnailBlowUp(picture) {
    this.setState({ blownUpThumbnail: picture });
  }

  closeImage() {
    this.setState({ blownUpThumbnail: -1 })
  }

  picturePaginationLeft() {
    const { blownUpThumbnail } = this.state;
    this.setState({ blownUpThumbnail: blownUpThumbnail - 1 });
  }

  picturePaginationRight() {
    const { blownUpThumbnail } = this.state;
    this.setState({ blownUpThumbnail: blownUpThumbnail + 1 });
  }

  deletePictureAndUpdateState() {
    const { deletePicture } = this.props;
    const { blownUpThumbnail } = this.state;
    deletePicture(blownUpThumbnail);
    this.setState({blownUpThumbnail: -1});
  }

  render() {
    const {
      albumName,
      pictures,
      sidebarShow,
      toggleSidebar,
      selectedAlbum,
    } = this.props;
    const { blownUpThumbnail } = this.state;

    const filteredPictures = pictures.filter(picture => (selectedAlbum === picture.album) || (selectedAlbum === 'All Photos'));

    console.log("gallery state");
    console.log(this.state);
    return (
      <div className='image-gallery'>
        <AlbumInfoBar albumName={albumName} sidebarShow={sidebarShow} toggleSidebar={toggleSidebar} />
        <hr />
        {
          blownUpThumbnail !== -1 ? (
            <div>
              <BigPictureControls blownUpThumbnail={blownUpThumbnail} nPictures={filteredPictures.length} closeImage={this.closeImage.bind(this)} leftButton={this.picturePaginationLeft.bind(this)} rightButton={this.picturePaginationRight.bind(this)} deletePicture={this.deletePictureAndUpdateState.bind(this)} />
              <BigPicture id={filteredPictures[blownUpThumbnail].fileid} name={filteredPictures[blownUpThumbnail].fileid} index={blownUpThumbnail} />
            </div>
          )
            :
            (
              <div className='gallery-grid'>
                {
                  filteredPictures.map((picture, index) => {
                    return <Picture id={picture.fileid} name={picture.fileid} index={index} thumbnailBlowUp={this.thumbnailBlowUp.bind(this)} />
                  })
                }
              </div>
            )
        }
      </div>
    )
  }
}

Gallery.propTypes = {
  albumName: PropTypes.string.isRequired,
  selectedAlbum: PropTypes.string.isRequired,
  pictures: PropTypes.instanceOf(Array),
  sidebarShow: PropTypes.bool.isRequired,
  // toggleSidebar
  // deletePicture
};

export default Gallery
