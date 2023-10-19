'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { InputAdornment, CircularProgress, MenuItem, Stepper, StepLabel, Avatar, Step, TextField, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ArrowForward, CameraAlt, Key, Login, MailOutline, Phone, Refresh, Save } from '@mui/icons-material';
import { emailReg } from '@/utils/Validate';
import useWindowDimensions from '@/hooks/useWindowDimension';
import Navbar from '@/components/headers/Navbar';

const Reset = () => {
  const router = useRouter();
  const {data: session, status, update: sessionUpdate} = useSession();
  const [serverError, setServerError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { width, height=500 } = useWindowDimensions();

  const [editId, setEditId] = useState(-1);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editPhoneError, setEditPhoneError] = useState(false);
  const [editEmail, setEditEmail] = useState("");
  const [editEmailError, setEditEmailError] = useState(false);
  const [editPassword, setEditPassword] = useState("");
  const [editPasswordError, setEditPasswordError] = useState(false);
  const [editConfirm, setEditConfirm] = useState("");
  const [editConfirmError, setEditConfirmError] = useState(false);

  const [editResetUsing, setEditResetUsing] = useState("email");
  const [editResetUsingError, setEditResetUsingError] = useState(false);
  const [editNotifyBy, setEditNotifyBy] = useState("email");
  const [editNotifyByError, setEditNotifyByError] = useState(false);
  const [editNotifyByHeader, setEditNotifyByHeader] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editCodeError, setEditCodeError] = useState(false);
  const [imageUrl, setImageUrl] = useState("none");

  const [activeStep, setActiveStep] = useState(0);
  const [step0Completed, setStep0Completed] = useState(false);
  const [step1Completed, setStep1Completed] = useState(false);
  const [step2Completed, setStep2Completed] = useState(false);

  const [editPhoneMasked, setEditPhoneMasked] = useState("");
  const [editEmailMasked, setEditEmailMasked] = useState("");

  useEffect(() => {
    setIsSaving(false);
  }, []);

  useEffect(() => {
    if(session && session.user && status==="authenticated"){
      if(session.user.status==="activation_pending"){
        router.push("/signup");
      }
      else if(session.user.status==="incomplete"){
        router.push("/signup");
      }
      else if(session.user.status==="reset_pending"){
        getUser(session.user.email);
      }
      else{
        router.push("/");
      }
    }
  }, [status]);

  const getUser = async (email) => {
    setIsLoading(true);
    try{
      const response = await axios.post("/api/auth/find-by-email", {
        email: email
      });
      setEditId(response.data.data.id);
      setEditFirstName(response.data.data.first_name);
      setEditLastName(response.data.data.last_name);
      setEditEmail(response.data.data.email);
      setEditPhone(response.data.data.phone);
      setEditNotifyBy(response.data.data.notify_by);
      setStep0Completed(true);
      setActiveStep(1);
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
    if(editNotifyBy==="email"){
      setEditNotifyByHeader("Check your email for the code");
    }
    else if(editNotifyBy==="sms"){
      setEditNotifyByHeader("Check your phone for the code");
    }
  }, [editNotifyBy]);

  useEffect(() => {
    setEditPhoneMasked(editPhone);
  }, [editPhone]);

  useEffect(() => {
    setEditEmailMasked(editEmail);
  }, [editEmail]);  

  const clearErrors = () => {
    setEditPhoneError(false);
    setEditEmailError(false);
    setEditPasswordError(false);
    setEditConfirmError(false);
    setEditNotifyByError(false);
    setEditCodeError(false);
    setEditResetUsingError(false);
    
    setServerError(false);
  }

  const clearFields = () => {
    setEditFirstName("");
    setEditLastName("");
    setEditPhone("");
    setEditEmail("");
    setEditPassword("");
    setEditConfirm("");
    setEditNotifyBy("email");
    setEditCode("");
    setImageUrl("none");
  }

  const checkUser = async () => {
    if(editResetUsing==="email"){
      clearErrors();
      setIsSaving(true);
      var error = false;
      if(editEmail.length>128 || !emailReg.test(editEmail)) {
        error = true;
        setEditEmailError(true);
      }
      if(error) {
        setIsSaving(false);
      }
      else{
        try{
          const response = await axios.post("/api/auth/check-email", {
            email: editEmail
          });
          setEditId(response.data.data.id);
          setEditFirstName(response.data.data.first_name);
          setEditLastName(response.data.data.last_name);
          setEditEmail(response.data.data.email);
          setEditPhone(response.data.data.phone);
          setEditNotifyBy(response.data.data.notify_by);
          if(response.data.data.image_url!=="none"){
            setImageUrl("http://tm002.techmax.lk/"+response.data.data.image_url);
          }
          sendResetCode(response.data.data.id);
        }
        catch(error){
          toast.error("Check Email Failed !", {
            position: toast.POSITION.TOP_RIGHT
          });
        }
        finally{
          setIsSaving(false);
        }
      }
    }
    else if(editResetUsing==="phone"){
      clearErrors();
      setIsSaving(true);
      var error = false;
      if(editPhone.length>128 || !emailReg.test(editPhone)) {
        error = true;
        setEditPhoneError(true);
      }
      if(error) {
        setIsSaving(false);
      }
      else{
        try{
          const response = await axios.post("/api/auth/check-phone", {
            phone: editPhone
          });
          setEditId(response.data.data.id);
          setEditFirstName(response.data.data.first_name);
          setEditLastName(response.data.data.last_name);
          setEditEmail(response.data.data.email);
          setEditPhone(response.data.data.phone);
          setEditNotifyBy(response.data.data.notify_by);
          if(response.data.data.image_url!=="none"){
            setImageUrl("http://tm002.techmax.lk/"+response.data.data.image_url);
          }
        }
        catch(error){
          toast.error("Check Phone Failed !", {
            position: toast.POSITION.TOP_RIGHT
          });
        }
        finally{
          setIsSaving(false);
        }
      }
    }
  }

  const sendResetCode = async (id) => {
    setIsSaving(true);
    try{
      const response = await axios.post("/api/auth/send-reset-code", {
        id: id
      });
      if(response.data.status==="invalid_user"){
        if(editResetUsing==="email"){
          setEditEmailError(true);
        }
        else if(editResetUsing==="phone"){
          setEditPhoneError(true);
        }
        toast.success("Invalid User !", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
      else{
        if(response.data.status==="email_error"){
          toast.error("Failed To Send Email !", {
            position: toast.POSITION.TOP_RIGHT
          });
        }
        else if(response.data.status==="sms_error"){
          toast.error("Failed To Send SMS !", {
            position: toast.POSITION.TOP_RIGHT
          });
        }
        else if(response.data.status==="ok"){
          toast.success("Code Sent !", {
            position: toast.POSITION.TOP_RIGHT
          });
        }
        setStep0Completed(true);
        setActiveStep(1);
      }
    }
    catch(error){
      toast.error("Code Send Failed !", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    finally{
      setIsSaving(false);
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
        if(response.data.status==="ok"){
          if(response.data.status==="invalid_user"){
            toast.success("Invalid User !", {
              position: toast.POSITION.TOP_RIGHT
            });
          }
          else{
            if(response.data.status==="email_error"){
              toast.error("Failed To Send Email !", {
                position: toast.POSITION.TOP_RIGHT
              });
            }
            else if(response.data.status==="sms_error"){
              toast.error("Failed To Send SMS !", {
                position: toast.POSITION.TOP_RIGHT
              });
            }
            else if(response.data.status==="ok"){
              toast.success("Code Sent !", {
                position: toast.POSITION.TOP_RIGHT
              });
            }
            setStep0Completed(true);
            setActiveStep(1);
          }
        }
        else{
          toast.error("Code Send Failed !", {
            position: toast.POSITION.TOP_RIGHT
          });
        }
      }
      catch(error){
        toast.error("Code Send Failed !", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
      finally{
        setIsSaving(false);
      }
    }
  }

  const verifyClicked = async ()=> {
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
        const response = await axios.post("/api/auth/check-reset-code", {
          id: editId,
          activationCode: editCode
        });
        if(response.data.status==="ok"){
          setStep1Completed(true);
          setActiveStep(2);
        }
        else{
          setEditCodeError(true);
          toast.error("Verify Code Failed !", {
            position: toast.POSITION.TOP_RIGHT
          });
        }
      }
      catch(error){
        toast.error("Verify Code Failed !", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
      finally{
        setIsSaving(false);
      }
    }
  }

  const saveClicked = async ()=> {
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
        const response = await axios.post("/api/auth/reset-password", {
          id: editId,
          password: editPassword,
        });
        setStep2Completed(true);
        clearFields();
        if(session && session.user){
          sessionUpdate({status: 'active'});
          signOut();
        }
        router.push("/signin");
      }
      catch(error){
        toast.error("Reset Failed !", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
      finally{
        setIsSaving(false);
      }
    }
  }

  return (
    <div className='form_container mt-[40px]' style={{minHeight: (height-80)}}>
      <div className='form_container_medium'>
        <div className='w-[70px] h-[50px] relative mb-3'><Image src='/logo_1.png' alt='logo'  fill sizes='70px' priority={true} style={{objectFit: 'cover'}}/></div>
        <span className="form_header">Reset Account</span>
        <div className='form_stepper w-full'>
          <Stepper activeStep={activeStep}>
            <Step completed={step0Completed}>
              <StepLabel>{"Find User"}</StepLabel>
            </Step>
            <Step completed={step1Completed}>
              <StepLabel>{"Verify Account"}</StepLabel>
            </Step>
            <Step completed={step2Completed}>
              <StepLabel>{"Reset Password"}</StepLabel>
            </Step>
          </Stepper>
        </div>
        {activeStep===0 && 
          <div className='form_fields_container'>
            <div className='form_row_double'>
              <div className='form_field_container'>
                <TextField className='form_text_field'
                  id='reset-using'
                  value={editResetUsing}
                  label="Reset Using"
                  onChange={event=>setEditResetUsing(event.target.value)}                
                  variant={"outlined"}
                  select={true}
                  disabled={isSaving||isLoading}
                >
                  <MenuItem value={"email"}>Email</MenuItem>
                  <MenuItem value={"phone"}>Phone</MenuItem>
                </TextField>
              </div>
              {editResetUsing==="email" && 
                <div className='form_field_container'>
                  <TextField 
                    id='email'
                    label="Email" 
                    variant="outlined" 
                    className='form_text_field' 
                    value={editEmail} 
                    error={editEmailError}
                    onChange={event=>setEditEmail(event.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><MailOutline sx={{width: 26, height: 26, color: editEmailError?'crimson':'#94a3b8'}}/></InputAdornment>,
                    }}
                    disabled={isSaving||isLoading}
                    onFocus={()=>setEditEmailError(false)}
                  />
                  {editEmailError && <span className='form_error_floating'>Invalid Email</span>}
                </div>
              }
              {editResetUsing==="phone" && 
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
                      startAdornment: <InputAdornment position="start"><Phone sx={{width: 26, height: 26, color: editEmailError?'crimson':'#94a3b8'}}/></InputAdornment>,
                    }}
                    disabled={isSaving||isLoading}
                    onFocus={()=>setEditPhoneError(false)}
                  />
                  {editPhoneError && <span className='form_error_floating'>Invalid Phone</span>}
                </div>
              }
            </div>
            <div className='form_row_double_fixed'>
              <span></span>
              <Button 
                variant='contained' 
                disabled={isSaving||isLoading} 
                style={{textTransform: 'none', color: '#fff'}} 
                endIcon={isSaving||isLoading?<CircularProgress size={18} style={{'color': '#fff'}}/>:<ArrowForward style={{color: '#fff'}}/>}
                onClick={()=>checkUser()}
              >
                {editResetUsing==="email" && "Check Email"}
                {editResetUsing==="phone" && "Check Phone"}
              </Button>
            </div>
          </div>
        }
        {activeStep===1 && 
          <div className='form_fields_container'>
            <span className="form_info">{editNotifyByHeader}</span>
            <div className='form_profile_image'>
              <div className='form_profile_image_container_small'>
                {imageUrl==="none"?<CameraAlt sx={{width: 80, height: 80, color: '#fff'}}/>:<Avatar src={imageUrl} sx={{width: 100, height: 100, cursor: 'pointer'}}/>}
              </div>
            </div>
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
                onClick={()=>verifyClicked()}
              >Verify</Button>
            </div>
          </div>
        }
        {activeStep===2 && 
          <div className='form_fields_container'>
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
            <div className='form_row_double_fixed'>
              <span></span>
              <Button 
                variant='contained' 
                disabled={isSaving||isLoading} 
                style={{textTransform: 'none', color: '#fff'}} 
                endIcon={isSaving||isLoading?<CircularProgress size={18} style={{'color': '#fff'}}/>:<Save style={{color: '#fff'}}/>}
                onClick={()=>saveClicked()}
              >Save</Button>
            </div>
          </div>
        }
        <div className='form_row_single relative my-5' style={{border: '1px solid #e2e8f0'}}>
          <span className='text-sm bg-white py-1 px-3 absolute -top-4'>Sign In instead</span>
        </div>
        <div className='form_row_single mt-3'>
          <Button 
            variant='contained' 
            disabled={isSaving||isLoading} 
            style={{textTransform: 'none', color: '#fff'}} 
            startIcon={isSaving||isLoading?<CircularProgress size={18} style={{'color': '#fff'}}/>:<Login style={{color: '#fff'}}/>}
            onClick={()=>{
              if(session && session.user){
                signOut();
                router.push('/signin');
              }
              else{
                router.push('/signin');
              }
            }}
          >Use another account</Button>
        </div>
        <div className='form_row_single'>
          <Button variant="text" style={{textTransform: 'none'}} onClick={()=>router.push("/terms")}>Terms & Conditions</Button>
        </div>
      </div>      
      <ToastContainer />
    </div>
  )
}

export default Reset;