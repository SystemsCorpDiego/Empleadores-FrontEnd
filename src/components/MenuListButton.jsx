import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { NavLink } from 'react-router-dom';
import { Typography } from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { Box } from '@mui/system';
import { useState } from 'react';

export const MenuListButton = ({
  nameAccordionSumary,
  setOpen,
  nameAndIcon,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = () => {
    setExpanded(!expanded);
  };

  const handleLinkClick = () => {
    setExpanded(false);
  };
  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
      sx={{
        background: 'none',
        boxShadow: 'none',
        border: 'none',
        '&:before': {
          display: 'none',
        },
      }}
      className="accordion"
    >
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon
            sx={{
              color: '#1a76d2',
            }}
          />
        }
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{
          background: 'none',
          border: 'none',
          '& .MuiAccordionSummary-content': {
            margin: 0,
          },
          margin: '-10px 0px -10px 0px',
        }}
      >
        <Typography
          sx={{
            color: '#1a76d2',
          }}
        >
          <LibraryBooksIcon />
          <span
            style={{
              margin: '-5px 0px -25px 20px',
            }}
          >
            {nameAccordionSumary}
          </span>
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          background: 'none',
          border: 'none',
        }}
      >
        {nameAndIcon.map((item, i) => {
          return (
            <Box
              sx={{
                marginLeft: '10px',
                color: '#1a76d2',
              }}
              key={i}
            >
              <NavLink
                to={item.ruta}
                onClick={() => {
                  handleLinkClick();
                  setOpen(false);
                }}
                className="icon-link"
              >
                {item.icon}
                <span
                  style={{
                    marginLeft: 10,
                    color: '#1a76d2',
                  }}
                >
                  {' '}
                  {item.nombre}
                </span>
              </NavLink>
            </Box>
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
};
