import styled from 'styled-components'
import { Link } from 'react-router-dom'
import LogoImg from '/src/assets/Logo.jpg'
import { FaGithub } from 'react-icons/fa'
import { motion } from 'framer-motion'
import AuthHeader from '../Auth/AuthHeader'
import { Button } from '@aws-amplify/ui-react'

const seaGreen = '#068743';

const Nav = styled(motion.nav)`
  padding: 1.2rem;
  background-color: #2a3b4c;
  display: flex;
  align-items: center;
  box-shadow: 0 8px 16px rgba(42, 59, 76, 0.2);
  min-height: 70px;
  backdrop-filter: blur(10px);
  border-radius: 20px;
  margin: 0.6rem;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(66, 135, 245, 0.3);
`

const Logo = styled(motion.img)`
  height: 65px;
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  order: 2;
  margin-left: 1.2rem;
  margin-right: 1.2rem;
  border-radius: 8px;
`

const NavLinks = styled.div`
  display: flex;
  gap: 2.5rem;
  order: 1;
  position: relative;
  z-index: 1;
`

const SocialLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  order: 3;
  margin-left: auto;
  align-items: center;
`

const SocialIcon = styled(motion.a)`
  color: white;
  font-size: 1.5rem;
  transition: all 0.3s ease;
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #ffffff;
  font-weight: 700;
  font-size: 1.2rem;
  position: relative;
  font-family: 'Unna', serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -4px;
    left: 0;
    background-color: #4287f5;
    transition: width 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    
    &:after {
      width: 100%;
    }
  }
  
  &:active {
    transform: translateY(1px);
  }
`

const ContactInfo = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  font-size: 0.9rem;
  opacity: 0.9;
  line-height: 1.4;
  
  p {
    margin: 0.2rem 0;
  }
  
  strong {
    font-size: 1rem;
  }
`

const AuthContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-right: 1rem;
`

const WelcomeText = styled.span`
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
`

const AuthButton = styled(Button)`
  background-color: #4287f5 !important;
  border: none !important;
  color: white !important;
  font-weight: 600 !important;
  padding: 0.5rem 1rem !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
  
  &:hover {
    background-color: #3a76d8 !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 4px 8px rgba(66, 135, 245, 0.3) !important;
  }
  
  &:active {
    transform: translateY(1px) !important;
  }
`

function Header() {
  return (
    <Nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <NavLinks>
        <StyledLink to="/sobre">Sobre</StyledLink>
        <StyledLink to="/test">Demo</StyledLink>
      </NavLinks>
      <Link to="/">
        <Logo 
          src={LogoImg} 
          alt="Logo" 
          whileHover={{ rotate: 5, scale: 1.1 }}
        />
      </Link>
      <SocialLinks>
        <AuthHeader />
        
        <SocialIcon 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          whileHover={{ y: -2, opacity: 0.8 }}
        >
          <FaGithub />
        </SocialIcon>
      </SocialLinks>
    </Nav>
  )
}

export default Header
