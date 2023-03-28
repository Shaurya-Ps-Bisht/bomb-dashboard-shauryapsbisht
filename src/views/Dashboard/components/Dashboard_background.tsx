import React from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';

import bg1 from '../../../assets/img/dashboard_1.png';
import bg2 from '../../../assets/img/dashboard_2.png';
import bg3 from '../../../assets/img/dashboard_3.svg';

const MyComponent = createGlobalStyle`
body{
  height: 100vh; 
  background-image: url(${bg1}), url(${bg2}), url(${bg3}); 
  background-size: cover, 50% , cover !important;
  background-position: 50% 50%, 50% 100%, center !important; 
  background-repeat: no-repeat; 
}
`;

// const MyComponent = () => {
//   return <Wrapper>{}</Wrapper>;
// };

export default MyComponent;
