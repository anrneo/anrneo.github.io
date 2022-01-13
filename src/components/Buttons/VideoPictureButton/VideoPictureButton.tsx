import React from 'react';
import AWS from 'aws-sdk';
import { Button, Menu, MenuItem, styled, Backdrop, CircularProgress } from '@material-ui/core';
import BackgroundIcon from '../../../icons/BackgroundIcon';
import useDevices from '../../../hooks/useDevices/useDevices';
import { useParams } from 'react-router-dom';
import FirebaseApp from '../../../state/useFirebaseAuth/FirebaseApp';

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

export default function VideoPictureButton(props: {
  disabled?: boolean;
  className?: string;
  items?: any;
  order?: any;
}) {
  const { URLRoomName } = useParams();
  const { hasVideoInputDevices } = useDevices();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openBack, setOpen] = React.useState(false);

  const handleCloseBack = () => {
    setOpen(false);
  };
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  function menuItems(items: any) {
    let listmenu = props.items.map((item: any, i: number) => {
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

    let canvas = document.createElement('canvas');
    canvas.setAttribute('width', '300');
    canvas.setAttribute('height', '250');
    if (video) {
      canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
      let blob = canvas.toBlob(function(blob) {
        if (blob) {
          let file = new File(
            [blob],
            `${id}_${props.order}_${Math.floor(Math.random() * 1000000000)}_videocallcrm.jpg`,
            { type: 'image/jpeg' }
          );

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
              let index = props.items.findIndex((x: any) => x.id == id);
              if (props.items[index].images) {
                props.items[index].images.push(file.name);
              } else {
                props.items[index].images = [file.name];
              }
              FirebaseApp().update(URLRoomName, { items: props.items });
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
        {props.items.length && menuItems(props.items)}
      </Menu>
    </div>
  );
}
