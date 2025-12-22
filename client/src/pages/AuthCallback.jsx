import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthData } from '../store/slices/AuthSlice';
import LoadingSpinner from '../components/loading-spinner/LoadingSpinner';
import { Container } from 'react-bootstrap';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            // Store token in localStorage
            localStorage.setItem('token', token);

            // Decode token to get user info (simple decode, not verification)
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));

                // Dispatch setAuthData to update Redux state
                dispatch(
                    setAuthData({
                        user: {
                            id: payload.id,
                            email: payload.email,
                            isAdmin: payload.isAdmin,
                        },
                        token,
                    })
                );

                // Redirect based on user type
                if (payload.isAdmin) {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/user/home');
                }
            } catch (error) {
                console.error('Error processing OAuth token:', error);
                navigate('/login?error=invalid_token');
            }
        } else {
            navigate('/login?error=no_token');
        }
    }, [searchParams, navigate, dispatch]);

    return (
        <Container className="mt-5 text-center">
            <LoadingSpinner />
            <p className="mt-3">Completing sign in...</p>
        </Container>
    );
};

export default AuthCallback;
