import React, { useState, useEffect } from "react";
import styled from '@emotion/styled'
import { Global, keyframes } from "@emotion/react";
import { FaLink, FaSpinner, FaCheckCircle, FaExclamationCircle, FaCopy, FaHistory } from 'react-icons/fa'

const API_URL = process.env.REACT_APP_BACKEND

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`
const slideDown = keyframes`
  from { opacity: 0; transform: translate(-50%, -100%); }
  to { opacity: 1; transform: translate(-50%, 20px); }
`
const slideUp = keyframes`
  from { opacity: 1; transform: translate(-50%, 20px); }
  to { opacity: 0; transform: translate(-50%, -100%); }
`


const GlobalStyles = () => (
  <Global
    styles={`
      body {
        margin: 0;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
                     'Helvetica Neue', Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #333;
        background-color: #f0f4f8; 
      }
    `}
  />
)

const AppLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8 0%, #e0e7ee 100%);
`

const Header = styled.header`
  width: 100%;
  padding: 20px 40px;
  background: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
`

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 8px;
`

const Footer = styled.footer`
  width: 100%;
  padding: 25px 40px;
  text-align: center;
  background: #ffffff;
  color: #9da8b7;
  font-size: 0.9rem;
  box-sizing: border-box;
  border-top: 1px solid #e0e7ee;
  margin-top: auto;
`

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; 
  flex-grow: 1;
  padding: 60px 20px;
  width: 100%;
  box-sizing: border-box;
`

const NotificationWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 16px 30px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 9999;
  background: ${props => (props.type === 'success' ? '#28a745' : '#dc3545')};
  animation: ${props => (props.show ? slideDown : slideUp)} 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  visibility: ${props => (props.show ? 'visible' : 'hidden')};
  transition: visibility 0.5s;
`

const ShortenerWrapper = styled.div`
  background: #ffffff;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  animation: ${fadeIn} 0.7s ease-out;
  box-sizing: border-box;
  border: 1px solid #e0e7ee;
  margin-bottom: 40px;
`

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 32px 0;
  letter-spacing: -1px;
`

const Form = styled.form`
  display: flex;
  width: 100%;
  margin-bottom: 25px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  border-radius: 15px;
  overflow: hidden;
`

const Input = styled.input`
  flex-grow: 1;
  padding: 18px 25px;
  font-size: 17px;
  border: none;
  background-color: #f7f9fc;
  border-radius: 15px 0 0 15px;
  outline: none;
  transition: all 0.3s ease;
  &:focus {
    background-color: #ffffff;
    box-shadow: inset 0 0 0 2px #2575fc;
  }
  &::placeholder { color: #9da8b7; }
`

const Button = styled.button`
  padding: 18px 30px;
  font-size: 17px;
  font-weight: 700;
  color: white;
  background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
  border: none;
  border-radius: 0 15px 15px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  &:hover {
    opacity: 0.95;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(37, 117, 252, 0.3);
  }
  &:active { transform: translateY(0); box-shadow: none; }
  &:disabled {
    background: #cdd4da;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.8;
  }
`

const LoadingSpinner = styled(FaSpinner)`
  animation: ${rotate} 1s linear infinite;
`

const ResultBox = styled.div`
  background: #e6ffed;
  border: 1px solid #a7e1b5;
  color: #1a6d2c;
  padding: 18px 25px;
  border-radius: 12px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: ${props => (props.show ? 1 : 0)};
  transform: ${props => (props.show ? 'translateY(0)' : 'translateY(-10px)')};
  transition: opacity 0.4s ease, transform 0.4s ease;
  word-break: break-all;
  a {
    color: #007d2f;
    text-decoration: none;
    font-weight: 700;
    transition: color 0.2s ease;
    &:hover { color: #005a22; text-decoration: underline; }
  }
`

const ErrorMessage = styled(ResultBox)`
  background: #ffebeb;
  border-color: #fca7a7;
  color: #a72d2d;
`

const HistoryWrapper = styled.div`
  width: 100%;
  max-width: 600px; /* ⭐️ ขนาดเดียวกับ ShortenerWrapper */
  background: #ffffff;
  padding: 30px 40px;
  border-radius: 20px;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  border: 1px solid #e0e7ee;
  animation: ${fadeIn} 0.7s ease-out 0.2s;
  animation-fill-mode: backwards;
`

const HistoryTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 24px 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`

const HistoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
`

const HistoryItem = styled.li`
  display: flex;
  flex-direction: column;
  padding: 15px 0;
  border-bottom: 1px solid #e0e7ee;
  
  &:last-child {
    border-bottom: none;
  }
`

const ShortLink = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;

  a {
    color: #2575fc;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`

const OriginalLink = styled.div`
  font-size: 0.9rem;
  color: #9da8b7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const CopyButton = styled.button`
  background: none;
  border: none;
  color: #9da8b7;
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  transition: background-color 0.2s ease, color 0.2s ease;
  
  &:hover {
    background-color: #f0f4f8;
    color: #2575fc;
  }
`

const NoHistory = styled.div`
  text-align: center;
  color: #9da8b7;
  padding: 20px 0;
`

const AppHeader = () => (
  <Header>
    <Logo>
      <FaLink /> Shorty
    </Logo>
  </Header>
);

function App() {
  return (
    <AppLayout>
      <AppHeader />
      <MainContent>

      </MainContent>
    </AppLayout>
  )
}

export default App;
