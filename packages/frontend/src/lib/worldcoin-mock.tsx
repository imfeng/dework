import React from 'react';

export interface IDKitWidgetProps {
  app_id: string;
  action: string;
  signal?: string;
  enableTelemetry?: boolean;
  onSuccess: (result: ISuccessResult) => void;
  handleVerify?: (result: ISuccessResult) => Promise<boolean>;
  credential_types?: string[];
  autoClose?: boolean;
}

export interface ISuccessResult {
  merkle_root: string;
  nullifier_hash: string;
  proof: string;
  credential_type: string;
  verification_level?: string;
}

export const IDKitWidget: React.FC<IDKitWidgetProps> = ({ onSuccess }) => {
  // Mock implementation
  const handleClick = () => {
    onSuccess({
      merkle_root: 'mock_merkle_root',
      nullifier_hash: 'mock_nullifier_hash',
      proof: 'mock_proof',
      credential_type: 'orb',
      verification_level: 'mock_verification_level'
    });
  };

  return (
    <div className="border rounded p-4 text-center">
      <h3 className="font-bold mb-2">WorldID Verification (Mock)</h3>
      <p className="mb-2">This is a mock implementation for development</p>
      <button 
        onClick={handleClick} 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Verify with World ID
      </button>
    </div>
  );
}; 