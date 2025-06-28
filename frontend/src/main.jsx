import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY} 
      afterSignOutUrl='/'
      appearance={{
        baseTheme: "dark",
        variables: {
          colorPrimary: "#ffffff",
          colorBackground: "#000000",
          colorInputBackground: "#111111",
          colorInputText: "#ffffff",
          colorText: "#ffffff",
          colorTextSecondary: "#888888",
          colorSuccess: "#ffffff",
          colorDanger: "#ff4444",
          colorWarning: "#ffaa00",
          borderRadius: "4px",
          fontFamily: "system-ui, -apple-system, sans-serif"
        },
        elements: {
          formButtonPrimary: {
            backgroundColor: "#ffffff",
            color: "#000000",
            border: "1px solid #ffffff",
            "&:hover": {
              backgroundColor: "#f0f0f0",
              color: "#000000"
            }
          },
          card: {
            backgroundColor: "#000000",
            border: "1px solid #333333",
            boxShadow: "0 4px 6px rgba(255, 255, 255, 0.1)"
          },
          headerTitle: {
            color: "#ffffff",
            fontSize: "1.5rem",
            fontWeight: "bold"
          },
          headerSubtitle: {
            color: "#888888"
          },
          socialButtonsBlockButton: {
            backgroundColor: "#111111",
            border: "1px solid #333333",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#222222"
            }
          },
          formFieldInput: {
            backgroundColor: "#111111",
            border: "1px solid #333333",
            color: "#ffffff",
            "&:focus": {
              borderColor: "#ffffff",
              boxShadow: "0 0 0 1px #ffffff"
            }
          },
          formFieldLabel: {
            color: "#ffffff"
          },
          dividerLine: {
            backgroundColor: "#333333"
          },
          dividerText: {
            color: "#888888"
          },
          footerActionLink: {
            color: "#ffffff",
            "&:hover": {
              color: "#cccccc"
            }
          },
          identityPreviewText: {
            color: "#ffffff"
          },
          identityPreviewEditButton: {
            color: "#ffffff"
          }
        },
        layout: {
          logoImageUrl: undefined, // You can add your logo URL here
          showOptionalFields: false
        }
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
)