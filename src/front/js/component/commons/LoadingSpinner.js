import React from 'react';

const LoadingSpinner = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f8f9fa'
        }}>
            <div style={{
                textAlign: 'center'
            }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    border: '4px solid #e3e3e3',
                    borderTop: '4px solid #007bff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 20px'
                }}></div>
                <p style={{
                    color: '#666',
                    fontSize: '16px',
                    margin: 0
                }}>Cargando...</p>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default LoadingSpinner; 