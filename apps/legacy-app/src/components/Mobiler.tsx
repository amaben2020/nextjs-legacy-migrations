import { useIsMobile } from '@repo/mobile';
import React from 'react';

const Mobiler = () => {
  const mobile = useIsMobile();

  return <div>Mobiler {JSON.stringify(mobile)}</div>;
};

export default Mobiler;
