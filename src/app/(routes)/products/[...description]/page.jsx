'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";
import { useSession } from 'next-auth/react';
import useWindowDimensions from '@/hooks/useWindowDimension';
import { useCartContext } from '@/providers/CartContextProvider';
import { ArrowBack, CameraAlt, ControlPoint, RemoveCircleOutline, ShoppingCart } from '@mui/icons-material';
import Image from 'next/image';
import { Button, CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material';
import FeaturedProducts from '@/components/products/FeaturedProducts';
import DiscountedProducts from '@/components/products/DiscountedProducts';
import HomeBannerSmall from '@/components/banners/HomeBannerSmall';
import Navbar from '@/components/headers/Navbar';

const Products = ({params}) => {
  const {cartItems, setCartItems} = useCartContext();
  const router = useRouter();
  const {data: session, status} = useSession();
  const [serverError, setServerError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const { width=500, height=500 } = useWindowDimensions();

  const [item, setItem] = useState(null);

  const [editId, setEditId] = useState("");
  const [editType, setEditType] = useState('item');
  const [editStatus, setEditStatus] = useState('active');
  const [editPartNumber, setEditPartNumber] = useState("");
  const [editBarcode, setEditBarcode] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editHeading, setEditHeading] = useState("");
  const [editShortDescription, setEditShortDescription] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [editPrice, setEditPrice] = useState(0.0);
  const [editDiscount, setEditDiscount] = useState(0.0);
  const [editDiscountedAmount, setEditDiscountedAmount] = useState(0.0);
  const [editQuantityDiscountAmount, setEditQuantityDiscountAmount] = useState(0);
  const [editQuantityDiscount, setEditQuantityDiscount] = useState(0);
  const [editQuantityFreeIssueAmount, setEditQuantityFreeIssueAmount] = useState(0);
  const [editQuantityFreeIssue, setEditQuantityFreeIssue] = useState(0);
  const [editOrderTotalDiscountAmount, setEditOrderTotalDiscountAmount] = useState(0.0);
  const [editOrderTotalDiscount, setEditOrderTotalDiscount] = useState(0);
  const [editInhand, setEditInhand] = useState(0);
  const [editFeatured, setEditFeatured] = useState("no");
  const [editFreeShipping, setEditFreeShipping] = useState("no");

  const [editCategory, setEditCategory] = useState({id: 0, description: "Please Select"});
  const [editSubCategory, setEditSubCategory] = useState({id: 0, description: "Please Select"});
  const [editSeller, setEditSeller] = useState({id: 0, description: "Please Select"});
  const [editBrand, setEditBrand] = useState({id: 0, description: "Please Select"});
  const [editModel, setEditModel] = useState({id: 0, description: "Please Select", brandId: 0, brandDescription: "Please Select"});

  const [editImages, setEditImages] = useState([]);

  const [editItemFeatures, setEditItemFeatures] = useState([]);

  const [banners, setBanners] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);

  const [quantity, setQuantity] = useState(1);

  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [[x, y], setXY] = useState([0, 0]);
  const magnifierHeight = 300;
  const magnifieWidth = 300;
  const zoomLevel = 2;
  const [imgSize, setImageSize] = useState({width: 400, height: 400});

  useEffect(() => {
    setServerError(false);
    setIsLoading(false);
    setIsLoading1(false);
    if(width>=1024){
      setImageSize({width: 400, height: 400});
    }
    else if(width>=768 && width<1024){
      setImageSize({width: 300, height: 300});
    }
    else if(width>=640 && width<768){
      setImageSize({width: 300, height: 300});
    }
    else if(width>=440 && width<640){
      setImageSize({width: 400, height: 400});
    }
    else{
      setImageSize({width: 300, height: 300});
    }
    getBanners();
  }, [width]);

  async function getBanners(){
    try{
      setServerError(false);
      setIsLoading1(true);
      var error = false;
      if(!error){
        const response = await axios.post("/api/banners/active", {});
        const values = [];
        var index = 0;
        var data = response.data.data.rows;
        data.map(val => {
          ++index;
          var imageUrl = "";
          if(val.image_url==="none"){
            imageUrl = "none";
          }
          else{
            imageUrl = "http://tm-web.effisoftsolutions.com/"+val.image_url;
          }var position = {};
          if(val.position=="top_start"){
            position = {
              position: 'absolute',
              top: val.v_position,
              left: val.h_position,
              zIndex: 50,
              backgroundColor: val.background_color,
              backgroundOpacity: val.background_opacity,
            };
          }
          else if(val.position=="top_end"){
            position = {
              position: 'absolute',
              top: val.v_position,
              right: val.h_position,
              zIndex: 50,
              backgroundColor: val.background_color,
              backgroundOpacity: val.background_opacity,
            };
          }
          else if(val.position=="bottom_start"){
            position = {
              position: 'absolute',
              bottom: val.v_position,
              left: val.h_position,
              zIndex: 50,
              backgroundColor: val.background_color,
              backgroundOpacity: val.background_opacity,
            };
          }
          else if(val.position=="bottom_end"){
            position = {
              position: 'absolute',
              bottom: val.v_position,
              right: val.h_position,
              zIndex: 50,
              backgroundColor: val.background_color,
              backgroundOpacity: val.background_opacity,
            };
          }
          else if(val.position=="center"){
            position = {
              position: 'absolute',
              top: val.v_position+'%',
              left: val.h_position+'%',
              zIndex: 50,
              backgroundColor: val.background_color,
              backgroundOpacity: val.background_opacity,
            };
          }
          var styles = {
            headingColor: val.heading_color,
            subHeadingColor: val.sub_heading_color,
            contentColor: val.content_color,
          };
          var linkStyles = {
            link_background_color: val.link_background_color,
            link_text_color: val.link_text_color,
          };
          values.push({
            index: index,
            id: val.id,
            position: position,
            styles: styles,
            linkStyles: linkStyles,
            content: val.content,
            description: val.description,
            heading: val.heading,
            sub_heading: val.sub_heading,
            link: val.link,
            link_only: val.link_only,
            show_caption: val.show_caption,
            size: val.size,
            status: val.status,
            image_url: imageUrl,
          });
        });
        setBanners(values);
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
    if(params.description[0]){
      loadItem(params.description[0]);
    }
  }, []);

  const loadItem = async (url_string) => {
    setIsLoading(true);
    setServerError(false);
    try{
      let decoded = decodeURIComponent(url_string);
      const response = await axios.post("/api/inventory/find-by-url", {
        url_string: decoded
      });
      let val = response.data.data;
      console.log(val);
      setItem(val);
      setEditId(val.id);
      setEditType(val.type);
      setEditStatus(val.status);
      setEditPartNumber(val.part_number);
      setEditBarcode(val.barcode);
      setEditCode(val.code);
      setEditHeading(val.heading);
      setEditShortDescription(val.short_description);
      setEditDescription(val.description);

      setEditPrice(val.price);
      setEditDiscount(val.discount);
      var discounted = val.price - (val.price*val.discount)/100;
      setEditDiscountedAmount(discounted);

      setEditQuantityDiscountAmount(val.quantity_discount_amount);
      setEditQuantityDiscount(val.quantity_discount);
      setEditQuantityFreeIssueAmount(val.quantity_free_issue_amount);
      setEditQuantityFreeIssue(val.quantity_free_issue);
      setEditOrderTotalDiscountAmount(val.order_total_discount_amount);
      setEditOrderTotalDiscount(val.order_total_discount);
      setEditFeatured(val.featured);
      setEditFreeShipping(val.free_shipping);

      setEditSeller({id: val.seller_id, description: val.online_user.first_name+" "+val.online_user.last_name});
      setEditCategory({id: val.category_id, description: val.category.description});
      setEditSubCategory({id: val.sub_category_id, description: val.sub_category.description, category_id: val.category_id, category_description: val.category.description});
      setEditBrand({id: val.brand_id, description: val.brand.description});
      setEditModel({id: val.model_id, description: val.model.description, brand_id: val.brand_id, brand_description: val.brand.description});

      setEditInhand(val.inhand);

      var val2 = [];
      var index = 1;
      if(val.image_url!=="none"){
        val2.push({id: index++, imageUrl: " https://tm-web.effisoftsolutions.com/"+val.image_url});
      }
      var val1 = val.inventory_images;
      val1.map(val3=>{
        val2.push({id: index++, imageUrl: " https://tm-web.effisoftsolutions.com/"+val3.image_url});
      });

      setEditImages(val2);
      if(val2.length>0){
        setSelectedImage(val2[0]);
      }

      setEditItemFeatures(val.inventory_features);
    }
    catch(error){
      setServerError(true);
    }
    finally{
      setIsLoading(false);
    }
  };

  const productClicked = (val) => {
    router.push(`/products/view/`);
  };

  useEffect(() => {
    //console.log(cartItems);
  }, [cartItems]);

  const addToCart = (item) => {
    
  };
  

  return (
    <>
      <Navbar search={false} applyFilters={null}/>
      <div className='form_container'>
        <div className='form_container_xtra_large'>
          <div className='mt-10 py-3 flex flex-row justify-start items-center w-full'>
            <Button 
              variant='text' 
              style={{textTransform: 'none', color: '#333', fontSize: 16}} 
              startIcon={<ArrowBack />}
              onClick={()=>router.back()}
            >Go Back</Button>
          </div>
          {isLoading?
            <div className='flex flex-col items-center justify-center w-full h-[400px] lg:h-[300px] sm:h-[300px] xs:h-[300px] mb-10 bg-zinc-100'>
              <CircularProgress size={30} style={{color:"#71717a"}} />
            </div>:
            <>
              {item &&
                <div className='flex flex-col sm:flex-row justify-center sm:justify-between items-center sm:items-start w-full mb-10'>
                  <div className='flex flex-col justify-center items-center'>
                    <div className='flex flex-col justify-center items-center w-[300px] xs:w-[400px] sm:w-[300px] md:w-[300px] lg:w-[400px] h-[300px] xs:h-[400px] sm:h-[300px] md:h-[300px] lg:h-[400px] relative'>
                      {selectedImage ? 
                        <>
                          <img 
                            src={selectedImage.imageUrl} 
                            alt="product image" 
                            style={{objectFit: 'cover', width: imgSize.width, height: imgSize.height}}
                            onMouseEnter={(e) => {
                              const elem = e.currentTarget;
                              const { width, height } = elem.getBoundingClientRect();
                              setSize([width, height]);
                              setShowMagnifier(true);
                            }}
                            onMouseLeave={() => {
                              setShowMagnifier(false);
                            }}
                            onMouseMove={(e) => {
                              // update cursor position
                              const elem = e.currentTarget;
                              const { top, left } = elem.getBoundingClientRect();

                              // calculate cursor position on the image
                              const x = e.pageX - left - window.pageXOffset;
                              const y = e.pageY - top - window.pageYOffset;
                              setXY([x, y]);
                            }}
                          />
                          <div
                            style={{
                                display: showMagnifier ? "" : "none",
                                  position: "absolute",

                                // prevent magnifier blocks the mousemove event of img
                                pointerEvents: "none",
                                // set size of magnifier
                                height: `${magnifierHeight}px`,
                                width: `${magnifieWidth}px`,
                                // move element center to cursor pos
                                top: `${y - magnifierHeight / 2}px`,
                                left: `${x - magnifieWidth / 2}px`,
                                opacity: "1", // reduce opacity so you can verify position
                                border: "1px solid lightgray", // show the border of magnifier
                                backgroundColor: "white",
                                backgroundImage: `url('${selectedImage.imageUrl}')`,
                                backgroundRepeat: "no-repeat",
                                backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
                                backgroundPositionX: `${-x * zoomLevel + magnifieWidth / 2}px`,
                                backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,
                            }}
                          />
                        </>:
                        <CameraAlt sx={{width: 120, height: 120, color: '#cbd5e1'}}/>
                      }
                    </div>
                    <div className='flex flex-row justify-center items-center gap-2 mt-3 w-full'>
                      {editImages.map(val=>
                        <div key={val.imageUrl} className="flex flex-row justify-center items-center w-[100px] h-[100px] relative cursor-pointer" style={{borderBottom: val.id===selectedImage.id?'3px solid #77bd1f':'3px solid #fff'}} onClick={()=>setSelectedImage(val)}>
                          <img src={val.imageUrl} alt="product images" style={{objectFit: 'contain', width: 100, height: 100}}/>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='flex flex-col justify-start items-start flex-1 pl-3 pr-3 xl:pr-0 mt-3 sm:mt-0'>
                    <span className='flex flex-col w-full text-sm font-bold pb-2' style={{borderBottom: '1px solid #D1D5DB'}}>{item.heading}</span>
                    <span className='flex flex-col w-full text-[13px] font-semibold break-words mt-2'>{item.short_description}</span>
                    <span className='flex flex-col w-full text-[13px] font-semibold break-words mt-3'>{"Description:"}</span>
                    <span className='flex flex-col w-full text-[13px] font-normal break-words mt-2 h-[80px] overflow-hidden'>{item.description}</span>
                    <div className='flex flex-row overflow-hidden gap-2 flex-wrap mt-3 mb-3 w-full'>
                      {item.featured==="yes"&&<span className='flex flex-col justify-center items-center h-[28px] px-2 bg-yellow-200 text-yellow-800 rounded text-[12px] font-bold'>Featured</span>}
                      {item.free_shipping==="yes"&&<span className='flex flex-col justify-center items-center h-[28px] px-2 bg-purple-200 text-purple-800 rounded text-[12px] font-bold'>Free Shipping</span>}
                      {item.quantity_discount_amount>0&&<span className='flex flex-col justify-center items-center h-[28px] px-2 bg-emerald-200 text-emerald-800 rounded text-[12px] font-bold'>{`Buy ${item.quantity_discount_amount} to get ${item.quantity_discount}% off!`}</span>}
                      {item.quantity_free_issue_amount>0&&<span className='flex flex-col justify-center items-center h-[28px] px-2 bg-blue-200 text-blue-800 rounded text-[12px] font-bold'>{`Buy ${item.quantity_free_issue_amount} to get ${item.quantity_free_issue} free!`}</span>}
                      {item.order_total_discount_amount>0&&<span className='flex flex-col justify-center items-center h-[28px] px-2 bg-pink-200 text-pink-800 rounded text-[12px] font-bold'>{`${item.order_total_discount}% off for orders more than Rs. ${parseFloat(item.order_total_discount_amount).toFixed(2)}!`}</span>}
                    </div>
                    <div className='flex flex-row justify-end items-end w-full pl-3 pr-3 xl:pr-0'>
                      {parseFloat(item.discount)>0.0 ?
                        <div className='flex flex-col justify-center items-end w-[110px] mr-3'>
                          <span className='text-sm font-bold text-red-400'>{item.discount+"% off"}</span>
                          <span className='text-sm font-semibold text-zinc-600 line-through'>{"Rs. "+parseFloat(item.price).toFixed(2)}</span>
                        </div>:<div></div>
                      }
                      <div className='flex flex-row justify-between items-center px-2 py-2 w-[140px]' style={{border: '1px solid #10B981'}}>
                        <span className='font-semibold text-sm text-emerald-600'>{"Rs."}</span>
                        <span className='text-sm font-semibold text-emerald-600'>{parseFloat(''+editDiscountedAmount).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className='flex flex-col justify-center items-end w-full mt-10'>
                      <div className='flex flex-row justify-center items-center gap-1 w-[200px]'>
                        <IconButton 
                          size='small'
                        ><RemoveCircleOutline style={{color: '#77bd1f', width: 35, height: 35}}/></IconButton>
                        <TextField className='w-full'
                          id='quantity'
                          type='number'
                          value={quantity}
                          label="Quantity"
                          onChange={event=>setQuantity(event.target.value)} 
                          variant={"outlined"}
                          size='small'
                          InputProps={{
                            endAdornment: <InputAdornment position="start"><span style={{fontSize: 13}}>nos</span></InputAdornment>,
                          }}
                          sx={{input: {textAlign: "right", paddingX: 0}}}
                          inputProps={{style: {fontSize: 13}}}
                          SelectProps={{style: {fontSize: 13}}}
                          InputLabelProps={{style: {fontSize: 15}}}
                        />
                        <IconButton 
                          size='small'
                        ><ControlPoint style={{color: '#77bd1f', width: 35, height: 35}}/></IconButton>
                      </div>
                      <div className='flex flex-row justify-center items-center gap-1 w-[200px] mt-2'>
                        <Button 
                          variant='contained' 
                          style={{textTransform: 'none', fontSize: 11, color: '#fff', width: 200}} 
                          startIcon={<ShoppingCart style={{color: '#fff'}}/>}
                        >Add To Cart</Button>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </>
          }
          {banners.length>=2 &&
            <HomeBannerSmall width={width} banner={banners[2]}/>
          }
          <div className='mb-10'></div>
          <FeaturedProducts limit={20} width={width} selectValue={productClicked}/>
          {banners.length>=1 &&
            <HomeBannerSmall width={width} banner={banners[1]}/>
          }
          <DiscountedProducts limit={20} width={width} selectValue={productClicked}/>
        </div>
      </div>
    </>
  );
};

export default Products;