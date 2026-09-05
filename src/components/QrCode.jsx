import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

function QrCode() {
  const [text, setText] = useState('https://github.com/theodora-sin');
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!text.trim()) {
      setError(null);
      return;
    }
    QRCode.toCanvas(canvasRef.current, text, { width: 200, margin: 1 }, (err) => {
      setError(err ? 'Could not generate QR code' : null);
    });
  }, [text]);

  const downloadPng = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'qr-code.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="qr-panel">
      <input
        type="text"
        className="qr-input"
        placeholder="Enter text or a URL…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="qr-canvas-wrap">
        {error && <div className="qr-error">{error}</div>}
        <canvas ref={canvasRef} className="qr-canvas" />
      </div>

      <button className="qr-download-btn" onClick={downloadPng}>Download PNG</button>
    </div>
  );
}

export default QrCode;