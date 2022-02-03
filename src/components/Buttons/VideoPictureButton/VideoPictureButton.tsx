import React from 'react';
import AWS from 'aws-sdk';
import produce from 'immer';
import { Button, Menu, MenuItem, styled, Backdrop, CircularProgress } from '@material-ui/core';
import BackgroundIcon from '../../../icons/BackgroundIcon';
import useDevices from '../../../hooks/useDevices/useDevices';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import FirebaseApp from '../../../state/useFirebaseAuth/FirebaseApp';
import { getColl } from '../../../redux/firebaseSlice';

AWS.config.update({
  accessKeyId: 'AKIARHRZ6OGLTYBT5HPV',
  secretAccessKey: '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',
});
const myBucket = new AWS.S3({
  params: { Bucket: 'storage.servicehubcrm.com' },
  region: 'us-east-1',
});

export const IconContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  width: '1.5em',
  marginRight: '0.3em',
});

export default function VideoPictureButton(props: { disabled?: boolean; className?: string }) {
  const dispatch = useAppDispatch();
  const { hasVideoInputDevices } = useDevices();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openBack, setOpen] = React.useState(false);
  const urlParams: any = useAppSelector(state => state.collection.params);
  const collection: any = useAppSelector(state => state.collection.list);
  const items = collection.tokenData.data.items;
  const handleCloseBack = () => {
    setOpen(false);
  };
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  function menuItems() {
    let listmenu = items.map((item: any, i: number) => {
      return <MenuItem key={item.id} value={item.id} onClick={handleClose}>{`Item${i + 1} - ${item.title}`}</MenuItem>;
    });
    return listmenu;
  }

  const handleClose = (event: any) => {
    setAnchorEl(null);
    if (event.target.value) VideoPicture(event.target.value);
  };

  const VideoPicture = (id: number) => {
    setOpen(true);
    let video = document.querySelector('video');
    const o_id = collection.tokenData.data.o_id;
    let canvas = document.createElement('canvas');
    canvas.setAttribute('width', '300');
    canvas.setAttribute('height', '250');
    if (video) {
      canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
      let blobFile = canvas.toBlob(function(blob) {
        if (blob) {
          let file = new File([blob], `${id}_${o_id}_${Math.floor(Math.random() * 1000000000)}_videocallcrm.jpg`, {
            type: 'image/jpeg',
          });

          let params = {
            ACL: 'public-read',
            Body: file,
            Bucket: 'storage.servicehubcrm.com',
            Key: `dev/order/thumb/${file.name}`,
          };

          myBucket
            .putObject(params)
            .promise()
            .then(res => {
              const tokenData: any = produce(collection, (draftState: any) => {
                let index = draftState.tokenData.data.items.findIndex((x: any) => Number(x.id) === id);
                if (draftState.tokenData.data.items[index].images) {
                  draftState.tokenData.data.items[index].images.push(file.name);
                } else {
                  draftState.tokenData.data.items[index].images = [file.name];
                }
                return draftState;
              });
              dispatch(getColl(tokenData));
              FirebaseApp().update(urlParams.data.URLRoomName, { items: tokenData.tokenData.data.items });
              setOpen(false);
            })
            .catch(err => {
              console.log('Upload 1 failed:', err);
            });

          params.Key = `dev/order/${file.name}`;
          myBucket.putObject(params).promise();
        }
      }, 'image/jpeg');
    }
  };

  return (
    <div>
      <Backdrop open={openBack} onClick={handleCloseBack}>
        <CircularProgress />
      </Backdrop>
      <Button
        id="basic-button"
        className={props.className}
        disabled={!hasVideoInputDevices || props.disabled}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <IconContainer>
          <BackgroundIcon />
        </IconContainer>
        {!hasVideoInputDevices ? 'No Video' : 'Item Image'}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {' '}
        {items.length && menuItems()}
      </Menu>
    </div>
  );
}
