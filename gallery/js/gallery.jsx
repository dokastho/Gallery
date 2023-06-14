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
      blownUpThumbnail: -1,
      filteredPictures: []
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

  deleteAlbumAndUpdateState(args) {
    const { id } = args;
    const { deleteAlbum } = this.props;
    deleteAlbum(id);
    this.setState({blownUpThumbnail: -1});
  }

  render() {
    const {
      logname,
      sidebarShow,
      toggleSidebar,
      selectedAlbumName,
      selectedAlbumId,
      pictures,
      usernames
    } = this.props;
    const { blownUpThumbnail } = this.state;

    console.log("gallery state");
    console.log(this.state);
    return (
      <div className='image-gallery'>
        <AlbumInfoBar logname={logname} albumName={selectedAlbumName} albumid={selectedAlbumId} sidebarShow={sidebarShow} toggleSidebar={toggleSidebar} deleteAlbum={this.deleteAlbumAndUpdateState.bind(this)} usernames={usernames} />
        <hr />
        {
          blownUpThumbnail !== -1 ? (
            <div>
              <BigPictureControls blownUpThumbnail={blownUpThumbnail} nPictures={pictures.length} closeImage={this.closeImage.bind(this)} leftButton={this.picturePaginationLeft.bind(this)} rightButton={this.picturePaginationRight.bind(this)} deletePicture={this.deletePictureAndUpdateState.bind(this)} />
              <BigPicture id={pictures[blownUpThumbnail].fileid} name={pictures[blownUpThumbnail].fileid} index={blownUpThumbnail} />
            </div>
          )
            :
            (
              <div className='gallery-grid'>
                {
                  pictures.map((picture, index) => {
                    return <Picture id={picture.fileid} keyNum={picture.id} name={picture.fileid} index={index} thumbnailBlowUp={this.thumbnailBlowUp.bind(this)} />
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
  logname: PropTypes.string.isRequired,
  selectedAlbumName: PropTypes.string.isRequired,
  selectedAlbumId: PropTypes.number.isRequired,
  pictures: PropTypes.instanceOf(Array),
  usernames: PropTypes.instanceOf(Array),
  sidebarShow: PropTypes.bool.isRequired,
  // toggleSidebar
  // deletePicture
  // deleteAlbum
};

export default Gallery
