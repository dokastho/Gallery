import PropTypes from 'prop-types';
import React from 'react'
import { SmallIcon, SmallTextIcon } from './smallIcon';

class BigPictureControls extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {
      blownUpThumbnail,
      nPictures,
      closeImage,
      leftButton,
      rightButton,
      deletePicture,
    } = this.props;
    return (
      <div className='control-buttons'>
        <SmallIcon src='/static/img/close-tab.png' keyName={'close'} className='control-button' onClick={closeImage} />
        {
          blownUpThumbnail !== 0 ? (
            <SmallIcon src='/static/img/left-arrow.png' keyName={'left'} className='control-button' onClick={leftButton} />
          ) : null
        }
        {
          blownUpThumbnail !== nPictures - 1 ? (
            <SmallIcon src='/static/img/right-arrow.png' keyName={'right'} className='control-button' onClick={rightButton} />
          ) : null
        }
        <SmallTextIcon text="delete" className='control-button-delete' onClick={deletePicture} />
      </div>
    )
  }
}

BigPictureControls.propTypes = {
  blownUpThumbnail: PropTypes.number.isRequired,
  nPictures: PropTypes.number.isRequired,
  // closeImage
  // leftButton
  // rightButton
  // deletePicture
};

export default BigPictureControls
