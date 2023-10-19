'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef } from 'react';
import { Button, ClickAwayListener, Grow, IconButton, MenuItem, MenuList, Paper, Popper } from "@mui/material";
import { Check, ContactPage, Home, KeyboardArrowDown, KeyboardArrowRight, Menu, Search } from "@mui/icons-material";
import { useSearchContext } from '@/providers/SearchContextProvider';
import CategoriesBrowser from '../browsers/CategoriesBrowser';
import BrandsBrowser from '../browsers/BrandsBrowser';
import ServicesBrowser from '../browsers/ServicesBrowser';
import ShopsBrowser from '../browsers/ShopsBrowser';
import SparePartsBrowser from '../browsers/SparePartsBrowser';

const Navbar = ({search, applyFilters}) => {
  const router = useRouter();
  const pathname = usePathname();
  const {contextDescription, setContextDescription} = useSearchContext();

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const categoryRef = useRef(null);
  const brandRef = useRef(null);
  const sparePartRef = useRef(null);
  const serviceRef = useRef(null);
  const shopRef = useRef(null);

  const [openCategory, setOpenCategory] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);
  const [openSpareParts, setOpenSpareParts] = useState(false);
  const [openServices, setOpenServices] = useState(false);
  const [openShops, setOpenShops] = useState(false);

  function handleListKeyDown(event){
    if(event.key==='Tab') {
      event.preventDefault();
      setOpenMenu(false);
    } 
    else if(event.key==='Escape'){
      setOpenMenu(false);
    }
  };

  const categorySelected = (val) => {
    setOpenCategory(false);
    setContextDescription('');
    router.push(`/products/search/category/${val.category.description}/sub-category/${val.subCategory.description}/`);
  };

  const brandSelected = (val) => {
    setContextDescription('');
    setOpenBrand(false);
    router.push(`/products/search/brand/${val.description}/`);
  };

  const sparePartSelected = (val) => {
    setContextDescription('');
    setOpenSpareParts(false);
    router.push(`/spare-parts/search/`);
  };

  const serviceSelected = (val) => {
    setContextDescription('');
    setOpenServices(false);
    router.push(`/services/search/`);
  };

  const shopSelected = (val) => {
    setContextDescription('');
    setOpenShops(false);
    router.push(`/shop-locator/search/`);
  };

  const searchClicked = (val) => {
    if(search){
      applyFilters();
    }
    else{
      router.push(`/products/search/description/${val}/`);
    }    
  };
  
  return (
    <div className='flex flex-row w-full justify-between items-center max-w-7xl mt-[43px] fixed top-0 z-50' style={{backgroundColor: '#77bd1f'}}>
      <span ref={categoryRef} className='w-[0px] h-[30px] absolute top-2 left-0'/>
      <span ref={brandRef} className='w-[0px] h-[30px] absolute top-2 left-0'/>
      <span ref={sparePartRef} className='w-[0px] h-[30px] absolute top-2 left-0'/>
      <span ref={serviceRef} className='w-[0px] h-[30px] absolute top-2 left-0'/>
      <span ref={shopRef} className='w-[0px] h-[30px] absolute top-2 left-0'/>
      <div className='hidden xl:flex flex-row justify-center items-center gap-1'>
        <Button variant='text'
          sx={{textTransform: 'none', color: '#fff'}} 
          onClick={()=>router.push("/")} startIcon={<Home sx={{width: 18, height: 18, color: '#fff'}}/>}>Home</Button>
        <Button variant='text'
          sx={{textTransform: 'none', color: '#fff'}} 
          onClick={()=>setOpenCategory(val=>!val)} endIcon={<KeyboardArrowDown sx={{width: 18, height: 18, color: '#fff'}}/>}>Products</Button>
        <Button variant='text'
          sx={{textTransform: 'none', color: '#fff'}} 
          onClick={()=>setOpenBrand(val=>!val)} endIcon={<KeyboardArrowDown sx={{width: 18, height: 18, color: '#fff'}}/>}>Brands</Button>
        <Button variant='text'
          sx={{textTransform: 'none', color: '#fff'}} 
          onClick={()=>setOpenSpareParts(val=>!val)} endIcon={<KeyboardArrowDown sx={{width: 18, height: 18, color: '#fff'}}/>}>Spare Parts</Button>
        <Button variant='text'
          sx={{textTransform: 'none', color: '#fff'}} 
          onClick={()=>setOpenServices(val=>!val)} endIcon={<KeyboardArrowDown sx={{width: 18, height: 18, color: '#fff'}}/>}>Services</Button>
        <Button variant='text'
          sx={{textTransform: 'none', color: '#fff'}} 
          onClick={()=>setOpenShops(val=>!val)} endIcon={<KeyboardArrowDown sx={{width: 18, height: 18, color: '#fff'}}/>}>Shop Locator</Button>
        <Button variant='text'
          sx={{textTransform: 'none', color: '#fff'}} 
          onClick={()=>router.push("/contact-us")} startIcon={pathname.indexOf('/contact-us')>=0?<Check sx={{width: 18, height: 18, color: '#fff'}}/>:<ContactPage sx={{width: 18, height: 18, color: '#fff'}}/>}>Contact Us</Button>        
      </div>
      <div className='flex xl:hidden w-full justify-start items-center relative' style={{backgroundColor: '#77bd1f'}}>
        <IconButton ref={menuRef} size='small' onClick={()=>setOpenMenu(true)}><Menu sx={{width: 28, height: 28, color: '#fff'}}/></IconButton>
        <Popper
          open={openMenu}
          anchorEl={menuRef.current}
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
                <ClickAwayListener onClickAway={()=>setOpenMenu(false)}>
                  <MenuList autoFocusItem={openMenu} onKeyDown={handleListKeyDown} sx={{width: 230, backgroundColor: '#77bd1f'}}>                    
                    <MenuItem
                      onClick={()=>{
                        setOpenMenu(false);
                        router.push("/");
                      }}
                      size='small'
                    >
                      <div className='flex w-full justify-between items-center pb-2' style={{borderBottom: '1px solid #fff'}}>
                        <Home sx={{width: 18, height: 18, color: '#fff'}}/>
                        <span className='flex flex-1 text-sm text-white font-semibold pl-1'>Home</span>
                      </div>
                    </MenuItem>
                    <MenuItem
                      onClick={()=>{
                        setOpenMenu(false);
                        setOpenCategory(val=>!val);
                      }}
                      size='small'
                    >
                      <div className='flex w-full justify-between items-center pb-2' style={{borderBottom: '1px solid #fff'}}>
                        <span className='flex text-sm text-white font-semibold'>Products</span>
                        <KeyboardArrowRight sx={{width: 22, height: 22, color: '#fff'}}/>
                      </div>
                    </MenuItem>
                    <MenuItem
                      onClick={()=>{
                        setOpenMenu(false);
                        setOpenBrand(val=>!val);
                      }}
                      size='small'
                    >
                      <div className='flex w-full justify-between items-center pb-2' style={{borderBottom: '1px solid #fff'}}>
                        <span className='text-sm text-white font-semibold'>Brands</span>
                        <KeyboardArrowRight sx={{width: 22, height: 22, color: '#fff'}}/>
                      </div>
                    </MenuItem>
                    <MenuItem
                      onClick={()=>{
                        setOpenMenu(false);
                        setOpenSpareParts(val=>!val);
                      }}
                      size='small'
                    >
                      <div className='flex w-full justify-between items-center pb-2' style={{borderBottom: '1px solid #fff'}}>
                        <span className='text-sm text-white font-semibold'>Spare Parts</span>
                        <KeyboardArrowRight sx={{width: 22, height: 22, color: '#fff'}}/>
                      </div>
                    </MenuItem>
                    <MenuItem
                      onClick={()=>{
                        setOpenMenu(false);
                        setOpenServices(val=>!val);
                      }}
                      size='small'
                    >
                      <div className='flex w-full justify-between items-center pb-2' style={{borderBottom: '1px solid #fff'}}>
                        <span className='text-sm text-white font-semibold'>Services</span>
                        <KeyboardArrowRight sx={{width: 22, height: 22, color: '#fff'}}/>
                      </div>
                    </MenuItem>
                    <MenuItem
                      onClick={()=>{
                        setOpenMenu(false);
                        setOpenShops(val=>!val);
                      }}
                      size='small'
                    >
                      <div className='flex w-full justify-between items-center pb-2' style={{borderBottom: '1px solid #fff'}}>
                        <span className='text-sm text-white font-semibold'>Shop Locator</span>
                        <KeyboardArrowRight sx={{width: 22, height: 22, color: '#fff'}}/>
                      </div>
                    </MenuItem>
                    <MenuItem
                      onClick={()=>{
                        setOpenMenu(false);
                        router.push("/contact-us");
                      }}
                      size='small'
                    >
                      <div className='flex w-full justify-start items-center'>
                        {pathname.indexOf('/contact-us')>=0?<Check sx={{width: 22, height: 22, color: '#fff'}}/>:<ContactPage sx={{width: 22, height: 22, color: '#fff'}}/>}
                        <span className='text-sm text-white font-semibold'>Contact Us</span>
                      </div>
                    </MenuItem>                    
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
      <div className='flex flex-row justify-center items-center'>
        <div className='flex flex-row justify-center items-center bg-white p-1 w-[120px] xxs:w-[250px]'>
          <Search sx={{width: 22, height: 22, color: '#94a3b8'}}/>
          <input type='text' className='border-none outline-none w-full' value={contextDescription} onChange={(e)=>setContextDescription(e.target.value)}/>
        </div>
        <div className='hidden ssx:flex'>
          <Button 
            variant='text' 
            style={{textTransform: 'none'}} 
            startIcon={<Search />}
            onClick={()=>searchClicked(contextDescription)}
            size='small'
            sx={{color: '#fff'}}
          >Search</Button>
        </div>
        <div className='flex ssx:hidden'>
          <IconButton onClick={()=>searchClicked(contextDescription)}><Search sx={{width: 22, height: 22, color: '#fff'}}/></IconButton>
        </div>        
      </div>
      <Popper
        open={openCategory}
        anchorEl={categoryRef.current}
        placement='bottom-start'
        transition={true}
        style={{zIndex: 50}}
      >
        {({TransitionProps}) => (
          <Grow {...TransitionProps}>
            <div><CategoriesBrowser value={{}} valueSelected={categorySelected} setOpen={setOpenCategory} includeParts={false}/></div>
          </Grow>
        )}
      </Popper>
      <Popper
        open={openBrand}
        anchorEl={brandRef.current}
        placement='bottom-start'
        transition={true}
        style={{zIndex: 50}}
      >
        {({TransitionProps}) => (
          <Grow {...TransitionProps}>
            <div><BrandsBrowser value={{}} valueSelected={brandSelected} setOpen={setOpenBrand} /></div>
          </Grow>
        )}
      </Popper>
      <Popper
        open={openSpareParts}
        anchorEl={sparePartRef.current}
        placement='bottom-start'
        transition={true}
        style={{zIndex: 50}}
      >
        {({TransitionProps}) => (
          <Grow {...TransitionProps}>
            <div><SparePartsBrowser value={{}} valueSelected={sparePartSelected} setOpen={setOpenSpareParts} /></div>
          </Grow>
        )}
      </Popper>
      <Popper
        open={openServices}
        anchorEl={serviceRef.current}
        placement='bottom-start'
        transition={true}
        style={{zIndex: 50}}
      >
        {({TransitionProps}) => (
          <Grow {...TransitionProps}>
            <div><ServicesBrowser value={{}} valueSelected={serviceSelected} setOpen={setOpenServices} /></div>
          </Grow>
        )}
      </Popper>
      <Popper
        open={openShops}
        anchorEl={shopRef.current}
        placement='bottom-start'
        transition={true}
        style={{zIndex: 50}}
      >
        {({TransitionProps}) => (
          <Grow {...TransitionProps}>
            <div><ShopsBrowser value={{}} valueSelected={shopSelected} setOpen={setOpenShops} /></div>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

export default Navbar;