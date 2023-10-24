'use client';
import { useState, useEffect } from 'react';
import { CircularProgress, ClickAwayListener, IconButton, Paper } from "@mui/material";
import { CameraAlt, Close } from "@mui/icons-material";
import axios from "axios";
import useWindowDimensions from '@/hooks/useWindowDimension';
import Image from 'next/image';

const BrandsBrowser = ({value, valueSelected, setOpen}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const { width=500, height=500 } = useWindowDimensions();

  const [brands, setBrands] = useState([]);

  useEffect(() => {
    setIsLoading(false);
    setServerError(false);
    getBrands();
  }, []);

  async function getBrands(){
    try{
      setServerError(false);
      setIsLoading(true);
      var error = false;
      if(!error){
        const response = await axios.post("/api/brands/active/", {});
        const values = [];
        response.data.data.rows.map(val => {
          var imageUrl = "";
          if(val.image_url==="none"){
            imageUrl = "none";
          }
          else{
            imageUrl = "http://tm-web.effisoftsolutions.com/"+val.image_url;
          }
          values.push({
            id: val.id,
            url_string: val.url_string,
            description: val.description,
            code: val.code,
            image_url: imageUrl,
          });
        });
        setBrands(values);
      }
    }
    catch(error){
      setServerError(true);
    }
    finally{
      setIsLoading(false);
    }
  };

  const brandSelected = (val) => {
    valueSelected({
      brand: val,
    });
  }

  return (
    <Paper className='flex flex-col w-[100%] max-w-7xl'>
      <ClickAwayListener onClickAway={()=>setOpen(false)}>
        {isLoading ? 
          <div className='flex flex-col items-center justify-center w-full min-h-[200px] lg:h-[300px] sm:h-[250px] xs:h-[150px] bg-slate-100 shadow-xl' style={{width: width>=1280?1280:(width)}}>
            <CircularProgress size={30} style={{color:"#71717a"}} />
            <span className="text-sm mt-5 font-semibold text-gray-700">{"Loading..."}</span>
          </div>:
          <div className='flex flex-col justify-start items-start w-[100%] pb-2 px-3 bg-white shadow-xl' style={{width: width>=1280?1280:(width)}}>
            <div className='flex flex-row justify-between items-center w-full py-2'>
              <span className='text-md font-semibold text-emerald-700'>{}</span>
              <IconButton onClick={()=>setOpen(false)} sx={{width: 30, height: 30, borderRadius: 15, color: '#fff', backgroundColor: '#9CA3AF'}}><Close sx={{width: 20, height: 20, color: '#ffffff'}}/></IconButton>
            </div>
            <div className='flex flex-row justify-start items-start w-full flex-wrap max-h-[600px] overflow-y-auto pt-2 xs:pt-5 pb-3'>
              {brands.map(val=>
                <div key={val.id+val.description} className='flex flex-row justify-start items-center w-[90%] xs:w-[175px] sm:w-[175px] md:w-[220px] gap-2 py-3 px-1 mr-0 xs:mr-5 cursor-pointer hover:bg-slate-100' style={{borderRight: width>440?('1px solid #D1D5DB'):'none'}} onClick={()=>brandSelected(val)}>
                  <div className='flex flex-col justify-center items-center w-[80px] h-[30px] relative'>
                    {val.image_url==="none" ? 
                      <CameraAlt sx={{width: 30, height: 30, color: '#cbd5e1'}}/> : 
                      <Image src={val.image_url} alt="brand image" fill sizes='80px' priority={true} style={{objectFit: 'contain'}}/>
                    }
                  </div>
                  <span className='text-xs lg:text-sm'>{val.description}</span>
                </div>
              )}
            </div>
          </div>
        }
      </ClickAwayListener>
    </Paper>
  );
};

export default BrandsBrowser;