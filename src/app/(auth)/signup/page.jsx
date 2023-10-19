'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { InputAdornment, Stepper, StepLabel, MenuItem, CircularProgress, Dialog, Avatar, Step, TextField, FormControlLabel, Checkbox, Button, IconButton } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { emailReg } from '@/utils/Validate';
import CropEasy from '@/components/crop/CropEasy';
import { ArrowForward, CameraAlt, CropRotate, Delete, Folder, Key, Login, MailOutline, Phone, Refresh, Save } from '@mui/icons-material';
import useWindowDimensions from '@/hooks/useWindowDimension';

const Signup = () => {
  const router = useRouter();
  const {data: session, status, update: sessionUpdate} = useSession();
  const [serverError, setServerError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { width, height=500 } = useWindowDimensions();

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
  const [editUserAgreement, setEditUserAgreement] = useState(false);
  const [editUserAgreementError, setEditUserAgreementError] = useState(false);
  const [editNotifyBy, setEditNotifyBy] = useState("email");
  const [editNotifyByError, setEditNotifyByError] = useState(false);
  const [editNotifyByHeader, setEditNotifyByHeader] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editCodeError, setEditCodeError] = useState(false);
  const [editAddress, setEditAddress] = useState("");
  const [editAddressError, setEditAddressError] = useState(false);
  const [editDeliveryAddress, setEditDeliveryAddress] = useState("");
  const [editDeliveryAddressError, setEditDeliveryAddressError] = useState(false);
  const [editSameAddress, setEditSameAddress] = useState(false);

  const [editPassword, setEditPassword] = useState("");
  const [editPasswordError, setEditPasswordError] = useState(false);
  const [editConfirm, setEditConfirm] = useState("");
  const [editConfirmError, setEditConfirmError] = useState(false);

  const imageRef = useRef();
  const [openCrop, setOpenCrop] = useState(false);
  const [editImage, setEditImage] = useState("none");
  const [file, setFile] = useState(null);

  const [activeStep, setActiveStep] = useState(0);
  const [step0Completed, setStep0Completed] = useState(false);
  const [step1Completed, setStep1Completed] = useState(false);
  const [step2Completed, setStep2Completed] = useState(false);

  const [editPhoneMasked, setEditPhoneMasked] = useState("");
  const [editEmailMasked, setEditEmailMasked] = useState("");
  const [goTo, setGoTo] = useState("signin");

  useEffect(() => {
    setIsSaving(false);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsSaving(false);
    if(session && session.user && status!=="loading"){
      if(session.user.status==="activation_pending"){
        getUser(session.user.email, session.user.status);
      }
      else if(session.user.status==="incomplete"){
        getUser(session.user.email, session.user.status);
      }
      else if(session.user.status==="reset_pending"){
        router.push("/reset");
      }
      else{
        router.push("/");
      }
    }
  }, [status]);

  const getUser = async (email, status) => {
    setIsLoading(true);
    try{
      const response = await axios.post("/api/auth/find-by-email", {
        email: email
      });
      if(status==="activation_pending"){
        setEditId(response.data.data.id);
        setEditFirstName(response.data.data.first_name);
        setEditLastName(response.data.data.last_name);
        setEditEmail(response.data.data.email);
        setEditPhone(response.data.data.phone);
        setEditNotifyBy(response.data.data.notify_by);
        setGoTo("/signin");
        setStep0Completed(true);
        setActiveStep(1);
      }
      if(status==="incomplete"){
        setEditId(response.data.data.id);
        setEditFirstName(response.data.data.first_name);
        setEditLastName(response.data.data.last_name);
        setEditEmail(response.data.data.email);
        setEditPhone(response.data.data.phone);
        setEditNotifyBy(response.data.data.notify_by);
        setGoTo("/signin");
        setStep0Completed(true);
        setStep1Completed(true);
        setActiveStep(2);
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

  useEffect(() => {
    setEditPhoneMasked(editPhone);
  }, [editPhone]);

  useEffect(() => {
    setEditEmailMasked(editEmail);
  }, [editEmail]);

  useEffect(() => {
    if(editNotifyBy==="email"){
      setEditNotifyByHeader("Check your email for the code");
    }
    else if(editNotifyBy==="sms"){
      setEditNotifyByHeader("Check your phone for the code");
    }
  }, [editNotifyBy]);

  useEffect(() => {
    if(editSameAddress){
      setEditDeliveryAddress(editAddress);
    }
  }, [editSameAddress, editAddress]);

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
    setEditUserAgreementError(false);
    setEditCodeError(false);
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
    setEditUserAgreement(false);
    setEditCode("");
    setEditAddress("");
    setEditDeliveryAddress("");
    setOpenCrop(false);
    setEditImage("none");
    setFile(null);
  }

  const signUpClicked = async () => {
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
    if(editEmail.length>128 || !emailReg.test(editEmail)) {
      error = true;
      setEditEmailError(true);
    }
    if(editPhone.length===0 || editPhone.length>32) {
      error = true;
      setEditPhoneError(true);
    }
    if(editEmail.length>128 || !emailReg.test(editEmail)) {
      error = true;
      setEditEmailError(true);
    }
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
    if(!editUserAgreement){
      error = true;
      setEditUserAgreementError(true);
    }
    if(editNotifyBy==="0"){
      error = true;
      setEditNotifyByError(true);
    }
    if(error) {
      setIsSaving(false);
    }
    else{
      try{
        const response = await axios.post("/api/auth/create", {
          userType: "buyer",
          firstName: editFirstName,
          lastName: editLastName,
          phone: editPhone,
          email: editEmail,
          password: editPassword,
          notifyBy: editNotifyBy
        });
        if(response.data.status==="duplicate_email"){
          setEditDuplicateEmailError(true);
        }
        else if(response.data.status==="duplicate_phone"){
          setEditDuplicatePhoneError(true);
        }
        else{
          if(response.data.status==="email_error"){
            toast.error("Failed To Send Email !", {
              position: toast.POSITION.TOP_RIGHT
            });
          }
          if(response.data.status==="sms_error"){
            toast.error("Failed To Send SMS !", {
              position: toast.POSITION.TOP_RIGHT
            });
          }
          setEditId(response.data.data.id);
          setStep0Completed(true);
          setActiveStep(1);
        }
      }
      catch(error){
        toast.error("Create New User Failed !", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
      finally{
        setIsSaving(false);
      }
    }
  }

  const activateClicked = async () => {
    clearErrors();
    setIsSaving(true);
    var error = false;
    if (editCode.length===0 || editCode.length>4) {
      error = true;
      setEditCodeError(true);
    }
    if(error) {
      setIsSaving(false);
    }
    else{
      try{
        const response = await axios.post("/api/auth/activate", {
          id: editId,
          activationCode: editCode
        });
        if(response.data.status==="ok"){
          setStep1Completed(true);
          setActiveStep(2);
          if(session && session.user){
            sessionUpdate({status: 'incomplete'});
          }
        }
        else{
          setEditCodeError(true);
          toast.error("Activation Failed !", {
            position: toast.POSITION.TOP_RIGHT
          });
        }
      }
      catch(error){
        toast.error("Activation Failed !", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
      finally{
        setIsSaving(false);
      }
    }
  }

  const resendClicked = async () => {
    clearErrors();
    setIsSaving(true);
    var error = false;
    if(editNotifyBy==="0"){
      error = true;
      setEditNotifyByError(true);
    }
    if(error) {
      setIsSaving(false);
    }
    else{
      try{
        const response = await axios.post("/api/auth/resend-code", {
          id: editId,
          notifyBy: editNotifyBy
        });
        if(response.data.status==="email_error"){
          toast.error("Failed To Send Email !", {
            position: toast.POSITION.TOP_RIGHT
          });
        }
        if(response.data.status==="sms_error"){
          toast.error("Failed To Send SMS !", {
            position: toast.POSITION.TOP_RIGHT
          });
        }
        else if(response.data.status==="ok"){
          toast.success("Code Sent !", {
            position: toast.POSITION.TOP_RIGHT
          });
        }
        else{
          toast.error("Resend Code Failed !", {
            position: toast.POSITION.TOP_RIGHT
          });
        }
      }
      catch(error){
        toast.error("Resend Code Failed !", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
      finally{
        setIsSaving(false);
      }
    }
  }

  const saveDetailsClicked = async () => {
    clearErrors();
    setIsSaving(true);
    var error = false;
    if(editDeliveryAddress.length>256) {
      error = true;
      setEditDeliveryAddressError(true);
    }
    if(editAddress.length>256) {
      error = true;
      setEditAddressError(true);
    }
    if(error) {
      setIsSaving(false);
    }
    else{
      try{
        const response = await axios.post("/api/auth/edit-details", {
          id: editId,
          deliveryAddress: editDeliveryAddress,
          address: editAddress,
        });
        if(response.data.status==="ok"){
          saveImage();
          setStep2Completed(true);
        }
      }
      catch(error){
        toast.error("Edit User Details Failed !", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
      finally{
        setIsSaving(false);
      }
    }
  }

  const saveImage = async () => {
    if(file){
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
            signOut();
          }
          clearFields();
          router.push(goTo);
          setIsSaving(false);
        }
      })
      .catch(function (error) {
        setIsSaving(false);
      });
    }
    else{
      if(session && session.user){
        sessionUpdate({status: 'active'});
        signOut();
      }
      clearFields();
      router.push(goTo);
    }
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if(file){
      setFile(file);
      setEditImage(URL.createObjectURL(file));
      setOpenCrop(true);
    }    
  }

  const handleImageRemove = (event) => {
    setEditImage("none");
    setFile(null);
  }

  return (
    <div className='form_container mt-[40px]' style={{minHeight: (height-80)}}>
      <div className='form_container_medium'>
        <div className='w-[70px] h-[50px] relative mb-3'><Image src='/logo_1.png' alt='logo'  fill sizes='70px' priority={true} style={{objectFit: 'cover'}}/></div>
        <span className="form_header">Sign Up</span>
        <div className='form_stepper'>
          <Stepper activeStep={activeStep}>
            <Step completed={step0Completed}>
              <StepLabel>{"Login Details"}</StepLabel>
            </Step>
            <Step completed={step1Completed}>
              <StepLabel>{"Verify Email"}</StepLabel>
            </Step>
            <Step completed={step2Completed}>
              <StepLabel>{"Details"}</StepLabel>
            </Step>
          </Stepper>
        </div>
        {activeStep===0 && 
          <div className='form_fields_container'>
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
                  disabled={isSaving||isLoading}
                  onFocus={()=>setEditFirstNameError(false)}
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
                  disabled={isSaving||isLoading}
                  onFocus={()=>setEditLastNameError(false)}
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
                  disabled={isSaving||isLoading}
                  onFocus={()=>{setEditEmailError(false); setEditDuplicateEmailError(false)}}
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
                  error={editPhoneError||editDuplicatePhoneError}
                  onChange={event=>setEditPhone(event.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Phone sx={{width: 26, height: 26, color: editPhoneError?'crimson':'#94a3b8'}}/></InputAdornment>,
                  }}
                  disabled={isSaving||isLoading}
                  onFocus={()=>{setEditPhoneError(false); setEditDuplicatePhoneError(false)}}
                />
                {editPhoneError && <span className='form_error_floating'>Invalid Phone</span>}
                {editDuplicatePhoneError && <span className='form_error_floating'>Phone Already Exists !</span>}
              </div>
            </div>
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
                />
                {editConfirmError && <span className='form_error_floating'>Invalid Confirmation</span>}
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
                  disabled={isSaving||isLoading}
                  onFocus={()=>setEditNotifyByError(false)}
                >
                  <MenuItem value={"email"}>Email</MenuItem>
                  <MenuItem value={"sms"}>SMS</MenuItem>
                </TextField>
                {editNotifyByError && <span className='form_error_floating'>Invalid Notify By</span>}
              </div>
              <div className='form_field_container_split'>
                <Button variant="text" style={{textTransform: 'none'}} onClick={()=>{}}>User Agreement</Button>
                <FormControlLabel control={
                    <Checkbox 
                      id='user-agreement'
                      checked={editUserAgreement} 
                      onChange={event=>setEditUserAgreement(event.target.checked)}
                      disabled={isSaving||isLoading}
                    />
                  } 
                  label="I Agree"
                />
                {editUserAgreementError && <span className='form_error_floating'>User Agreement Not Accepted</span>}
              </div>
            </div>
            <div className='form_row_double_fixed'>
              <span></span>
              <Button 
                variant='contained' 
                disabled={isSaving||isLoading} 
                style={{textTransform: 'none', color: '#fff'}} 
                endIcon={isSaving||isLoading?<CircularProgress size={18} style={{'color': '#fff'}}/>:<ArrowForward style={{color: '#fff'}}/>}
                onClick={()=>signUpClicked()}
              >
                Next
              </Button>
            </div>
          </div>
        }
        {activeStep===1 && 
          <div className='form_fields_container'>
            <span className="form_info">{editNotifyByHeader}</span>
            <div className='form_row_double'>
              <div className='form_field_container'>
                <TextField 
                  id='first-name-view'
                  label="First Name" 
                  variant="standard" 
                  className='form_text_field' 
                  value={editFirstName} 
                  disabled={true}
                />
              </div>
              <div className='form_field_container'>
                <TextField 
                  id='last-name-view'
                  label="Last Name" 
                  variant="standard" 
                  className='form_text_field' 
                  value={editLastName} 
                  disabled={true}
                />
              </div>
            </div>
            <div className='form_row_double'>
              <div className='form_field_container'>
                <TextField 
                  id='email-view'
                  label="Email" 
                  variant="standard" 
                  className='form_text_field' 
                  value={editEmailMasked} 
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><MailOutline sx={{width: 26, height: 26, color: '#94a3b8'}}/></InputAdornment>,
                  }}
                  disabled={true}
                />
              </div>
              <div className='form_field_container'>
                <TextField 
                  id='phone-view'
                  label="Phone" 
                  variant="standard" 
                  className='form_text_field' 
                  value={editPhoneMasked} 
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Phone sx={{width: 26, height: 26, color: '#94a3b8'}}/></InputAdornment>,
                  }}
                  disabled={true}
                />
              </div>
            </div>
            <div className='form_row_double'>
              <div className='form_field_container'>
                <TextField className='form_text_field'
                  id='notify-by-2'
                  value={editNotifyBy}
                  label="Notify By"
                  onChange={event=>setEditNotifyBy(event.target.value)}                
                  variant={"outlined"}
                  select={true}
                  disabled={isSaving||isLoading}
                >
                  <MenuItem value={"email"}>Email</MenuItem>
                  <MenuItem value={"sms"}>SMS</MenuItem>
                </TextField>
              </div>
              <div className='form_field_container'>
                <TextField 
                  id='code'
                  type={"text"} 
                  label="Code" 
                  variant="outlined" 
                  className='form_text_field' 
                  value={editCode}
                  error={editCodeError}
                  onChange={event=>setEditCode(event.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Key sx={{width: 26, height: 26, color: editCodeError?'crimson':'#94a3b8'}}/></InputAdornment>,
                  }}
                  disabled={isSaving||isLoading}
                  onFocus={()=>setEditCodeError(false)}
                />
                {editCodeError && <span className='form_error_floating'>Invalid Code</span>}
              </div>
            </div>
            <div className='form_row_double_fixed'>
              <Button 
                variant='outlined' 
                disabled={isSaving||isLoading} 
                style={{textTransform: 'none'}} 
                startIcon={isSaving||isLoading?<CircularProgress size={18} style={{'color': '#9ca3af'}}/>:<Refresh style={{color: '#77bd1f'}}/>}
                onClick={()=>resendClicked()}
              >Resend Code</Button>
              <Button 
                variant='contained' 
                disabled={isSaving||isLoading} 
                style={{textTransform: 'none', color: '#fff'}} 
                endIcon={isSaving||isLoading?<CircularProgress size={18} style={{'color': '#fff'}}/>:<ArrowForward style={{color: '#fff'}}/>}
                onClick={()=>activateClicked()}
              >Verify</Button>
            </div>
          </div>
        }
        {activeStep===2 && 
          <div className='form_fields_container'>
            <div className='form_profile_image'>
              <div className='form_profile_image_container' onClick={()=>imageRef.current.click()}>
                {editImage==="none"?<CameraAlt sx={{width: 130, height: 130, color: '#fff'}}/>:<Avatar src={editImage} sx={{width: 150, height: 150, cursor: 'pointer'}}/>}
                <input type='file' ref={imageRef} onChange={handleImageChange} className='file_input'/>
              </div>
              <div className='form_profile_image_controls'>
                <IconButton disabled={isSaving||isLoading} onClick={()=>imageRef.current.click()}><Folder sx={{width: 20, height: 20, color: '#7c3aed'}}/></IconButton>
                <IconButton disabled={isSaving||isLoading} onClick={()=>setOpenCrop(true)}><CropRotate sx={{width: 20, height: 20, color: '#7c3aed'}}/></IconButton>
                <IconButton disabled={isSaving||isLoading} onClick={(event)=>handleImageRemove(event)}><Delete sx={{width: 20, height: 20, color: '#7c3aed'}}/></IconButton>
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
                  disabled={isSaving||isLoading}
                  multiline={true}
                  rows={4}
                  onFocus={()=>setEditAddressError(false)}
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
                  disabled={isSaving||isLoading}
                  multiline={true}
                  rows={4}
                  onFocus={()=>setEditDeliveryAddressError(false)}
                />
                <FormControlLabel 
                  control={
                    <Checkbox 
                      id='same-address'
                      checked={editSameAddress} 
                      onChange={event=>setEditSameAddress(event.target.checked)}
                      disabled={isLoading||isSaving}
                    />
                  } 
                  label="Same Address"
                />
                {editDeliveryAddressError && <span className='form_error_floating'>Invalid Delivery Address</span>}
              </div>
            </div>
            <div className='form_row_double_fixed'>
              <span></span>
              <Button 
                variant='contained' 
                disabled={isSaving||isLoading} 
                style={{textTransform: 'none', color: '#fff'}} 
                startIcon={isSaving||isLoading?<CircularProgress size={18} style={{'color': '#fff'}}/>:<Save style={{color: '#fff'}}/>}
                onClick={()=>saveDetailsClicked()}
              >Save</Button>
            </div>
          </div>
        }
        <div className='form_row_single relative my-5' style={{border: '1px solid #e2e8f0'}}>
          <span className='text-sm bg-white py-1 px-3 absolute -top-4'>Already have an account?</span>
        </div>
        <div className='form_row_single mt-5'>
          <Button 
            variant='contained' 
            disabled={isSaving||isLoading} 
            style={{textTransform: 'none', color: '#fff'}} 
            endIcon={isSaving||isLoading?<CircularProgress size={18} style={{'color': '#fff'}}/>:<Login style={{color: '#fff'}}/>}
            onClick={()=>{
              if(session && session.user){
                signOut();
                router.push('/signin');
              }
              else{
                router.push('/signin');
              }
            }}
          >Sign In</Button>
        </div>
        <div className='form_row_single'>
          <Button variant="text" style={{textTransform: 'none'}} onClick={()=>router.push("/terms")}>Terms & Conditions</Button>
        </div>
      </div>
      <Dialog open={openCrop} onClose={()=>setOpenCrop(false)}>
        <CropEasy {...{setOpenCrop, photoURL: editImage, setPhotoURL: setEditImage, setFile}}/>
      </Dialog>
      <ToastContainer />
    </div>
  )
}

export default Signup;