import React from 'react';
import { useIsMobile } from './../../../../packages/mobile/src/useIsMobile';

const Mobiler = () => {
  const mobile = useIsMobile();
  return <div>Mobiler {JSON.stringify(mobile)}</div>;
};

export default Mobiler;
