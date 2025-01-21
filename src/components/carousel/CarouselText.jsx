import React, { useEffect, useState } from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export const CarouselText = ({ contenido }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      goToNextSlide();
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [currentIndex, contenido.length]);

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % contenido.length);
  };

  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + contenido.length) % contenido.length,
    );
  };

  return (
    <div>
      {contenido.length > 0 && (
        <div>
          <div
            style={{
              height: '400px',
              borderRadius: '10px',
              width: '100%',
              paddingTop: '10px',
              boxShadow: '0px 0px 10px 0px #1A76D2',
            }}
          >
            <h2
              style={{
                margin: '10px 0px 0px 15px',
              }}
            >
              Novedades
            </h2>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '-50px',
              }}
            >
              <h2
                style={{
                  color: '#1A76D2',
                  marginBottom: '20px',
                }}
              >
                {contenido[currentIndex].titulo}
              </h2>
              <p
                style={{
                  width: '50%',
                  margin: '0 auto',
                  textAlign: 'center',
                }}
              >
                {contenido[currentIndex].cuerpo}
              </p>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '-220px',
            }}
          >
            <span
              onClick={goToPrevSlide}
              style={{
                cursor: 'pointer',
                marginLeft: '100px',
                marginTop: '-110px',
              }}
            >
              <ArrowBackIosNewIcon
                sx={{
                  fontSize: '50px',
                  color: '#1A76D2',
                }}
              />
            </span>
            <div
              style={{
                display: 'flex',
                marginTop: '100px',
              }}
            >
              {contenido.map((_, index) => (
                <span
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  style={{
                    cursor: 'pointer',
                    margin: '0 5px',
                    fontSize: '30px',
                    color: index === currentIndex ? '#1A76D2' : '#ccc',
                  }}
                >
                  &bull;
                </span>
              ))}
            </div>
            <span
              onClick={goToNextSlide}
              style={{
                cursor: 'pointer',
                marginRight: '100px',
                marginTop: '-110px',
              }}
            >
              <ArrowForwardIosIcon
                sx={{
                  fontSize: '50px',
                  color: '#1A76D2',
                }}
              />
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
