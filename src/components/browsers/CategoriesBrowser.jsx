'use client';
import { useState, useEffect } from 'react';
import { CircularProgress, ClickAwayListener, IconButton, Paper } from "@mui/material";
import { Close } from "@mui/icons-material";
import axios from "axios";
import useWindowDimensions from '@/hooks/useWindowDimension';
import Image from 'next/image';

const CategoriesBrowser = ({value, valueSelected, setOpen, includeParts}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const { width=500, height=500 } = useWindowDimensions();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setIsLoading(false);
    setServerError(false);
    getCategories();
  }, []);

  async function getCategories(){
    try{
      setServerError(false);
      setIsLoading(true);
      var error = false;
      if(!error){
        const response = await axios.post(includeParts?"/api/categories/find-sub-categories-all/":"/api/categories/find-sub-categories/", {});
        const values = [];
        response.data.data.rows.map(val => {
          var imageUrl = "";
          if(val.image_url==="none"){
            imageUrl = "none";
          }
          else{
            imageUrl = "http://tm-web.effisoftsolutions.com/"+val.image_url;
          }
          var sub_categories = [];
          val.sub_categories.map(val1=>{
            var imageUrl1 = "";
            if(val1.image_url==="none"){
              imageUrl1 = "none";
            }
            else{
              imageUrl1 = "http://tm-web.effisoftsolutions.com/"+val1.image_url;
            }
            sub_categories.push({
              id: val1.id,
              url_string: val1.url_string,
              description: val1.description,
              code: val1.code,
              image_url: imageUrl1,
            });
          });
          values.push({
            id: val.id,
            url_string: val.url_string,
            description: val.description,
            code: val.code,
            image_url: imageUrl,
            sub_categories: sub_categories,
          });
        });
        setCategories(values);
      }
    }
    catch(error){
      setServerError(true);
    }
    finally{
      setIsLoading(false);
    }
  };

  const allCategoriesSelected = () => {
    valueSelected({
      category: {id: 0, url_string: 'All', description: 'All', image_url: 'none'},
      subCategory: {id: 0, url_string: 'All', description: 'All', image_url: 'none'},
    });
  };

  const categorySelected = (val) => {
    valueSelected({
      category: val,
      subCategory: {id: 0, url_string: 'All', description: 'All', image_url: 'none'},
    });
  };

  const subCategorySelected = (val, val1) => {
    valueSelected({
      category: val,
      subCategory: val1,
    });
  };

  return (
    <Paper className='flex flex-col w-[100%] max-w-7xl'>
      <ClickAwayListener onClickAway={()=>setOpen(false)}>
        {isLoading ? 
          <div className='flex flex-col items-center justify-center w-full min-h-[200px] lg:h-[300px] sm:h-[250px] xs:h-[150px] bg-slate-100 shadow-xl' style={{width: width>=1280?1280:(width)}}>
            <CircularProgress size={30} style={{color:"#71717a"}} />
            <span className="text-sm mt-5 font-semibold text-gray-700">{"Loading..."}</span>
          </div>:
          <div className='flex flex-col justify-start items-start bg-white shadow-xl' style={{width: width>=1280?1280:(width)}}>
            <div className='flex flex-row justify-between items-center w-full pt-2 px-3'>
              <span className='text-sm font-semibold text-zinc-700 cursor-pointer hover:underline' onClick={()=>allCategoriesSelected()}>{"Browse All Categories"}</span>
              <IconButton onClick={()=>setOpen(false)} sx={{width: 30, height: 30, borderRadius: 15, color: '#fff', backgroundColor: '#9CA3AF'}}><Close sx={{width: 20, height: 20, color: '#ffffff'}}/></IconButton>
            </div>
            <div className='flex flex-row justify-start items-start w-full flex-wrap max-h-[600px] overflow-y-auto pt-1 pb-3'>
              {categories.map(val=>
                <div key={val.id+val.description} className='flex flex-col justify-center items-start w-[90%] xs:w-[195px] sm:w-[195px] md:w-[270px] ml-1 mr-3 mb-3'>
                  <div className='flex flex-row justify-start items-center w-full bg-[#dcfce7] gap-2 cursor-pointer hover:bg-slate-100 py-1 px-1' onClick={()=>categorySelected(val)}>                    
                    {val.image_url!=="none" &&
                      <div className='flex flex-col justify-center items-center w-[40px] h-[40px] relative'>
                        <Image src={val.image_url} alt="category image" fill sizes='40px' priority={true} style={{objectFit: 'contain', borderRadius: 20}}/>
                      </div>                      
                    }
                    <span className='text-xs lg:text-sm'>{val.description}</span>
                  </div>
                  <div className='flex flex-col justify-center items-center ml-[20px] relative w-[90%] xs:w-[175px] sm:w-[175px] md:w-[250px] mt-2' style={{borderLeft: '1px solid #e8e8e8'}}>
                    <div className='h-[27px] w-[5px] absolute bottom-[0px] -left-[2px]' style={{backgroundColor: '#fff'}}></div>
                    {val.sub_categories.map(val1=>
                      <div key={val1.id} className='flex flex-row justify-start items-center w-full h-[40px] gap-2 mb-2 cursor-pointer hover:bg-slate-100' onClick={()=>subCategorySelected(val, val1)}>
                        <div className='h-[1px] w-[10px]' style={{backgroundColor: '#e8e8e8'}}></div>
                        {val1.image_url!=="none" &&
                          <div className='flex flex-col justify-center items-center w-[30px] h-[30px] relative'>
                            <Image src={val1.image_url} alt="sub category image" fill sizes='30px' priority={true} style={{objectFit: 'contain', borderRadius: 20}}/>
                          </div>
                        }                        
                        <span className='text-xs lg:text-sm'>{val1.description}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        }
      </ClickAwayListener>
    </Paper>
  );
};

export default CategoriesBrowser;