import { useState } from 'react';

export const useCopyClipboard = () => {
  //コピーボタンを押下した際にチェックアイコンを表示する
  const [checkCopyWinFlag, setCheckCopyWinFlag] = useState<boolean>(false);
  const [checkCopyMacFlag, setCheckCopyMacFlag] = useState<boolean>(false);

  const copyToClipboard = async (alteredText: string, osCheck: boolean) => {
    await global.navigator.clipboard.writeText(alteredText);
    if (osCheck) {
      setCheckCopyWinFlag(true);
      setTimeout(() => {
        setCheckCopyWinFlag(false);
      }, 2000);
    } else {
      setCheckCopyMacFlag(true);
      setTimeout(() => {
        setCheckCopyMacFlag(false);
      }, 2000);
    }
  };

  return { checkCopyWinFlag, checkCopyMacFlag, copyToClipboard };
};
