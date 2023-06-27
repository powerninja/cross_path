import { useState, useEffect, useCallback } from 'react';

export const usePathConversion = () => {
  //パスの設定
  const [winPath, setWinPath] = useState<string>('');
  const [macPath, setMacPath] = useState<string>('');

  //変換後のパスを保存
  const [convertWinPath, setConvertWinPath] = useState<string>('');
  const [convertMacPath, setConvertMacPath] = useState<string>('');

  //コピーペースト機能で使用(Windows)
  const [resultWinText, setResultWinText] = useState<string>('');

  //コピーペースト機能で使用(Mac)
  const [resultMacText, setResultMacText] = useState<string>('');

  //変換ボタン押下時に、Pathの変換処理を実行する
  const convertWindowsPathToMac = useCallback(() => {
    //windowsのpathを変換
    if (winPath) {
      let macPaths = winPath.replace(/\\/g, '/').replace(/192.168.254.6/g, 'Volumes');
      //windows側のtextに入力された文字が2文字以上だった場合、パスの変換前に不要なスラッシュを削除する
      if (winPath.length !== 1) {
        //winPathの先頭の文字がスラッシュだった場合、スラッシュを削除する
        if (winPath[0] === '\\') {
          macPaths = macPaths.slice(1); //先頭の文字を削除
        }
      }
      setConvertMacPath(macPaths);
      setResultMacText(macPaths);
    } else {
      setConvertMacPath('');
      setResultMacText('');
    }
  }, [winPath]);

  const convertMacPathToWindows = useCallback(() => {
    //windowsのpathを変換
    if (macPath) {
      //パスの変換前に不要なバックスラッシュを削除する
      const replaceBackSlash = macPath.replace(/\\/g, '');
      //macのpathを変換
      const normalizWinPath = `\\${replaceBackSlash.replace(/\//g, '\\').replace(/Volumes/g, '192.168.254.6')}`;
      //文字コードをUTF8-mac(NFD)からUTF8(NFC)に変換する
      const winPaths = normalizWinPath.normalize('NFC');
      setConvertWinPath(winPaths);
      setResultWinText(winPaths);
    } else {
      setConvertWinPath('');
      setResultWinText('');
    }
  }, [macPath]);

  // pathが更新された時にconversionWinPathを呼び出し、パスの変換を行う
  useEffect(() => {
    convertWindowsPathToMac();
  }, [winPath, convertWindowsPathToMac]);

  // pathが更新された時にconversionMacPathを呼び出し、パスの変換を行う
  useEffect(() => {
    convertMacPathToWindows();
  }, [macPath, convertMacPathToWindows]);

  return {
    winPath,
    macPath,
    setWinPath,
    setMacPath,
    convertWinPath,
    convertMacPath,
    resultWinText,
    resultMacText,
    convertWindowsPathToMac,
    convertMacPathToWindows,
  };
};
