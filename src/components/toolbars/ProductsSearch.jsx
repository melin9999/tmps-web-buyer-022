
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";
import { ArrowRight, Check, ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Checkbox, 
  CircularProgress, FormControlLabel, Grow, InputAdornment, MenuItem, Popper, TextField } from "@mui/material";
import Image from 'next/image';
import CategoriesBrowser from '../browsers/CategoriesBrowser';
import BrandsBrowser from '../browsers/BrandsBrowser';

const ProductsSearch = ({categoryRef, applyFilters, searchSortBy, setSearchSortBy, 
  searchOrder, setSearchOrder, searchPriceMin, setSearchPriceMin, searchPriceMax, setSearchPriceMax, 
  searchCategory, searchSubCategory, searchBrand,  
  searchSelectedBrands, setSearchSelectedBrands, searchModel, setSearchModel, 
  searchSelectedFeatures, setSearchSelectedFeatures
}) => {
  const router = useRouter();
  const [isLoading1, setIsLoading1] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true);
  const [isLoading3, setIsLoading3] = useState(true);
  const [serverError, setServerError] = useState(false);

  const [openBrand, setOpenBrand] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [searchSubCategories, setSearchSubCategories] = useState([]);
  const [searchBrands, setSearchBrands] = useState([]);
  const [searchFeatures, setSearchFeatures] = useState([]);

  useEffect(() => {
    setServerError(false);
    setIsLoading1(false);
    setIsLoading2(false);
    setIsLoading3(false);
  }, []);
  

  useEffect(() => {
    if(searchCategory.id>0){
      getSubCategories();
    }
  }, [searchCategory]);
  
  const getSubCategories = async () => {
    try{
      if(searchCategory.id>0){
        setIsLoading1(true);
        setServerError(false);
        const response = await axios.post(`/api/sub-categories/find-for-category`, {
          categoryId: parseInt(searchCategory.id),
        });
        if (!response.data.error) {
          var values = [];
          response.data.data.rows.map(val=>{     
            var imageUrl = "";
            if(val.image_url==="none"){
              imageUrl = "none";
            }
            else{
              imageUrl = "http://tm-web.effisoftsolutions.com/"+val.image_url;
            }
            values.push({
              id: val.id,
              description: val.description,
              image_url: imageUrl
            });
          });
          setSearchSubCategories(values);
        } 
      }
      else{
        setSearchSubCategories([]);
      }
    }
    catch(error){
      setServerError(true);
    }
    finally{
      setIsLoading1(false);
    }
  };

  useEffect(() => {
    getBrands();
    getFeatures();
  }, [searchSubCategory]);
  
  const getBrands = async () => {
    try{
      setIsLoading2(true);
      setServerError(false);
      var search_data = {};
      if(searchCategory.id !== 0){
        search_data["categoryId"] = (searchCategory.id);
      }
      if(searchSubCategory.id !== 0){
        search_data["subCategoryId"] = (searchSubCategory.id);
      }
      const response = await axios.post(`/api/brands/find-for-sub-category`, {
        search_data: search_data,
      });
      if (!response.data.error) {
        var values = [];
        response.data.data.map(val=>{     
          var imageUrl = "";
          if(val.brand.image_url==="none"){
            imageUrl = "none";
          }
          else{
            imageUrl = "http://tm-web.effisoftsolutions.com/"+val.brand.image_url;
          }     
          values.push({
            id: val.brand_id,
            description: val.brand.description,
            image_url: imageUrl
          });
        });
        setSearchBrands(values);
      }
    }
    catch(error){
      setServerError(true);
    }
    finally{
      setIsLoading2(false);
    }
  };
  
  const getFeatures = async () => {
    try{
      if(searchSubCategory.id>0){
        setIsLoading3(true);
        setServerError(false);
        const response = await axios.post(`/api/features/find-for-sub-category`, {
          sub_category_id: searchSubCategory.id,
        });
        if (!response.data.error) {
          var values = [];
          response.data.data.map(val=>{
            var imageUrl = "";
            if(val.feature.image_url==="none"){
              imageUrl = "none";
            }
            else{
              imageUrl = "http://tm-web.effisoftsolutions.com/"+val.feature.image_url;
            }
            var values1 = [];
            val.feature.sub_features.map(val1=>{
              var imageUrl1 = "";
              if(val1.image_url==="none"){
                imageUrl1 = "none";
              }
              else{
                imageUrl1 = "http://tm-web.effisoftsolutions.com/"+val1.image_url;
              }
              values1.push({
                id: val1.id,
                description: val1.description,
                image_url: imageUrl1
              });
            });
            values.push({
              id: val.feature.id,
              description: val.feature.description,
              image_url: imageUrl,
              sub_features: values1
            });
          });
          setSearchFeatures(values);
        } 
      }
      else{
        setSearchFeatures([]);
      }
    }
    catch(error){
      setServerError(true);
    }
    finally{
      setIsLoading3(false);
    }
  };

  const categorySelected = (val) => {
    setOpenCategory(false);
    router.push(`/products/search/category/${encodeURIComponent(val.category.description)}/sub-category/${encodeURIComponent(val.subCategory.description)}/`);
  };

  const subCategoryClicked = (val) => {
    router.push(`/products/search/category/${encodeURIComponent(searchCategory.description)}/sub-category/${encodeURIComponent(val.description)}/`);
  };

  const brandSelected = (val) => {
    router.push(`/products/search/brand/${encodeURIComponent(val.brand.description)}/`);
  };

  const addSearchBrand = (val) => {
    const index = searchSelectedBrands.findIndex(val1=>val1===parseInt(val));
    if(index===-1){
      let val2 = [...searchSelectedBrands];
      val2.push(parseInt(val));
      setSearchSelectedBrands(val2);
    }
    else{
      let val2 = searchSelectedBrands.filter(val1=>val1!==parseInt(val));
      setSearchSelectedBrands(val2);
    }
  };

  const removeAllSearchBrands = () => {
    setSearchSelectedBrands([]);
    applyFilters();
  };

  const removeAllSearchPrices = () => {
    setSearchPriceMin(0);
    setSearchPriceMax(0);
    applyFilters();
  };

  const removeAllSearchSort = () => {
    setSearchSortBy('description');
    setSearchOrder('ASC');
    applyFilters();
  };

  const addSearchFeature = (val, val1) => {
    const index = searchSelectedFeatures.findIndex(val2=>val2.id===parseInt(val));
    if(index===-1){
      let val3 = [...searchSelectedFeatures];
      val3.push({id: parseInt(val), featureId: val1});
      setSearchSelectedFeatures(val3);
    }
    else{
      let val3 = searchSelectedFeatures.filter(val2=>val2.id!==parseInt(val));
      setSearchSelectedFeatures(val3);
    }
  };

  const removeAllSearchFeatures = (val) => {
    let val2 = searchSelectedFeatures.filter(val1=>val1.featureId!==parseInt(val));
    setSearchFeatures(val2);
    applyFilters();
  };

  const applyFiltersClicked = () => {
    applyFilters();
  }

  return (
    <div className='flex flex-col justify-center w-full items-start relative bg-white'>
      <div className='flex flex-col justify-between items-center py-2 w-full' style={{borderBottom: '1px solid #e8e8e8'}}>
        <div className='flex flex-row w-full justify-center items-center gap-2 px-3 py-2 cursor-pointer hover:bg-slate-100' onClick={()=>setOpenCategory(val=>!val)}>          
          {searchCategory.image_url!=='none' &&
            <div className='flex flex-col justify-center items-center w-[40px] h-[40px] relative'>
              <Image src={searchCategory.image_url} alt="category image" fill sizes='40px' priority={true} style={{objectFit: 'contain', borderRadius: 20}}/>
            </div>
          }
          <span className='flex flex-1 flex-col justify-center items-start text-sm text-zinc-700'>{searchCategory.id===0?"All Categories":searchCategory.description}</span>
          <ArrowRight sx={{width: 22, height: 22, color: '#6b7280'}}/>
        </div>
        {isLoading1?
          <div className='flex flex-col justify-center items-center h-[40px]'>
            <CircularProgress size={30} style={{color:"#cbd5e1"}} />
          </div>:
          <>
            {searchCategory.id>0 &&
              <div className='flex flex-col justify-center items-start w-[220px] ml-[20px] relative' style={{borderLeft: '1px solid #e8e8e8'}}>
                <div className='h-[23px] w-[5px] absolute bottom-[0px] -left-[2px]' style={{backgroundColor: '#fff'}}></div>
                {searchSubCategories.map(val=>
                  <div key={val.id+val.description} className='flex flex-row w-[210px] h-[32px] justify-center items-center gap-2 cursor-pointer hover:bg-slate-100 mb-2' style={{backgroundColor: val.id===searchSubCategory.id?'#f1f5f9':'#fff'}} onClick={()=>subCategoryClicked(val)}>
                    <div className='h-[1px] w-[10px]' style={{backgroundColor: '#e8e8e8'}}></div>
                    {val.image_url!=='none' &&
                      <div className='flex flex-col justify-center items-center w-[30px] h-[30px] relative'>
                        <Image src={val.image_url} alt="sub category image" fill sizes='30px' priority={true} style={{objectFit: 'contain', borderRadius: 15}}/>
                      </div>
                    }
                    <span className='flex flex-1 flex-col justify-center items-left text-xs text-zinc-700'>{val.description}</span>
                  </div>
                )}
              </div>
            }
          </>
        }
      </div>
      <Popper
        open={openCategory}
        anchorEl={categoryRef.current}
        placement={'bottom-start'}
        transition={true}
        style={{zIndex: 50}}
      >
        {({TransitionProps}) => (
          <Grow {...TransitionProps}>
            <div><CategoriesBrowser value={{}} valueSelected={categorySelected} setOpen={setOpenCategory} includeParts={true}/></div>
          </Grow>
        )}
      </Popper>
      
      {searchBrand.id>0 &&
      <>
        <div className='flex flex-col justify-between items-center py-2 w-full' style={{borderBottom: '1px solid #e8e8e8'}}>
          <div className='flex flex-row w-full justify-center items-center gap-2 px-3 py-2 cursor-pointer hover:bg-slate-100' onClick={()=>setOpenBrand(val=>!val)}>          
            {searchBrand.image_url!=='none' &&
              <div className='flex flex-col justify-center items-center w-[40px] h-[20px] relative'>
                <Image src={searchBrand.image_url} alt="brand image" fill sizes='40px' priority={true} style={{objectFit: 'contain'}}/>
              </div>
            }
            <span className='flex flex-1 flex-col justify-center items-start text-sm text-zinc-700'>{searchBrand.description}</span>
            <ArrowRight sx={{width: 22, height: 22, color: '#6b7280'}}/>
          </div>
        </div>
        <Popper
            open={openBrand}
            anchorEl={categoryRef.current}
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
        </>
      }

      {searchSubCategory.id>0 &&
        <div className='flex flex-col justify-center items-center w-full' style={{borderBottom: '1px solid #e8e8e8'}}>
          <Accordion className='w-full' defaultExpanded={false} square={true} disableGutters={true} sx={{padding: 0, margin: 0, paddingX: 2, boxShadow: 'none'}}>
            <AccordionSummary expandIcon={<ExpandMore />} sx={{padding: 0, margin: 0}}>
              <span className='text-sm w-full'>{"Brand"}</span>
            </AccordionSummary>
            <AccordionDetails sx={{padding: 0, margin: 0, maxHeight: 500, overflowY: 'auto'}}>
              {isLoading2?
                <div className='flex flex-col justify-center items-center h-[50px]'>
                  <CircularProgress size={30} style={{color:"#cbd5e1"}} />
                </div>:
                <>
                  {searchBrands.map(val=>
                    <FormControlLabel key={val.id+val.description} id={'brand-'+val.id}
                      value={val.id} checked={searchSelectedBrands.findIndex(val1=>val1===val.id)>-1}
                      onChange={(event)=>addSearchBrand(event.target.value)}
                      control={<Checkbox size='small'/>} 
                      label={
                        <div className='flex flex-row justify-start items-center w-[150px] overflow-hidden'>
                          {val.image_url!=="none" &&
                            <div className='flex justify-center items-center w-[40px] h-[20px] relative'>
                              <Image src={val.image_url} alt="feature image" fill sizes='40px' priority={true} style={{objectFit: 'contain'}}/>
                            </div>                        
                          }                      
                          <span className="text-xs ml-1 text-zinc-600">{val.description}</span>
                        </div>
                      }
                    />
                  )}
                </>
              }
            </AccordionDetails>
            <AccordionActions sx={{padding: 0, margin: 0, paddingBottom: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Button 
                variant='text' 
                style={{textTransform: 'none', fontSize: 11, color: '#77bd1f'}} 
                startIcon={<Check style={{color: '#77bd1f'}}/>}
                onClick={applyFiltersClicked}
                size='small'
              >Apply Filters</Button>
              <span className='text-xs text-zinc-500 cursor-pointer hover:underline' onClick={removeAllSearchBrands}>Clear All</span>
            </AccordionActions>
          </Accordion>
        </div>
      }

      <div className='flex flex-col justify-center items-center w-full' style={{borderBottom: '1px solid #e8e8e8'}}>
        <Accordion className='w-full' defaultExpanded={false} disableGutters={true} square={true} sx={{padding: 0, margin: 0, paddingX: 2, boxShadow: 'none'}}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{padding: 0, margin: 0}}>
            <span className='text-sm w-full'>{"Price"}</span>
          </AccordionSummary>
          <AccordionDetails sx={{padding: 0, margin: 0}}>
            <div className='flex flex-row justify-between items-center w-full gap-2'>
              <TextField className='w-full'
                id='price-min'
                type='number'
                value={parseFloat(''+searchPriceMin).toFixed(2)}
                label="Min"
                onChange={event=>setSearchPriceMin(event.target.value)} 
                variant={"outlined"}
                size='small'
                InputProps={{
                  startAdornment: <InputAdornment position="start"><span style={{fontSize: 13}}>Rs.</span></InputAdornment>,
                }}
                sx={{input: {textAlign: "right", paddingX: 0}}}
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
              />
              <TextField className='w-full'
                id='price-max'
                type='number'
                value={parseFloat(''+searchPriceMax).toFixed(2)}
                label="Max"
                onChange={event=>setSearchPriceMax(event.target.value)} 
                variant={"outlined"}
                size='small'
                InputProps={{
                  startAdornment: <InputAdornment position="start"><span style={{fontSize: 13}}>Rs.</span></InputAdornment>,
                }}
                sx={{input: {textAlign: "right", paddingX: 0}}}
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
              />
            </div>
          </AccordionDetails>
          <AccordionActions sx={{padding: 0, margin: 0, paddingBottom: 1, paddingTop: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <Button 
              variant='text' 
              style={{textTransform: 'none', fontSize: 11, color: '#77bd1f'}} 
              startIcon={<Check style={{color: '#77bd1f'}}/>}
              onClick={applyFiltersClicked}
              size='small'
            >Apply Filters</Button>
            <span className='text-xs text-zinc-500 cursor-pointer hover:underline' onClick={()=>removeAllSearchPrices()}>Clear All</span>
          </AccordionActions>
        </Accordion>
      </div>

      {searchFeatures.map(val=>
        <div key={val.id+val.description} className='flex flex-col justify-center items-center w-full' style={{borderBottom: '1px solid #e8e8e8'}}>
          <Accordion className='w-full' defaultExpanded={false} disableGutters={true} square={true} sx={{padding: 0, margin: 0, paddingX: 2, boxShadow: 'none'}}>
            <AccordionSummary expandIcon={<ExpandMore />} sx={{padding: 0, margin: 0}}>
              <span className='text-sm w-full'>{val.description}</span>
            </AccordionSummary>
            <AccordionDetails sx={{padding: 0, margin: 0, maxHeight: 400, overflowY: 'auto'}}>
              {val.sub_features.map(val1=>
                <FormControlLabel key={val1.id} id={'sub-feature-'+val1.id}
                  value={val1.id} checked={searchSelectedFeatures.findIndex(val2=>val2.id===val1.id)>-1}
                  onChange={(event)=>addSearchFeature(event.target.value, val.id)}
                  control={<Checkbox size='small'/>} 
                  label={
                    <div className='flex flex-row justify-start items-center w-[150px] overflow-hidden gap-2'>
                      {val1.image_url!=="none" &&
                        <div className='flex justify-center items-center w-[20px] h-[20px] relative bg-white'>
                          <Image src={val1.image_url} alt="feature image" fill sizes='20px' priority={true} style={{objectFit: 'contain', borderRadius: 10}}/>
                        </div>                        
                      }                      
                      <span className="text-xs ml-1 text-zinc-600">{val1.description}</span>
                    </div>
                  }
                />
              )}
            </AccordionDetails>
            <AccordionActions sx={{padding: 0, margin: 0, paddingBottom: 1, paddingTop: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Button 
                variant='text' 
                style={{textTransform: 'none', fontSize: 11, color: '#77bd1f'}} 
                startIcon={<Check style={{color: '#77bd1f'}}/>}
                onClick={applyFiltersClicked}
                size='small'
              >Apply Filters</Button>
              <span className='text-xs text-zinc-500 cursor-pointer hover:underline' onClick={()=>removeAllSearchFeatures(val.id)}>Clear All</span>
            </AccordionActions>
          </Accordion>
        </div>
      )}

      <div className='flex flex-col justify-center items-center w-full' style={{borderBottom: '1px solid #e8e8e8'}}>
        <Accordion className='w-full' defaultExpanded={true} disableGutters={true} square={true} sx={{padding: 0, margin: 0, paddingX: 2, boxShadow: 'none'}}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{padding: 0, margin: 0}}>
            <span className='text-sm w-full'>{"Sort"}</span>
          </AccordionSummary>
          <AccordionDetails sx={{padding: 0, margin: 0}}>
            <div className='flex flex-row justify-between items-center w-full gap-2'>
              <TextField
                className='w-full'
                id='sort-by-2'
                select={true}
                value={searchSortBy}
                onChange={event=>setSearchSortBy(event.target.value)} 
                label='Sort By'
                size='small'
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 11}}}
                InputLabelProps={{style: {fontSize: 15}}}
              >
                <MenuItem className='text-xs' value={"description"}>Description</MenuItem>
                <MenuItem className='text-xs' value={"price"}>Price</MenuItem>
              </TextField>
              <TextField
                className='w-full'
                id='order'
                select={true}
                value={searchOrder}
                onChange={event=>setSearchOrder(event.target.value)} 
                label='Order'
                size='small'
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 11}}}
                InputLabelProps={{style: {fontSize: 15}}}
              >
                <MenuItem className='text-xs' value={"ASC"}>Ascending</MenuItem>
                <MenuItem className='text-xs' value={"DESC"}>Descending</MenuItem>
              </TextField>
            </div>
          </AccordionDetails>
          <AccordionActions sx={{padding: 0, margin: 0, paddingBottom: 1, paddingTop: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <Button 
              variant='text' 
              style={{textTransform: 'none', fontSize: 11, color: '#77bd1f'}} 
              startIcon={<Check style={{color: '#77bd1f'}}/>}
              onClick={applyFiltersClicked}
              size='small'
            >Apply Filters</Button>
            <span className='text-xs text-zinc-500 cursor-pointer hover:underline' onClick={()=>removeAllSearchSort()}>Default</span>
          </AccordionActions>
        </Accordion>
      </div>
    </div>
  )
}

export default ProductsSearch;