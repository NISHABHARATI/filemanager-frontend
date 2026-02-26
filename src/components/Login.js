import React, { useContext, useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LOGIN_URL } from '../utils/constant';
import toast from 'react-hot-toast';
import UserContext from '../utils/UserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const {setIsLogin} = useContext(UserContext);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateEmail();
    validatePassword();

    if (email && password && !emailError && !passwordError) {
        const loginData = {
            email,
            password,
        };

        try {
            const response = await fetch(LOGIN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            const contentType = response.headers.get('content-type');
            let result;

            if (contentType && contentType.includes('application/json')) {
                result = await response.json(); 
            } else {
                result = await response.text(); 
            }

            if (response.ok) {

                setIsLogin(true);
                sessionStorage.setItem('authToken', result.token); 
                sessionStorage.setItem('userDetails', JSON.stringify(result.user)); 
                navigate(`/dashboard`);
                toast.success("Logged In Successfully");
            } 
        } catch (error) {
            console.error('Error during login:', error);
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
      }}
    >
      <Card sx={{ width: 400, padding: 4, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Typography variant="h5" component="div" sx={{ textAlign: 'center', marginBottom: 2 }}>
            Login
          </Typography>
          <form noValidate onSubmit={handleSubmit}>
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
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
