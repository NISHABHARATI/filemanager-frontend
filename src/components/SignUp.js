import React, { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import  { SIGNUP_URL } from '../utils/constant';
import toast from 'react-hot-toast';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [contactError, setContactError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const navigate = useNavigate();

  const validateFirstName = () => {
    if (!firstName) {
      setFirstNameError('First name is required');
    } else {
      setFirstNameError('');
    }
  };

  const validateLastName = () => {
    if (!lastName) {
      setLastNameError('Last name is required');
    } else {
      setLastNameError('');
    }
  };

  const validateContact = () => {
    const regex = /^[0-9]{10}$/;
    if (!contact) {
      setContactError('Contact number is required');
    } else if (!regex.test(contact)) {
      setContactError('Contact number must be 10 digits');
    } else {
      setContactError('');
    }
  };

  const validateEmail = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
    } else if (!regex.test(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError('Password is required');
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }
  };

  const validateConfirmPassword = () => {
    if (!confirmPassword) {
      setConfirmPasswordError('Confirm password is required');
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateFirstName();
    validateLastName();
    validateContact();
    validateEmail();
    validatePassword();
    validateConfirmPassword();

   
    if (
      firstName &&
      lastName &&
      contact &&
      email &&
      password &&
      confirmPassword &&
      !firstNameError &&
      !lastNameError &&
      !contactError &&
      !emailError &&
      !passwordError &&
      !confirmPasswordError
    ) {
      const userData = {
        firstName,
        lastName,
        contact,
        email,
        password
      };

      try {
        const response = await fetch(SIGNUP_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          navigate('/login');
          toast.success("Signed Up Successfully")
        }
      } catch (error) {
        console.error('Error during signup:', error);
      }
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        marginTop:"70px"
      }}
    >
      <Card sx={{ width: 400, padding: 4, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Typography variant="h5" component="div" sx={{ textAlign: 'center', marginBottom: 2 }}>
            Sign Up
          </Typography>
          <form noValidate onSubmit={handleSubmit}>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={validateFirstName}
              error={Boolean(firstNameError)}
              helperText={firstNameError}
              required
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onBlur={validateLastName}
              error={Boolean(lastNameError)}
              helperText={lastNameError}
              required
            />
            <TextField
              label="Contact No"
              variant="outlined"
              fullWidth
              margin="normal"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              onBlur={validateContact}
              error={Boolean(contactError)}
              helperText={contactError}
              required
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validateEmail}
              error={Boolean(emailError)}
              helperText={emailError}
              required
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={validatePassword}
              error={Boolean(passwordError)}
              helperText={passwordError}
              required
            />
            <TextField
              label="Confirm Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={validateConfirmPassword}
              error={Boolean(confirmPasswordError)}
              helperText={confirmPasswordError}
              required
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{
                marginTop: 2,
                padding: 1,
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#115293',
                },
              }}
            >
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Signup;
