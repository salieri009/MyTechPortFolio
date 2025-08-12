import React from 'react'

function App() {
  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ color: '#333', marginBottom: '1rem' }}>
        🎉 Portfolio App is Working! 
      </h1>
      <p style={{ color: '#666', textAlign: 'center', maxWidth: '600px' }}>
        This is a test version to verify Azure Static Web Apps deployment. 
        If you can see this message, the deployment is successful!
      </p>
      <div style={{ marginTop: '2rem' }}>
        <button 
          onClick={() => alert('Button works!')}
          style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: '#007acc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Button
        </button>
      </div>
    </div>
  )
}

export default App
