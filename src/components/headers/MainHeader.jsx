'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import {  signOut, useSession } from 'next-auth/react';
import { Avatar, Button, CircularProgress, ClickAwayListener, Divider, Grow, IconButton, ListItemIcon, MenuItem, MenuList, Paper, Popper } from "@mui/material";
import { DirectionsCar, Favorite, FileCopy, Login, Logout, MoreVert, Notifications, Person, PersonAdd, Settings, ShoppingCart } from "@mui/icons-material";

const MainHeader = () => {
  const router = useRouter();
  const {data: session, status} = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("none");
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  useEffect(() => {
    if(session && session.user){
      if(session.user.image==="none"){
        if(session.user.googleImage!==""){
          setImageUrl(session.user.googleImage);
        }
      }
      else{
        setImageUrl("http://tm-web.effisoftsolutions.com/"+session.user.image);
      }
    }
  }, [session]);
  
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  function handleListKeyDown(event){
    if(event.key==='Tab') {
      event.preventDefault();
      setOpen(false);
    } 
    else if(event.key==='Escape'){
      setOpen(false);
    }
  }

  const onSignOut = async () => {
    try {
      
    } 
    catch (e) {
      console.log("put storage error");
    }
    setIsLoading(true);
    signOut();
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col justify-center items-center w-full fixed top-0 z-50 bg-white">
      <div className="flex flex-row justify-between items-center w-full max-w-7xl bg-white">
        <div className='flex flex-row flex-1'>
          <div onClick={()=>router.push("/")} className='flex flex-row gap-0 h-[40px] justify-start items-center cursor-pointer'>
            <p className='font-bold text-xl sm:text-2xl hidden xs:flex pl-1 xl:p-0' style={{color: '#77bd1f'}}>TeckMax</p>
            <div className='w-[50px] h-[30px] relative'><Image src='/logo_1.png' alt='logo' fill sizes='50px' priority={true} style={{objectFit: 'contain'}}/></div>
            <p className='font-bold text-md sm:text-xl hidden xs:flex' style={{color: '#475569'}}>Electronics</p>
          </div>
        </div>
        {status==="loading" && 
          <div className="flex flex-row justify-center items-center px-2">
            <CircularProgress size={24} color='button'/>
          </div>
        }
        {status==="authenticated" && 
          <>
            <div className="flex flex-row justify-center items-center gap-1">
              <IconButton onClick={()=>router.push('/notifications')}><Notifications sx={{width: 22, height: 22, color: '#475569'}}/></IconButton>
              <IconButton onClick={()=>router.push('/cart')}><ShoppingCart sx={{width: 22, height: 22, color: '#475569'}}/></IconButton>
              <div className='flex flex-row justify-center items-center gap-2 cursor-pointer' onClick={()=>router.push('/profile')}>
                {imageUrl==="none"?<Person sx={{width: 30, height: 30, color: '#475569'}}/>:<Avatar src={imageUrl} sx={{width: 30, height: 30}}/>}
                <div className='flex-col justify-center items-start w-30 hidden md:flex'>
                  <span className='text-xs font-medium'>{session?.user.name}</span>
                  <span className='text-xs text-emerald-700'>{"Buyer"}</span>
                </div>
              </div>
              <IconButton ref={anchorRef} onClick={handleToggle}><MoreVert sx={{width: 28, height: 28, color: '#475569'}}/></IconButton>
            </div>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              placement="bottom-start"
              transition={true}
              disablePortal={true}
            >
              {({ TransitionProps, placement }) => (
                <Grow {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === 'bottom-start' ? 'left top' : 'left bottom',
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={()=>setOpen(false)}>
                      <MenuList autoFocusItem={open} onKeyDown={handleListKeyDown} sx={{width: 220}}>
                        <div className='flex-col justify-center items-start px-4 py-2 bg-white flex md:hidden'>
                          <span className='text-sm'>{session.user.name}</span>
                          <span className='text-xs text-emerald-700'>{"Buyer"}</span>
                        </div>
                        <Divider className='flex md:hidden'/>
                        <MenuItem
                          onClick={()=>{
                            setOpen(false);
                            router.push("/notifications");
                          }}
                        >
                          <ListItemIcon><Notifications sx={{width: 18, height: 18, color: '#047857'}}/></ListItemIcon>
                          <span className='text-sm'>Notifications</span>
                        </MenuItem>
                        <MenuItem
                          onClick={()=>{
                            setOpen(false);
                            router.push("/cart");
                          }}
                        >
                          <ListItemIcon><ShoppingCart sx={{width: 18, height: 18, color: '#047857'}}/></ListItemIcon>
                          <span className='text-sm'>Cart</span>
                        </MenuItem>
                        <MenuItem
                          onClick={()=>{
                            setOpen(false);
                            router.push("/favorites");
                          }}
                        >
                          <ListItemIcon><Favorite sx={{width: 18, height: 18, color: '#047857'}}/></ListItemIcon>
                          <span className='text-sm'>Favorites</span>
                        </MenuItem>
                        <Divider />
                        <MenuItem
                          onClick={()=>{
                            setOpen(false);
                            router.push("/track-order");
                          }}
                        >
                          <ListItemIcon><DirectionsCar sx={{width: 18, height: 18, color: '#047857'}}/></ListItemIcon>
                          <span className='text-sm'>Track Order</span>
                        </MenuItem>
                        <MenuItem
                          onClick={()=>{
                            setOpen(false);
                            router.push("/orders");
                          }}
                        >
                          <ListItemIcon><FileCopy sx={{width: 18, height: 18, color: '#047857'}}/></ListItemIcon>
                          <span className='text-sm'>Order History</span>
                        </MenuItem>
                        <Divider />
                        <MenuItem
                          onClick={()=>{
                            setOpen(false);
                            router.push("/profile");
                          }}
                        >
                          <ListItemIcon><Person sx={{width: 18, height: 18, color: '#047857'}}/></ListItemIcon>
                          <span className='text-sm'>Profile</span>
                        </MenuItem>
                        <MenuItem
                          onClick={()=>{
                            setOpen(false);
                            router.push("/settings");
                          }}
                        >
                          <ListItemIcon><Settings sx={{width: 18, height: 18, color: '#047857'}}/></ListItemIcon>
                          <span className='text-sm'>Settings</span>
                        </MenuItem>
                        <Divider />
                        <MenuItem 
                          onClick={()=>{
                            setOpen(false);
                            onSignOut();
                          }}
                        >
                          <ListItemIcon>{isLoading?<CircularProgress size={18} style={{'color': '#047857'}}/>:<Logout sx={{width: 18, height: 18, color: '#047857'}}/>}</ListItemIcon>
                          <span className='text-sm'>Sign Out</span>
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </>
        }
        {status==="unauthenticated" && 
          <div className="flex flex-row justify-center items-center gap-3">
            <Button 
              variant='text' 
              style={{textTransform: 'none'}} 
              startIcon={<Login />}
              onClick={()=>router.push('/signin')}
              size='small'
              color='button'
            >Sign In</Button>
            <Button 
              variant='text' 
              style={{textTransform: 'none'}} 
              startIcon={<PersonAdd />}
              onClick={()=>router.push('/signup')}
              size='small'
              color='button'
            >Sign Up</Button>
          </div>
        }
      </div>
    </div>
  )
}

export default MainHeader;