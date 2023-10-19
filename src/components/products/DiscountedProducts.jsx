import { useEffect, useState } from 'react';
import axios from "axios";
import { CircularProgress, IconButton, Typography } from '@mui/material';
import DiscountedProduct from './DiscountedProduct';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

const DiscountedProducts = ({width, selectValue}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(false);

  const [discounted, setDiscounted] = useState([]);
  const [itemWidth, setItemWidth] = useState(300);
  const [verticalMode, setVerticalMode] = useState(false);

  const [discountedRpp, setDiscountedRpp] = useState(10);
  const [discountedNop, setDiscountedNop] = useState(1);
  const [discountedPage, setDiscountedPage] = useState(1);

  useEffect(() => {
    setIsLoading(false);
    try {
      const search_data = localStorage.getItem('buyer_home_discounted_data');
      if(search_data!==null){
        setDiscounted(JSON.parse(search_data));
      }
      const search_nop = localStorage.getItem('buyer_home_discounted_nop');
      if(search_nop!==null) {
        setDiscountedNop(JSON.parse(search_nop));
      }
      const search_page = localStorage.getItem('buyer_home_discounted_page');
      if(search_page!==null) {
        setDiscountedPage(JSON.parse(search_page));
      }
    } 
    catch(e) {
      console.log("get storage error - "+e);
    }
  }, []);

  useEffect(() => {
    if(width>=1152){
      setItemWidth((1100/3)-10);
      setVerticalMode(false);
      setDiscountedRpp(9);
    }
    else if(width>=1024 && width<1152){
      setItemWidth((width/3)-30);
      setVerticalMode(false);
      setDiscountedRpp(9);
    }
    else if(width>=768 && width<1024){
      setItemWidth((width/2)-40);
      setVerticalMode(false);
      setDiscountedRpp(6);
    }
    else if(width>=640 && width<768){
      setItemWidth((600));
      setVerticalMode(false);
      setDiscountedRpp(6);
    }
    else if(width>=370 && width<640){
      setItemWidth((width)-40);
      setVerticalMode(false);
    }
    else{
      setItemWidth((width)-40);
      setVerticalMode(true);
      setDiscountedRpp(4);
    }
  }, [width]);

  useEffect(() => {
    getSearchData(1);
  }, [discountedRpp]);
  

  async function getSearchData(page){
    if(page>=1 && page<=discountedNop){
      setIsLoading(true);
      setServerError(false);
      try{
        var error = false;
        var search_data = {};
        if(!error){
          const response = await axios.post("/api/inventory/discounted", {
            search_data: search_data,
            rpp: parseInt(""+discountedRpp),
            page: page,
          });
          var index = 1;
          const values = [];
          response.data.data.data.map(val => {
            ++index;
            var imageUrl = "";
            if(val.image_url==="none"){
              imageUrl = "none";
            }
            else{
              imageUrl = "http://tm-web.effisoftsolutions.com/"+val.image_url;
            }
            var discountedPrice = val.price;
            if(val.discount>0){
              discountedPrice = val.price - ((val.price*val.discount)/100);
            }
            values.push({
              index: index,
              id: val.id,
              category_id: val.category_id,
              category_description: val.category.description,
              sub_category_id: val.sub_category_id,
              sub_category_description: val.sub_category.description,
              brand_id: val.brand_id,
              brand_description: val.brand.description,
              model_id: val.model_id,
              model_description: val.model.description,
              code: val.code,
              heading: val.heading,
              short_description: val.short_description,
              description: val.description,
              price: val.price,
              discount: val.discount,
              discounted_price: discountedPrice,
              quantity_discount_amount: val.quantity_discount_amount,
              quantity_discount: val.quantity_discount,
              quantity_free_issue_amount: val.quantity_free_issue_amount,
              quantity_free_issue: val.quantity_free_issue,
              order_total_discount_amount: val.order_total_discount_amount,
              order_total_discount: val.order_total_discount,
              free_shipping: val.free_shipping,
              featured: val.featured,
              status: val.status,
              image_url: imageUrl,
            });
          });
          setDiscounted(values);
          setDiscountedNop(response.data.data.nop);
          setDiscountedPage(page);
  
          try {
            localStorage.setItem('buyer_home_discounted_data', JSON.stringify(values));
            localStorage.setItem('buyer_home_discounted_nop', JSON.stringify(response.data.data.nop));
            localStorage.setItem('buyer_home_discounted_page', JSON.stringify(page));
          } 
          catch (e) {
            console.log("put storage error");
          }
        }
      }
      catch(error){
        console.log(error);
      }
      finally{
        setIsLoading(false);
      }
    }
  }

  return (
    <>
      {isLoading?
        <div className='flex flex-col items-center justify-center w-full h-[400px] lg:h-[300px] sm:h-[300px] xs:h-[300px] mb-10 mt-10 bg-zinc-100'>
          <CircularProgress size={30} style={{color:"#71717a"}} />
        </div>:
        <div className='bg-white flex flex-col w-full mb-10 mt-10'>
          <div className='flex flex-row justify-between items-center w-full px-1 xs:px-2 mb-5'>
          <span className='text-sm xs:text-md md:text-md font-semibold text-zinc-600'>Discounted</span>
            {discountedNop>1 &&
              <div className='flex flex-row justify-center items-center gap-2'>
                <IconButton aria-label="delete" size="small" onClick={()=>getSearchData(discountedPage-1)}>
                  <KeyboardArrowLeft size={20} />
                </IconButton>
                <Typography sx={{fontSize: 12, color: "#444"}}>{`${discountedPage} of ${discountedNop}`}</Typography>
                <IconButton aria-label="delete" size="small" onClick={()=>getSearchData(discountedPage+1)}>
                  <KeyboardArrowRight size={20} />
                </IconButton>
              </div>
            }
          </div>
          <div className='relative w-full'>
            <div className='flex flex-row justify-center md:justify-between items-center flex-wrap gap-5'>
              {discounted.map((val)=>
                <DiscountedProduct key={val.id+val.heading} val={val} itemWidth={itemWidth} vertical={verticalMode} selectValue={selectValue}/>
              )}
            </div>
          </div>
        </div>
      }
  </>
  )
}

export default DiscountedProducts;