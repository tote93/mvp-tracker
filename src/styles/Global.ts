import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *, *::after, *::before {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: 'Jost', sans-serif;
    //font-family: 'Nunito', sans-serif;
    //font-family: 'Roboto', sans-serif;
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  /* :root {
    --test: '#fff';
  } */

  html {
    font-size: 62.5%;
  }

  body {
    font-size: 1.2rem;
  }

  a {
    text-decoration: none;
  }

  button, input {
    outline: 0;
    border: 0;
  }

  button {
    cursor: pointer;
  }
`;
