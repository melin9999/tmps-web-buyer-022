'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useWindowDimensions from '@/hooks/useWindowDimension';
import HomeSlider from '@/components/sliders/HomeSlider';
import FeaturedCategories from '@/components/categories/FeaturedCategories';
import FeaturedProducts from '@/components/products/FeaturedProducts';
import axios from 'axios';
import HomeBannerLarge from '@/components/banners/HomeBannerLarge';
import DiscountedProducts from '@/components/products/DiscountedProducts';
import HomeBannerSmall from '@/components/banners/HomeBannerSmall';
import SparePartsCategories from '@/components/categories/SparePartsCategories';
import FeaturedBrands from '@/components/brands/FeaturedBrands';
import Navbar from '@/components/headers/Navbar';

const RootPage = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState(false);
  const [isLoading1, setIsLoading1] = useState(true);
  const { width=500, height=500 } = useWindowDimensions();

  const [banners, setBanners] = useState([]);

  useEffect(() => {
    getBanners();
  }, []);

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

  const categoryClicked = (val) => {
    router.push(`/products/search/category/${val.description}/sub-category/all/`);
  };

  const productClicked = (val) => {
    //router.push(`/products/view/`);
  };

  const bannerClicked = (val) => {
    //router.push(`/products/view/`);
  };

  const discountedClicked = (val) => {
    //router.push(`/products/view/`);
  };

  const brandClicked = (val) => {
    router.push(`/products/search/brand/${val.description}/`);
  };

  return (
    <>
      <Navbar search={false} applyFilters={null}/>
      <div className='pt-[75px] flex w-full max-w-7xl flex-col justify-center items-center' style={{minHeight: (height-80)}}>
        <HomeSlider width={width}/>
        <FeaturedCategories limit={20} width={width} selectValue={categoryClicked}/>
        <FeaturedProducts limit={20} width={width} selectValue={productClicked}/>
        {banners.length>0 &&
          <HomeBannerLarge width={width} banner={banners[0]} selectValue={bannerClicked}/>
        }
        <DiscountedProducts limit={20} width={width} selectValue={discountedClicked}/>
        {banners.length>=1 &&
          <HomeBannerSmall width={width} banner={banners[1]}/>
        }
        <SparePartsCategories limit={20} width={width} selectValue={categoryClicked}/>
        <FeaturedBrands limit={20} width={width} selectValue={brandClicked}/>
      </div>
    </>
  );
};

export default RootPage;