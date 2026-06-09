import React, { useState, useEffect } from "react";
import { X, Key, HelpCircle, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { tmdb } from "../services/tmdb";

export default function SettingsModal({ isOpen, onClose, onKeySaved }) {
  const [apiKey, setApiKey] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null); // 'success' | 'error' | null

  useEffect(() => {
    if (isOpen) {
      setApiKey(tmdb.getApiKey() || "");
      setIsDemoMode(tmdb.isDemoMode());
      setVerificationResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      // Clear key and force demo mode
      tmdb.saveApiKey(null);
      tmdb.setDemoMode(true);
      onKeySaved();
      onClose();
      return;
    }

    setVerifying(true);
    setVerificationResult(null);
    
    const isValid = await tmdb.verifyApiKey(apiKey.trim());
    setVerifying(false);
    
    if (isValid) {
      tmdb.saveApiKey(apiKey.trim());
      setVerificationResult("success");
      setTimeout(() => {
        onKeySaved();
        onClose();
      }, 1000);
    } else {
      setVerificationResult("error");
    }
  };

  const handleUseDemo = () => {
    tmdb.setDemoMode(true);
    setIsDemoMode(true);
    setApiKey("");
    tmdb.saveApiKey(null);
    onKeySaved();
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glassmorphism" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <Key size={18} className="modal-title-icon" />
            <span>TMDB API Settings</span>
          </h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close settings">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="modal-body">
          <p className="modal-desc">
            To fetch real-time movies, CineSphere integrates with The Movie Database (TMDB). Please supply your personal API Key.
          </p>

          <div className="form-group">
            <label htmlFor="api-key-input">TMDB API Key (v3 auth)</label>
            <div className="input-with-icon">
              <input
                id="api-key-input"
                type="password"
                placeholder="Enter your TMDB API Key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="form-input"
              />
              {verifying && <Loader2 className="input-status-icon spinner" />}
              {!verifying && verificationResult === "success" && (
                <CheckCircle2 className="input-status-icon text-success" />
              )}
              {!verifying && verificationResult === "error" && (
                <XCircle className="input-status-icon text-error" />
              )}
            </div>
            {verificationResult === "error" && (
              <span className="field-error">Invalid API Key. Please verify and try again.</span>
            )}
          </div>

          <div className="demo-toggle-section">
            <div className="demo-toggle-info">
              <h4>Offline Demo Mode</h4>
              <p>Don't have a TMDB account? Browse using beautiful pre-configured offline movies.</p>
            </div>
            <button
              type="button"
              className={`demo-toggle-btn ${isDemoMode ? "active" : ""}`}
              onClick={handleUseDemo}
            >
              {isDemoMode ? "Demo Mode Active" : "Use Demo Mode"}
            </button>
          </div>

          <div className="modal-instructions">
            <h4>
              <HelpCircle size={14} />
              <span>How to get an API key:</span>
            </h4>
            <ol>
              <li>Register an account at <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer">themoviedb.org</a></li>
              <li>Go to your account settings and click on <strong>API</strong> in the sidebar</li>
              <li>Request an API key under the "Create" section</li>
              <li>Copy the <strong>API Key (v3 auth)</strong> and paste it above</li>
            </ol>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={verifying}>
              {verifying ? "Verifying..." : "Save API Key"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
