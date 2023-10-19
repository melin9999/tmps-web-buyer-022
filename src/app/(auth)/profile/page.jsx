'use client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import CropEasy from '@/components/crop/CropEasy';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Avatar, CircularProgress, InputAdornment, MenuItem, Dialog, IconButton, TextField, Button, FormControlLabel, Checkbox } from "@mui/material";
import { Folder, CropRotate, Save, Delete, Key, CameraAlt, MailOutline, Phone, Close, EditOutlined } from '@mui/icons-material';
import useWindowDimensions from '@/hooks/useWindowDimension';
import Navbar from '@/components/headers/Navbar';

const Profile = () => {
  const router = useRouter();
  const {data: session, status, update: sessionUpdate} = useSession();
  const [serverError, setServerError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { width, height=500 } = useWindowDimensions();

  const [isViewOnly, setIsViewOnly] = useState(true);
  const [isPasswordShowing, setIsPasswordShowing] = useState(false);
  const [editId, setEditId] = useState(-1);
  const [editFirstName, setEditFirstName] = useState("");
  const [editFirstNameError, setEditFirstNameError] = useState(false);
  const [editLastName, setEditLastName] = useState("");
  const [editLastNameError, setEditLastNameError] = useState(false);
  const [editPhone, setEditPhone] = useState("");
  const [editPhoneError, setEditPhoneError] = useState(false);
  const [editDuplicatePhoneError, setEditDuplicatePhoneError] = useState(false);
  const [editEmail, setEditEmail] = useState("");
  const [editEmailError, setEditEmailError] = useState(false);
  const [editDuplicateEmailError, setEditDuplicateEmailError] = useState(false);
  const [editAddress, setEditAddress] = useState("");
  const [editAddressError, setEditAddressError] = useState(false);
  const [editDeliveryAddress, setEditDeliveryAddress] = useState("");
  const [editDeliveryAddressError, setEditDeliveryAddressError] = useState(false);
  const [editSameAddress, setEditSameAddress] = useState(false);
  const [editNotifyBy, setEditNotifyBy] = useState("email");
  const [editNotifyByError, setEditNotifyByError] = useState(false);

  const [editPassword, setEditPassword] = useState("");
  const [editPasswordError, setEditPasswordError] = useState(false);
  const [editConfirm, setEditConfirm] = useState("");
  const [editConfirmError, setEditConfirmError] = useState(false);

  const imageRef = useRef();
  const [openCrop, setOpenCrop] = useState(false);
  const [photoURL, setPhotoURL] = useState("none");
  const [file, setFile] = useState(null);

  useEffect(() => {
    if(status==='unauthenticated'){
      router.push("/signin");
    }
    else if(status==='authenticated'){
      getUser(session.user.id);
    }
  }, [status]);

  useEffect(() => {
    if(editSameAddress){
      setEditDeliveryAddress(editAddress);
    }
  }, [editSameAddress, editAddress]);

  useEffect(() => {
    setIsLoading(false);
    setIsSaving(false);
  }, []);

  const getUser = async (id) => {
    try{
      setIsLoading(true);
      const response = await axios.post("/api/profile/find", {
        id: id
      });
      setEditId(response.data.data.id);
      setEditFirstName(response.data.data.first_name);
      setEditLastName(response.data.data.last_name);
      setEditEmail(response.data.data.email);
      setEditPhone(response.data.data.phone);
      setEditNotifyBy(response.data.data.notify_by);
      setEditAddress(response.data.data.address);
      setEditDeliveryAddress(response.data.data.delivery_address);
      if(response.data.data.image_url==="none"){
        if(session.user.image!==""){
          setPhotoURL(session.user.image);
        }
        else{
          setPhotoURL("none");
        }
      }
      else{
        setPhotoURL("http://tm-web.effisoftsolutions.com/"+response.data.data.image_url);
      }
    }
    catch(error){
      toast.error("Find User Failed !", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    finally{
      setIsLoading(false);
    }
  }

  const clearErrors = () => {
    setEditFirstNameError(false);
    setEditLastNameError(false);
    setEditPhoneError(false);
    setEditEmailError(false);
    setEditPasswordError(false);
    setEditConfirmError(false);
    setEditDuplicateEmailError(false);
    setEditDuplicatePhoneError(false);
    setEditNotifyByError(false);
    setEditAddressError(false);
    setEditDeliveryAddressError(false);
    
    setServerError(false);
  }

  const clearFields = () => {
    setEditId(-1);
    setEditFirstName("");
    setEditLastName("");
    setEditPhone("");
    setEditEmail("");
    setEditPassword("");
    setEditConfirm("");
    setEditNotifyBy("email");
    setEditAddress("");
    setEditDeliveryAddress("");
    setOpenCrop(false);
    setPhotoURL("none");
    setFile(null);
  }

  const saveClicked = async () => {
    clearErrors();
    setIsSaving(true);
    var error = false;
    if(editFirstName.length===0 || editFirstName.length>32) {
      error = true;
      setEditFirstNameError(true);
    }
    if(editLastName.length===0 || editLastName.length>128) {
      error = true;
      setEditLastNameError(true);
    }
    if(editAddress.length>256) {
      error = true;
      setEditAddressError(true);
    }
    if(editDeliveryAddress.length>256) {
      error = true;
      setEditDeliveryAddressError(true);
    }
    if(error) {
      setIsSaving(false);
    }
    else{
      try{
        const response = await axios.post("/api/profile/edit", {
          id: editId,
          firstName: editFirstName,
          lastName: editLastName,
          address: editAddress,
          deliveryAddress: editDeliveryAddress,
        });
        if(response.data.status==="ok"){
          saveImage();
          if(session && session.user){
            sessionUpdate({status: 'active'});
          }
        }
        else{
          toast.error("Edit Profile Failed !", {
            position: toast.POSITION.TOP_RIGHT
          });
        }
      }
      catch(error){
        toast.error("Find User Failed !", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
      finally{
        setIsSaving(false);
      }
    }
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if(file){
      setFile(file);
      setPhotoURL(URL.createObjectURL(file));
      setOpenCrop(true);
    }    
  }

  const saveImage = async () => {
    if(file && editId>0){
      setIsSaving(true);
      const formData = new FormData();
      formData.append("id", ""+editId);
      formData.append('imageUrl', file);
      axios({
        method: "post",
        url: "http://tm-web.effisoftsolutions.com/online-users/edit-image-web",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(function (response) {
        if (response.data.error) {
          setServerError(true);
          toast.error("Image Upload Failed !", {
            position: toast.POSITION.TOP_RIGHT
          });
          setIsSaving(false);
        } 
        else {
          if(session && session.user){
            sessionUpdate({status: 'active'});
          }
          setIsSaving(false);
        }
      })
      .catch(function (error) {
        setIsSaving(false);
      });
    }
    setIsViewOnly(true);
  }

  const handleImageRemove = (event) => {
    setPhotoURL("none");
    setFile(null);
    deleteImage();
  }

  const deleteImage = async () => {
    if(editId>0){
      setIsSaving(true);
      try{
        const response = await axios.post("/api/profile/delete-image", {
          id: editId,
        });
        if(session && session.user){
          sessionUpdate({status: 'active'});
        }
      }
      catch(error){
        toast.error("Profile Image Delete Failed !", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
      finally{
        setIsSaving(false);
      }
    }
    else{
      clearFields();
      router.push(goTo);
    }
  }

  const savePasswordClicked = async () => {
    clearErrors();
    setIsSaving(true);
    var error = false;
    if(editPassword.length===0 || editPassword.length>12) {
      error = true;
      setEditPasswordError(true);
    }
    if(editConfirm.length===0 || editConfirm.length>12) {
      error = true;
      setEditConfirmError(true);
    }
    if(editPassword!==editConfirm){
      error = true;
      setEditConfirmError(true);
    }
    if(error) {
      setIsSaving(false);
    }
    else{
      try{
        const response = await axios.post("/api/profile/reset-password", {
          id: editId,
          password: editPassword,
        });
        setEditPassword("");
        setEditConfirm("");
        setIsPasswordShowing(false);
        toast.success("Password Change Successfull !", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
      catch(error){
        toast.error("Password Change Failed !", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
      finally{
        setIsSaving(false);
      }
    }
  }

  return (
    <>
      <Navbar search={false} applyFilters={null}/>
      <div className='form_container mt-[50px]' style={{minHeight: (height-80)}}>
        <div className='form_container_medium'>
          <span className="form_header">Profile</span>
          <div className='form_fields_container'>
            <div className='form_profile_image'>
              <div className='form_profile_image_container'>
                {photoURL==="none"?<CameraAlt sx={{width: 130, height: 130, color: '#fff'}}/>:<Avatar src={photoURL} sx={{width: 140, height: 140, cursor: 'pointer'}}/>}
                <input type='file' ref={imageRef} onChange={handleImageChange} className='file_input'/>
              </div>
              {!isViewOnly && 
                <div className='form_profile_image_controls'>
                  <IconButton disabled={isSaving||isLoading} onClick={()=>imageRef.current.click()}><Folder sx={{width: 20, height: 20, color: '#7c3aed'}}/></IconButton>
                  <IconButton disabled={isSaving||isLoading} onClick={()=>setOpenCrop(true)}><CropRotate sx={{width: 20, height: 20, color: '#7c3aed'}}/></IconButton>
                  <IconButton disabled={isSaving||isLoading} onClick={(event)=>handleImageRemove(event)}><Delete sx={{width: 20, height: 20, color: '#7c3aed'}}/></IconButton>
                </div>
              }
            </div>
            <div className='form_row_double'>
              <div className='form_field_container'>
                <TextField 
                  id='first-name'
                  label="First Name" 
                  variant="outlined" 
                  className='form_text_field' 
                  value={editFirstName} 
                  error={editFirstNameError}
                  onChange={event=>setEditFirstName(event.target.value)}
                  disabled={isSaving||isLoading || isViewOnly}
                  onFocus={()=>setEditFirstNameError(false)}
                  size='small' 
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editFirstNameError && <span className='form_error_floating'>Invalid First Name</span>}
              </div>
              <div className='form_field_container'>
                <TextField 
                  id='last-name'
                  label="Last Name" 
                  variant="outlined" 
                  className='form_text_field' 
                  value={editLastName} 
                  error={editLastNameError}
                  onChange={event=>setEditLastName(event.target.value)}
                  disabled={isSaving||isLoading || isViewOnly}
                  onFocus={()=>setEditLastNameError(false)}
                  size='small' 
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editLastNameError && <span className='form_error_floating'>Invalid Last Name</span>}
              </div>
            </div>
            <div className='form_row_double'>
              <div className='form_field_container'>
                <TextField 
                  id='email'
                  label="Email" 
                  variant="outlined" 
                  className='form_text_field' 
                  value={editEmail} 
                  error={editEmailError||editDuplicateEmailError}
                  onChange={event=>setEditEmail(event.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><MailOutline sx={{width: 26, height: 26, color: editEmailError||editDuplicateEmailError?'crimson':'#94a3b8'}}/></InputAdornment>,
                  }}
                  disabled={true}
                  onFocus={()=>{setEditEmailError(false);setEditDuplicateEmailError(false)}}
                  size='small' 
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editEmailError && <span className='form_error_floating'>Invalid Email</span>}
                {editDuplicateEmailError && <span className='form_error_floating'>Email Already Exists !</span>}
              </div>
              <div className='form_field_container'>
                <TextField 
                  id='phone'
                  label="Phone" 
                  variant="outlined" 
                  className='form_text_field' 
                  value={editPhone} 
                  error={editPhoneError}
                  onChange={event=>setEditPhone(event.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Phone sx={{width: 26, height: 26, color: editPhoneError?'crimson':'#94a3b8'}}/></InputAdornment>,
                  }}
                  disabled={true}
                  onFocus={()=>{setEditPhoneError(false);setEditDuplicatePhoneError(false)}}
                  size='small' 
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editPhoneError && <span className='form_error_floating'>Invalid Phone</span>}
                {editDuplicatePhoneError && <span className='form_error_floating'>Phone Already Exists !</span>}
              </div>
            </div>
            <div className='form_row_double_top'>
              <div className='form_field_container_vertical'>
                <TextField 
                  id='address'
                  label="Address" 
                  variant="outlined" 
                  className='form_text_field' 
                  value={editAddress} 
                  error={editAddressError}
                  onChange={event=>setEditAddress(event.target.value)}
                  disabled={isSaving||isLoading || isViewOnly}
                  multiline={true}
                  rows={4}
                  onFocus={()=>setEditAddressError(false)}
                  size='small' 
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editAddressError && <span className='form_error_floating'>Invalid Address</span>}
              </div>
              <div className='form_field_container_vertical'>
                <TextField 
                  id='delivery-address'
                  label="Delivery Address" 
                  variant="outlined" 
                  className='form_text_field' 
                  value={editDeliveryAddress} 
                  error={editDeliveryAddressError}
                  onChange={event=>setEditDeliveryAddress(event.target.value)}
                  disabled={isSaving||isLoading || isViewOnly}
                  multiline={true}
                  rows={4}
                  onFocus={()=>setEditDeliveryAddressError(false)}
                  size='small' 
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {!isViewOnly && <FormControlLabel 
                  control={
                    <Checkbox 
                      id='same-address'
                      checked={editSameAddress} 
                      onChange={event=>setEditSameAddress(event.target.checked)}
                      disabled={isLoading||isSaving}
                    />
                  } 
                  label="Same Address"
                />}
                {editDeliveryAddressError && <span className='form_error_floating'>Invalid Delivery Address</span>}
              </div>
            </div>
            <div className='form_row_double'>
              <div className='form_field_container'>
                <TextField className='form_text_field'
                  id='notify-by'
                  value={editNotifyBy}
                  error={editNotifyByError}
                  label="Notify By"
                  onChange={event=>setEditNotifyBy(event.target.value)}                
                  variant={"outlined"}
                  select={true}
                  disabled={isSaving||isLoading || isViewOnly}
                  onFocus={()=>setEditNotifyByError(false)}
                  size='small' 
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                >
                  <MenuItem value={"email"}>Email</MenuItem>
                  <MenuItem value={"sms"}>SMS</MenuItem>
                </TextField>
                {editNotifyByError && <span className='form_error_floating'>Invalid Notify By</span>}
              </div>
              <div className='form_field_container gap-2'>
                {isViewOnly ? 
                  <Button 
                    variant='contained' 
                    disabled={isSaving||isLoading} 
                    style={{textTransform: 'none', color: '#fff'}} 
                    startIcon={isSaving||isLoading?<CircularProgress size={18} style={{'color': '#fff'}}/>:<EditOutlined style={{color: '#fff'}}/>}
                    onClick={()=>setIsViewOnly(false)}
                    size='small'
                  >Edit</Button>
                :
                  <>
                    <Button 
                      variant='outlined' 
                      disabled={isSaving||isLoading} 
                      style={{textTransform: 'none'}} 
                      startIcon={isSaving||isLoading?<CircularProgress size={18} style={{'color': '#9ca3af'}}/>:<Close style={{color: '#77bd1f'}}/>}
                      onClick={()=>setIsViewOnly(true)}
                      size='small'
                    >Cancel</Button>
                    <Button 
                      variant='contained' 
                      disabled={isSaving||isLoading} 
                      style={{textTransform: 'none', color: '#fff'}} 
                      startIcon={isSaving||isLoading?<CircularProgress size={18} style={{'color': '#fff'}}/>:<Save style={{color: '#fff'}}/>}
                      onClick={()=>saveClicked()}
                      size='small'
                    >Save</Button>
                  </>
                }
              </div>
            </div>
          </div>
          <span className="form_header">Security</span>
          <div className='form_fields_container'>
            {isPasswordShowing && 
              <div className='form_row_double'>
                <div className='form_field_container'>
                  <TextField 
                    id='password'
                    type={"password"} 
                    label="Password" 
                    variant="outlined" 
                    className='form_text_field' 
                    value={editPassword}
                    error={editPasswordError}
                    onChange={event=>setEditPassword(event.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Key sx={{width: 26, height: 26, color: editPasswordError?'crimson':'#94a3b8'}}/></InputAdornment>
                    }}
                    disabled={isSaving||isLoading}
                    onFocus={()=>setEditPasswordError(false)}
                    size='small' 
                    inputProps={{style: {fontSize: 13}}}
                    SelectProps={{style: {fontSize: 13}}}
                    InputLabelProps={{style: {fontSize: 15}}}
                  />
                  {editPasswordError && <span className='form_error_floating'>Invalid Password</span>}
                </div>
                <div className='form_field_container'>
                  <TextField 
                    id='confirm'
                    type={"password"} 
                    label="Confirm Password" 
                    variant="outlined" 
                    className='form_text_field' 
                    value={editConfirm}
                    error={editConfirmError}
                    onChange={event=>setEditConfirm(event.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Key sx={{width: 26, height: 26, color: editConfirmError?'crimson':'#94a3b8'}}/></InputAdornment>,
                    }}
                    disabled={isSaving||isLoading}
                    onFocus={()=>setEditConfirmError(false)}
                    size='small' 
                    inputProps={{style: {fontSize: 13}}}
                    SelectProps={{style: {fontSize: 13}}}
                    InputLabelProps={{style: {fontSize: 15}}}
                  />
                  {editConfirmError && <span className='form_error_floating'>Invalid Confirmation</span>}
                </div>
              </div>
            }
            <div className='form_row_double'>
              <span></span>
              <div className='form_field_container gap-2'>
                {isPasswordShowing ?
                  <>
                    <Button 
                      variant='outlined' 
                      disabled={isSaving||isLoading} 
                      style={{textTransform: 'none'}} 
                      startIcon={isSaving||isLoading?<CircularProgress size={18} style={{'color': '#9ca3af'}}/>:<Close style={{color: '#77bd1f'}}/>}
                      onClick={()=>setIsPasswordShowing(false)}
                      size='small'
                    >Cancel</Button>
                    <Button 
                      variant='contained' 
                      disabled={isSaving||isLoading} 
                      style={{textTransform: 'none', color: '#fff'}} 
                      startIcon={isSaving||isLoading?<CircularProgress size={18} style={{'color': '#fff'}}/>:<Save style={{color: '#fff'}}/>}
                      onClick={()=>savePasswordClicked()}
                      size='small'
                    >Save</Button>
                  </>
                :
                  <Button 
                    variant='contained' 
                    disabled={isSaving||isLoading} 
                    style={{textTransform: 'none', color: '#fff'}} 
                    startIcon={isSaving||isLoading?<CircularProgress size={18} style={{'color': '#fff'}}/>:<Key style={{color: '#fff'}}/>}
                    onClick={()=>setIsPasswordShowing(true)}
                    size='small'
                  >Change Password</Button>
                }
              </div>
            </div>
          </div>
        </div>
        <Dialog open={openCrop} onClose={()=>setOpenCrop(false)}>
          <CropEasy {...{setOpenCrop, photoURL, setPhotoURL, setFile}}/>
        </Dialog>
        <ToastContainer />
      </div>
    </>
  )
}

export default Profile;