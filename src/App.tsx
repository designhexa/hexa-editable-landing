
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { EditorProvider } from '@/context/EditorContext';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from "@/components/ui/toaster";
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';
import './App.css';
import Layout from '@/components/Layout';
import NavigationManager from '@/components/NavigationManager';

function App() {
  return (
    <AuthProvider>
      <EditorProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/navigation" 
                element={
                  <ProtectedRoute>
                    <NavigationManager />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
          <Toaster />
        </Router>
      </EditorProvider>
    </AuthProvider>
  );
}

export default App;
