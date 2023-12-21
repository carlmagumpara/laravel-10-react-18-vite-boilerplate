import { useState, useRef, useEffect } from 'react';
import { Image, Button } from 'react-bootstrap';
import { FaCheck, FaTimes, FaUpload } from 'react-icons/fa';
import { useUpdateAvatarMutation } from 'src/redux/services/profile'; 
import { useUploadMutation } from 'src/redux/services/files';
import { useDispatch } from 'react-redux';
import { storeUser } from 'src/redux/reducers/user';
import { updateState } from 'src/redux/updateState';
import { useAuth } from 'src/hooks/useAuth';
import moment from 'moment';
import { useAntMessage } from 'src/context/ant-message';
import { TailSpin } from  'react-loader-spinner';
import Loader from 'src/shared/loader';
import './Avatar.scss';

function Avatar() {
  const auth = useAuth();
  const dispatch = useDispatch();
  const [updateAvatar] = useUpdateAvatarMutation();
  const [fileUploader] = useUploadMutation();
  const antMessage = useAntMessage();
  const [image, setImage] = useState(null);
  const [has_upload, setHasUpload] = useState(null);
  const [loading, setLoading] = useState(false);
  const input = useRef(null);

  useEffect(() => {
    if (!has_upload) {
      setImage(null);
    }
  }, [has_upload]);

  const update = async () => {
    try {
      setLoading(true);
      const response = await updateAvatar({ photo: image }).unwrap();
      if (response.success) {
        await dispatch(updateState(storeUser(response.user)));
        setImage(null);
        setHasUpload(null);
        dropdownAlert.current.alertWithType('success', response.message);
      } else {
        dropdownAlert.current.alertWithType('error', '');
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const onChange = async event => {
    if (event?.target?.files?.[0]) {
      try {
        const data = new FormData();
        data.append('file', event?.target?.files?.[0]);
        const response = await fileUploader(data).unwrap();
        setImage(response.data);
        setHasUpload(true);
      } catch(error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center position-relative">
        <div id="profile-container" className="mb-3 position-relative" onClick={() => input.current.click()}>
          <Image id="profileImage" src={has_upload ? image : auth.getAvatar} className="bg-white border" style={{ objectFit: 'cover' }} alt="" />
        </div>
        <input
          ref={input}
          type="file" 
          id="imageUpload" 
          onChange={onChange}
        />
        {loading ? (
          <div className="position-absolute" style={{ bottom: 30 }}>
            <TailSpin
              height="50"
              width="50"
              color="#4fa94d"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        ) : (
          <>
            {has_upload && (
              <div className="position-absolute" style={{ bottom: 30 }}>
                <Button 
                  variant="danger" 
                  size="sm" 
                  className="m-1" 
                  onClick={() => setHasUpload(false)}
                  disabled={loading}
                >
                  <FaTimes />
                </Button>
                <Button 
                  variant="success" 
                  className="m-1" 
                  size="sm" 
                  onClick={update}
                  disabled={loading}
                >
                  <FaCheck />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <Button
          size="sm"
          variant="link"
          onClick={() => input.current.click()}
          disabled={loading}
        >
          <FaUpload /> Upload Avatar
        </Button>
      </div>
    </>
  )
}

export default Avatar;