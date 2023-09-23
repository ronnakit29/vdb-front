import React, { useState } from 'react'

export default function CidReader() {
  const [cardData, setCardData] = useState(null);
  const [error, setError] = useState(null);

  const handleConnect = async () => {
    try {
      const device = await navigator.usb.requestDevice({ filters: [{ vendorId: 0x2CE3 }] });
      console.log('Device:', device);
      await device.open();
      console.log('Opened:', device);
      await device.selectConfiguration(1);
      await device.claimInterface(0);
      console.log('Claimed:', device);

      const result = await device.transferIn(1, 64);
      const cardData = bytesToHex(result.data);
      console.log('Card data:', cardData);
      setCardData(cardData);
      setError(null);
    } catch (error) {
      console.error('Error connecting to smart card reader:', error);
      setError('Error connecting to smart card reader');
    }
  };

  const bytesToHex = (bytes) => {
    return Array.from(new Uint8Array(bytes))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  };
  return (
    <div className="z-[999] bottom-0 left-0 text-black">
      <button onClick={handleConnect}>Connect</button>
      {cardData && <p>Card data: {cardData}</p>}
    </div>
  )
}
