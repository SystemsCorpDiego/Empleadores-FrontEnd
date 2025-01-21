// MuiCarousel.js
import React, { useState, useEffect } from 'react';
import { IconButton, Box } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

export const CarouselImg = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgagesUrl, setImagesUrl] = useState([])

  useEffect(()=>{
    const arrImg  = []
    images.forEach(element => {
      arrImg.push(URL.createObjectURL(element))
    });
    setImagesUrl(arrImg)

    console.log(imgagesUrl)
    console.log(imgagesUrl[0])
  },[images])

  useEffect(() => {
    
    const intervalId = setInterval(() => {
      goToNextSlide();
    }, 3000);
    return () => {
      clearInterval(intervalId);
    };
  }, [currentIndex, images.length]);


  

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
  };

  return (
    <Box 
      //{...handlers}
      sx={{
        position: 'relative',
        width: '80%',
        margin: 'auto',
        overflow: 'hidden',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >

      <Box
        component="img"
        src={imgagesUrl[currentIndex]}
        alt={`slide-${currentIndex}`}
        sx={{
          width: '100%',
          height: 'auto',
          display: 'block',
          borderRadius: 2,
        }}
      />
      {/* Botón de anterior */}
      <IconButton
        onClick={goToPrevSlide}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '10px',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
        }}
      >
        <ArrowBackIos />
      </IconButton>
      {/* Botón de siguiente */}
      <IconButton
        onClick={goToNextSlide}
        sx={{
          position: 'absolute',
          top: '50%',
          right: '10px',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
        }}
      >
        <ArrowForwardIos />
      </IconButton>
    </Box>
  );
};


